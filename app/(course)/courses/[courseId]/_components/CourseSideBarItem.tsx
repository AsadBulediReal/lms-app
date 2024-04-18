"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface CourseSideBarItemProps {
  id: string;
  label: string;
  courseId: string;
  isCompleted: boolean;
  isLocked: boolean;
}

const CourseSideBarItem = ({
  id,
  label,
  courseId,
  isCompleted,
  isLocked,
}: CourseSideBarItemProps) => {
  const router = useRouter();
  const pathName = usePathname();

  const Icon = isLocked ? Lock : isCompleted ? CheckCircle : PlayCircle;
  const isActive = pathName.includes(id);
  const handleClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  };
  return (
    <button
      type="button"
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm font-[500] transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive &&
          "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700",
        isCompleted && "text-emerald-700 hover:text-emerald-700",
        isCompleted && isActive && "bg-emerald-200/20"
      )}
    >
      <div
        className="flex justify-between items-center p-4 w-[96%]"
        onClick={handleClick}
      >
        <Icon
          className={cn(
            "text-slate-500",
            isActive && "text-sky-700",
            isCompleted && "text-emerald-700"
          )}
          size={22}
        />
        <p className="text-left text-base text-ellipsis w-[90%] overflow-hidden">
          {label}
        </p>
      </div>
      <div
        className={cn(
          "ml-auto opacity-0  border-2 border-slate-700 h-full transition-all",
          isActive && "opacity-100",
          isCompleted && "border-emerald-700"
        )}
      />
    </button>
  );
};

export default CourseSideBarItem;
