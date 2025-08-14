import { Text, View } from "react-native";

import Search from "./Search";

const Home = () => {
  return (
    <View>
      <Search />

      <View>
        <Text style={{ backgroundColor: "green" }}>Quick search options</Text>
      </View>
      <View>
        <Text style={{ backgroundColor: "yellow" }}>Coupons</Text>
      </View>
      <View>
        <Text style={{ backgroundColor: "brown" }}>Favourite Dishes</Text>
      </View>
      <View>
        <Text style={{ backgroundColor: "blue" }}>Favourite Restaurants</Text>
      </View>
      <View>
        <Text style={{ backgroundColor: "blue" }}>Popular Restaurants</Text>
      </View>
    </View>
  );
};

export default Home;
