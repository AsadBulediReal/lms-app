"use client";

import { Category } from "@prisma/client";
import {
  FcEngineering,
  FcFilmReel,
  FcAbout,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
} from "react-icons/fc";
import { FaCodeCompare } from "react-icons/fa6";
import { IconType } from "react-icons/lib";
import CategoriesItem from "./CategoriesItem";

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  Music: FcMusic,
  Filming: FcFilmReel,
  Photography: FcOldTimeCamera,
  Fitness: FcSportsMode,
  Accounting: FcSalesPerformance,
  "Computer science": FcMultipleDevices,
  Engineering: FcEngineering,
  DevOps: FaCodeCompare,
};

const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-auto pb-4">
      {items.map((item) => (
        <CategoriesItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}{" "}
    </div>
  );
};

export default Categories;
