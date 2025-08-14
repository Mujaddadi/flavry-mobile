import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "assets/styles/theme";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primaryHover,
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.primaryLight,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="search" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dishSearch"
        options={{
          title: "Fast Food",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="fastfood" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="restaurantSearch"
        options={{
          title: "Restaurant",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="restaurant" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reservations"
        options={{
          title: "Reservation",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="calendar-month" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
