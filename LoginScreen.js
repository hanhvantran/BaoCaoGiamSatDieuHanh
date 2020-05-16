import * as React from "react";
import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  View,
  StatusBar,
  Alert,
  AsyncStorage,
  ScrollView
} from "react-native";
import ButtonCustom from "./components/ButtonCustom";
import FormTextInputCustom from "./components/FormTextInputCustom";
import imageLogo from "./assets/images/login.png";
import colors from "./config/colors";
import strings from "./config/strings";
import constants from "./config/constants";
import urlBaoCao from "./networking/services";
import Spinner from "react-native-loading-spinner-overlay";

interface State {
  email: string;
  password: string;
  emailTouched: boolean;
  passwordTouched: boolean;
  spinner: boolean;
}

class LoginScreen extends React.Component<{}, State> {
  
  passwordInputRef = React.createRef();
  state: State = {
    email: "",
    password: "",
    emailTouched: false,
    passwordTouched: false,
    spinner: false
  };
  _handleLogoutPress = async () => {
    try {
      const value = await AsyncStorage.getItem("UserInfomation");
      if (value !== null) {
        this.props.navigation.navigate("Home");
      }
      
    } catch (error) {
      Alert.alert("AsyncStorage error", error.message);
    }
  }
  componentDidMount() {
    this._handleLogoutPress();
  };
  handleEmailChange = (email: string) => {
    this.setState({ email: email });
  };

  handlePasswordChange = (password: string) => {
    this.setState({ password: password });
  };

  handleEmailSubmitPress = () => {
    if (this.passwordInputRef.current) {
      this.passwordInputRef.current.focus();
    }
  };

  handleEmailBlur = () => {
    this.setState({ emailTouched: true });
  };

  handlePasswordBlur = () => {
    this.setState({ passwordTouched: true });
  };

  handleLoginPress = () => {
    this.setState({
      spinner: true
    });
    return fetch(
      urlBaoCao.SP_KTDangNhap +
        "?TaiKhoan=" +
        this.state.email +
        "&MatKhau=" +
        this.state.password +
        ""
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          spinner: false
        });
        if (responseJson && responseJson.length > 0) 
        {
          //console.log("Thông báo12", responseJson[0].username);
         // let today = new Date().toLocaleDateString()
        //  let date = new Date();
         // date.setDate(date.getDate() + 3);

          AsyncStorage.setItem(
            "UserInfomation",
            JSON.stringify(responseJson[0])
          );
        //  AsyncStorage.setItem('timeLogin', date);
          var { navigate } = this.props.navigation;
          navigate("Home");
        } else {
          Alert.alert("Thông báo", "Sai thông tin đăng nhập!");
        }
      })
      .catch(error => {
        this.setState({
          spinner: false
        });
        Alert.alert("Lỗi kết nối!", error.toString());
      });
  };
  render() {
    const { email, password, emailTouched, passwordTouched } = this.state;
    const emailError =
      !email && emailTouched ? strings.EMAIL_REQUIRED : undefined;
    const passwordError =
      !password && passwordTouched ? strings.PASSWORD_REQUIRED : undefined;
    return (
      <KeyboardAvoidingView
        style={styles.container}
        // On Android the keyboard behavior is handled
        // by Android itself, so we should disable it
        // by passing `undefined`.
        // behavior={constants.IS_IOS ? "padding" : "padding"}
        behavior={"padding"}
      >
        {/* keyboardVerticalOffset = {Header.HEIGHT + 20} // adjust the value here if you need more padding
  style = {{ flex: 1 }}
  behavior = "padding"  */}
        <Spinner
          visible={this.state.spinner}
          textContent={"Đang chuyển trang..."}
          textStyle={styles.spinnerTextStyle}
        />
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <Image source={imageLogo} style={styles.logo} />
        <View style={styles.form}>
          <FormTextInputCustom
            value={this.state.email}
            onChangeText={this.handleEmailChange}
            onSubmitEditing={this.handleEmailSubmitPress}
            placeholder={strings.EMAIL_PLACEHOLDER}
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="next"
            onBlur={this.handleEmailBlur}
            error={emailError}
            // `blurOnSubmit` causes a keyboard glitch on
            // Android when we want to manually focus the
            // next input.
            blurOnSubmit={constants.IS_IOS}
          />
          <FormTextInputCustom
            ref={this.passwordInputRef}
            value={this.state.password}
            onChangeText={this.handlePasswordChange}
            placeholder={strings.PASSWORD_PLACEHOLDER}
            secureTextEntry={true}
            returnKeyType="done"
            onBlur={this.handlePasswordBlur}
            error={passwordError}
          />
          <ButtonCustom
            label={strings.LOGIN}
            onPress={this.handleLoginPress}
            disabled={!email || !password}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    alignItems: "center",
    justifyContent: "space-between"
  },
  logo: {
    flex: 1,
    width: "100%",
    resizeMode: "contain",
    alignSelf: "center"
  },
  form: {
    flex: 1,
    justifyContent: "center",
    width: "80%"
  }
});

export default LoginScreen;
