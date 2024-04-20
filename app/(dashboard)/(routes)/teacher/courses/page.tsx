
import React from "react";
import { DataTable } from "./_components/DataTable";
import { columns } from "./_components/columns";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const courses = async () => {
  const { userId, sessionClaims } = auth();

  if (sessionClaims?.metadata.role !== "admin" || !userId) {
    return redirect("/");
  }
  const course = await db.course.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={course} />
    </div>
  );
};

export default courses;
