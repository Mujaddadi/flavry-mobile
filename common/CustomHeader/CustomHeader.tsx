import { View, Text, useWindowDimensions } from "react-native";
import { useRoute } from "@react-navigation/native";

import { getHeaderName } from "./utilityFunctions";

const CustomHeader = () => {
  const route = useRoute();
  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        width: width - 30, // Otherwise, the header moved away from the screen from the left
      }}
    >
      <View
        style={{ flex: 1, justifyContent: "center", backgroundColor: "blue" }}
      >
        <Text> {getHeaderName(route.name)} </Text>
      </View>

      <View
        style={{
          flex: 2,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "red",
        }}
      >
        <Text> Center </Text>
      </View>

      <View
        style={{
          flex: 1,
          alignItems: "flex-end",
          justifyContent: "center",
          backgroundColor: "green",
        }}
      >
        <Text> right text </Text>
      </View>
    </View>
  );
};

export default CustomHeader;
