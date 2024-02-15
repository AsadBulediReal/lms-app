"use client";

import { BarChart, Compass, Layout, List } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { usePathname, useRouter } from "next/navigation";

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytic",
    href: "/teacher/analytics",
  },
];

const SidebarRoutes = () => {
  const pathName = usePathname();
  const router = useRouter();

  const isTeacherPage = pathName.includes("/teacher");

  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          href={route.href}
          label={route.label}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
