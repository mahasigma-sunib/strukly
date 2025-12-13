import React from "react";
import FoodIcon from "../components/categoryIcons/FoodIcon";
import GroceriesIcon from "../components/categoryIcons/GroceriesIcon";
import VehicleIcon from "../components/categoryIcons/VehicleIcon";
import ShoppingIcon from "../components/categoryIcons/ShoppingIcon";
import EntertainmentIcon from "../components/categoryIcons/EntertainmentIcon";
import OthersIcon from "../components/categoryIcons/OthersIcon";
import UtilityIcon from "../components/categoryIcons/UtilityIcons";

export const categoryColors: Record<string, string> = {
  food: "var(--fun-color-category-food)",
  groceries: "var(--fun-color-category-groceries)",
  transportation: "var(--fun-color-category-transportation)",
  housebills: "var(--fun-color-category-housebills)",
  shopping: "var(--fun-color-category-shopping)",
  entertainment: "var(--fun-color-category-entertainment)",
  others: "var(--fun-color-category-others)",
};

export const categoryIconMap: Record<string, React.ReactNode> = {
  food: <FoodIcon />,
  groceries: <GroceriesIcon />,
  transportation: <VehicleIcon />,
  shopping: <ShoppingIcon />,
  entertainment: <EntertainmentIcon />,
  housebills: <UtilityIcon />,
  others: <OthersIcon />,
};

export const getCategoryData = (category: string) => {
  const key = category?.toLowerCase();
  return {
    color: categoryColors[key] || categoryColors.others,
    icon: categoryIconMap[key] || categoryIconMap.others,
  };
};

// 4. Export the Type for use in props
export type CategoryKey = keyof typeof categoryColors;