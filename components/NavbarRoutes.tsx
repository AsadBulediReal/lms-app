"use client";

import { UserButton, auth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import SearchInput from "./SearchInput";

interface NavbarRoutesProps {
  role: string | undefined;
}

const NavbarRoutes = ({ role }: NavbarRoutesProps) => {
  const pathName = usePathname();

  const isTeacherPage = pathName?.startsWith("/teacher");
  const isCoursePage = pathName?.includes("/courses");
  const isSearchPage = pathName.startsWith("/search");

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isCoursePage ? (
          <Link href={"/"}>
            <Button size={"sm"} variant={"ghost"}>
              <LogOut className="h-4 w-4 mr-2" />
              {isCoursePage ? "Back to dashboard" : "Exist"}
            </Button>
          </Link>
        ) : (
          role === "admin" && (
            <Link href={"/teacher/courses"}>
              <Button size={"sm"} variant={"ghost"}>
                Teacher Mode
              </Button>
            </Link>
          )
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};

export default NavbarRoutes;
