import { Text, TextInput, View } from "react-native";

const Home = () => {
  return (
    <View>
      <View>
        <Text style={{ backgroundColor: "pink" }}>Search and logo section</Text>
      </View>
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
