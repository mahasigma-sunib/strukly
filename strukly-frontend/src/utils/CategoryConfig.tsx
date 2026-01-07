import React from "react";
import FoodIcon from "../components/categoryIcons/FoodIcon";
import GroceriesIcon from "../components/categoryIcons/GroceriesIcon";
import VehicleIcon from "../components/categoryIcons/VehicleIcon";
import ShoppingIcon from "../components/categoryIcons/ShoppingIcon";
import EntertainmentIcon from "../components/categoryIcons/EntertainmentIcon";
import OthersIcon from "../components/categoryIcons/OthersIcon";
import UtilityIcon from "../components/categoryIcons/UtilityIcons";

export const categoryColors: Record<string, string> = {
  food: "bg-category-food",
  groceries: "bg-category-groceries",
  transportation: "bg-category-transportation",
  housebills: "bg-category-housebills",
  shopping: "bg-category-shopping",
  entertainment: "bg-category-entertainment",
  others: "bg-category-others",
};

export const getCategoryData = (category: string) => {
  const key = category?.toLowerCase();
  
  const color = categoryColors[key] || categoryColors.others;
  let icon: React.ReactNode;

  switch (key) {
    case "food":
      icon = <FoodIcon />;
      break;
    case "groceries":
      icon = <GroceriesIcon />;
      break;
    case "transportation":
      icon = <VehicleIcon />;
      break;
    case "shopping":
      icon = <ShoppingIcon />;
      break;
    case "entertainment":
      icon = <EntertainmentIcon />;
      break;
    case "housebills":
      icon = <UtilityIcon />;
      break;
    case "others":
    default:
      icon = <OthersIcon />;
      break;
  }

  return { color, icon };
};

// 4. Export the Type for use in props
export type CategoryKey = keyof typeof categoryColors;

export const CategoryKeys = Object.keys(
  categoryColors
) as CategoryKey[];