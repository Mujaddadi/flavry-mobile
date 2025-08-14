export const getHeaderName = (name: string) => {
  switch (name) {
    case "index":
      return "Home";
    case "dishSearch":
      return "Dishes";
    case "restaurantSearch":
      return "Restaurant";
    case "reservations":
      return "Reservations";
    case "profile":
      return "Profile";
    default:
      return "";
  }
};
