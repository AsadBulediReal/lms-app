import React from "react";
import MobileSidebar from "./MobileSidebar";
import NavbarRoutes from "@/components/NavbarRoutes";
import { auth } from "@clerk/nextjs";

const Navbar = () => {
  const { sessionClaims } = auth();
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <MobileSidebar />
      <NavbarRoutes role={sessionClaims?.metadata.role} />
    </div>
  );
};

export default Navbar;
