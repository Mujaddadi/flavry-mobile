import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

import Logo from "common/Images/Logo";
import { FontSizes } from "assets/styles/theme";

const Search = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Logo />
      </View>
      <Text style={styles.logoHeading}>Because we love food</Text>

      <View>
        <TextInput
          style={styles.searchSection}
          placeholder="E.g Coffee"
          returnKeyType="search"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  logo: {
    width: "80%",
    height: 80,
  },
  logoHeading: { fontSize: FontSizes.xl },
  searchSection: {
    backgroundColor: "orange",
  },
});

export default Search;
