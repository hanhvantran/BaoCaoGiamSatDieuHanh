import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity
} from "react-native";
import GridView from "react-native-super-grid";
import Icon from "react-native-vector-icons/FontAwesome";

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

let TouchablePlatformSpecific =
  Platform.OS === "ios" ? TouchableOpacity : TouchableNativeFeedback;
const RippleColor = (...args) =>
  Platform.Version >= 21 ? TouchablePlatformSpecific.Ripple(...args) : null;

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      width: width,
      height: height
    };
  }

  onLayout(e) {
    const { width } = Dimensions.get("window");
    const { height } = Dimensions.get("window");
    this.setState({ width, height });
  }

  render() {
    console.log(!this.props.background);
    var type = this.props.type;
    var color = !this.props.color ? "#3498db" : this.props.color;
    var size = !this.props.size ? 40 : this.props.size;
    var column = !this.props.column ? 2 : this.props.column;
    var row = !this.props.row ? 2 : this.props.row;
    var dim = this.state.width / column - 20;
    var dim2 = this.state.height / row - 40;
    return (
      <View onLayout={this.onLayout.bind(this)} style={{ flex: 1 }}>
        <GridView
          itemDimension={dim}
          items={this.props.items}
          style={styles.gridView}
          renderItem={item => (
            <TouchablePlatformSpecific
              onPress={() => {
                this.props.card(item);
              }}
              delayPressIn={0}
              delayPressOut={0}
              useForeground={true}
              background={RippleColor("#fff")}
            >
              <View
                style={[
                  styles.itemContainer,
                  {
                    backgroundColor:
                      !item.background || !this.props.background
                        ? "#fff"
                        : item.background,
                    height: type ? dim2 : dim
                  }
                ]}
              >
                <Icon
                  name={item.icon}
                  size={size}
                  color={
                    !item.background || !this.props.background ? color : "#fff"
                  }
                />
                <Text
                  style={[
                    styles.itemName,
                    {
                      color:
                        !item.background || !this.props.background
                          ? "#000"
                          : "#fff"
                    }
                  ]}
                >
                  {item.name}
                </Text>
              </View>
            </TouchablePlatformSpecific>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  gridView: {
    flex: 1
  },
  itemContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5
  },
  itemName: {
    fontSize: 14,
    fontWeight: "400",
    paddingTop: 10,
    fontStyle: 'italic'
  }
});
