import { View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";

import { getHeaderName } from "./utilityFunctions";

const CustomHeader = () => {
  const route = useRoute();

  return (
    <View>
      <Text> {getHeaderName(route.name)} </Text>
    </View>
  );
};

export default CustomHeader;
