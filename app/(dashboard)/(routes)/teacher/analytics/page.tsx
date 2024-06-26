import { getAnalytics } from "@/actions/get-analytics";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import DataCard from "./_components/DataCard";
import Chart from "./_components/Chart";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teacher - Analytics",
};

const Analytics = async () => {
  const { userId, sessionClaims } = auth();

  if (!userId || sessionClaims?.metadata?.role !== "admin") {
    return redirect("/");
  }

  const { data, totalRevenue, totalSales } = await getAnalytics(userId);

  return (
    <div className="p-6 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard
          label="Total Revenue"
          value={totalRevenue}
          shouldFormat={true}
        />
        <DataCard label="Total Sales" value={totalSales} />
      </div>
      <Chart data={data} />
    </div>
  );
};

export default Analytics;
