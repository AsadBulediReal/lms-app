

import { db } from "@/lib/db";
import React from "react";
import Categories from "./_components/Categories";

const SearchPage = async () => {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return <div>{<Categories items={categories} />}</div>;
};

export default SearchPage;
