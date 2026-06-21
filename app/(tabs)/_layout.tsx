import { Tabs } from "expo-router";
import MaterialIcons from "@react-native-vector-icons/material-icons";

import AppHeader from "common/AppHeader";
import { Colors } from "assets/styles/theme";
import { useHomeStore } from "store/homeStore";

export default function Layout() {
  const { location } = useHomeStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primaryHover,
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.primaryLight,
        headerTitleAlign: "left",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: () => <AppHeader title={location} />,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="search" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dishSearch"
        options={{
          title: "Dishes",
          headerShown: false,
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.primaryLight,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="fastfood" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="restaurantSearch"
        options={{
          title: "Restaurant",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="restaurant" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reservations"
        options={{
          title: "Reservation",
          headerTitle: () => <AppHeader title="Reservations" />,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="calendar-month" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerTitle: () => <AppHeader title="Profile" />,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
