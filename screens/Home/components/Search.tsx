import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { z } from "zod";

import { Colors, FontSizes, Spacing } from "assets/styles/theme";
import Logo from "common/Images/Logo";
import { wp } from "utils/dimensions";

import DeliveryToggle from "./DeliveryToggle";

const searchSchema = z.object({
  query: z
    .string()
    .trim()
    .min(1, "Enter a dish to search")
    .max(100)
    .transform((val) => val.replace(/<[^>]*>/g, "")), // strip any HTML tags
});

type SearchForm = z.infer<typeof searchSchema>;

interface SearchProps {
  onSearch: (query: string) => void;
}

const Search = ({ onSearch }: SearchProps) => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    mode: "onChange",
    defaultValues: { query: "" },
  });

  const submit = ({ query }: SearchForm) => onSearch(query);

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Logo />
      </View>
      <Text style={styles.tagline}>Because we love food</Text>

      <Controller
        control={control}
        name="query"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Search dishes"
            placeholderTextColor={Colors.gray3}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            returnKeyType="search"
            onSubmitEditing={handleSubmit(submit)}
            accessibilityLabel="Search dishes"
            maxLength={100}
          />
        )}
      />

      <Pressable
        style={styles.searchButton}
        onPress={handleSubmit(submit)}
        disabled={!isValid}
        accessibilityRole="button"
        accessibilityLabel="Search"
        accessibilityState={{ disabled: !isValid }}
      >
        <Text style={styles.searchButtonText}>Search</Text>
      </Pressable>

      <DeliveryToggle />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: Spacing.reg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  logo: {
    width: wp(60),
    height: 70,
  },
  tagline: {
    fontSize: FontSizes.md,
    color: Colors.gray2,
  },
  input: {
    width: "100%",
    height: 44,
    borderWidth: 1,
    borderColor: Colors.gray4,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.black2,
    backgroundColor: Colors.white,
  },
  searchButton: {
    width: "100%",
    height: 44,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButtonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: "700",
  },
});

export default Search;
