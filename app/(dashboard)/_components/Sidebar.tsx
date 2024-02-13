import React from "react";
import Logo from "./Logo";
import SidebarRoutes from "./SidebarRoutes";

const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="flex justify-center pt-4">
        <Logo />
      </div>
      <div className="flex flex-col w-full pt-4">
        <SidebarRoutes />
      </div>
    </div>
  );
};

export default Sidebar;
