import { zodResolver } from "@hookform/resolvers/zod";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Colors, FontSizes, Spacing } from "assets/styles/theme";
import { useHomeStore } from "store/homeStore";

interface SearchHeaderProps {
  title: string;
  placeholder?: string;
  defaultQuery?: string;
  onSearch: (query: string) => void;
}

const searchSchema = z.object({
  query: z
    .string()
    .trim()
    .max(100)
    .transform((val) => val.replace(/<[^>]*>/g, "")),
});

type SearchForm = z.infer<typeof searchSchema>;

const SearchHeader = ({
  title,
  placeholder = "Search...",
  defaultQuery = "",
  onSearch,
}: SearchHeaderProps) => {
  const { cartCount } = useHomeStore();

  const { control, handleSubmit, setValue } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: defaultQuery },
  });

  useEffect(() => {
    setValue("query", defaultQuery);
  }, [defaultQuery, setValue]);

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <Controller
        control={control}
        name="query"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.searchInput}
            placeholder={placeholder}
            placeholderTextColor={Colors.gray4}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            returnKeyType="search"
            onSubmitEditing={handleSubmit(({ query }) => onSearch(query))}
            accessibilityLabel={`Search ${title}`}
            maxLength={100}
          />
        )}
      />
      <Pressable
        style={styles.cartButton}
        accessibilityRole="button"
        accessibilityLabel={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
      >
        <MaterialIcons name="shopping-cart" size={24} color={Colors.white} />
        {cartCount > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartCount}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.reg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  title: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: "700",
  },
  searchInput: {
    flex: 1,
    height: 36,
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.sm,
    color: Colors.black2,
  },
  cartButton: {
    padding: Spacing.xs,
  },
  cartBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  cartBadgeText: {
    color: Colors.primary,
    fontSize: FontSizes.xs - 2,
    fontWeight: "700",
  },
});

export default SearchHeader;
