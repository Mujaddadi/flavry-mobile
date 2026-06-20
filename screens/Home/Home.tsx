import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

import { Colors, Spacing } from "assets/styles/theme";
import { useFavouriteDishes } from "hooks/useFavouriteDishes";
import { useFavouriteRestaurants } from "hooks/useFavouriteRestaurants";
import { useCategories } from "hooks/useCategories";
import { usePopularRestaurants } from "hooks/usePopularRestaurants";
import { usePromoBanners } from "hooks/usePromoBanners";
import { Dish, Restaurant } from "types/home";

import CategoryStrip from "./components/CategoryStrip";
import PromoCarousel from "./components/PromoCarousel";
import SectionCarousel from "./components/SectionCarousel";
import Search from "./Search";
import { SectionType } from "types/common";

const Home = () => {
  const router = useRouter();

  const { data: categories, isPending: categoriesLoading } = useCategories();
  const { data: banners, isPending: bannersLoading } = usePromoBanners();
  const { data: favouriteDishes, isPending: dishesLoading } =
    useFavouriteDishes();
  const { data: favouriteRestaurants, isPending: favRestLoading } =
    useFavouriteRestaurants();
  const { data: popularRestaurants, isPending: popRestLoading } =
    usePopularRestaurants();

  const handleSearch = (query: string) => {
    router.push({ pathname: "/(tabs)/dishSearch", params: { query } });
  };

  const handleCategorySelect = (category: { id: string; name: string }) => {
    router.push({
      pathname: "/(tabs)/dishSearch",
      params: { category: category.name },
    });
  };

  const handleDishSelect = (dish: Dish) => {
    router.push({
      pathname: "/(tabs)/dishSearch",
      params: { dish: dish.name },
    });
  };

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    router.push({
      pathname: "/(tabs)/restaurantSearch",
      params: { id: restaurant.id },
    });
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Search onSearch={handleSearch} />

      <View style={styles.section}>
        <CategoryStrip
          categories={categories}
          loading={categoriesLoading}
          onSelect={handleCategorySelect}
        />
      </View>

      <PromoCarousel banners={banners} loading={bannersLoading} />

      <SectionCarousel
        title="Favourite Dishes"
        type={SectionType.DISH}
        data={favouriteDishes}
        loading={dishesLoading}
        onPress={handleDishSelect}
      />

      <SectionCarousel
        title="Favourite Restaurant"
        type={SectionType.RESTAURANT}
        data={favouriteRestaurants}
        loading={favRestLoading}
        onPress={handleRestaurantSelect}
      />

      <SectionCarousel
        title="Popular Restaurant"
        type={SectionType.RESTAURANT}
        data={popularRestaurants}
        loading={popRestLoading}
        onPress={handleRestaurantSelect}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: Spacing.xxxl,
  },
  section: {
    marginBottom: Spacing.lg,
  },
});

export default Home;
