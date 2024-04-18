import { Chapter, Course, UserProgress } from "@prisma/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CourseSideBar from "./CourseSideBar";
import { Menu } from "lucide-react";

interface CourseMobileSideBarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };

  progress: number | null;
}

const CourseMobileSideBar = ({
  course,
  progress,
}: CourseMobileSideBarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75">
        <Menu />
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0 bg-white w-72">
        <CourseSideBar course={course} progress={progress} />
      </SheetContent>
    </Sheet>
  );
};

export default CourseMobileSideBar;
