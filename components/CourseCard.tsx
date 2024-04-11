import Image from "next/image";
import Link from "next/link";
import IconBadge from "@/components/IconBadge";
import { BookOpen } from "lucide-react";
import { formatprice } from "@/lib/format";

interface CourseCardProps {
  id: string;
  title: string;
  category: string;
  chaptersLength: number;
  progress: number | null;
  imageUrl: string;
  price: number;
}

const CourseCard = ({
  id,
  title,
  category,
  chaptersLength,
  progress,
  imageUrl,
  price,
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        </div>
        <div className="flex flex-col pt-2">
          <h1 className="text-lg md:text-base font-medium group-hover:text-sky-700">
            {title}
          </h1>
          <p className="text-xs text-muted-foreground text-slate-700 group-hover:text-sky-700">
            {category}
          </p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size={"sm"} icon={BookOpen} />
              <span className="text-slate-500">
                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>
          {progress !== null ? (
            <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
              TODO: Progress component
            </div>
          ) : price === 0 ? (
            <p className="text-base md:text-sm font-medium text-slate-700">
              FREE
            </p>
          ) : (
            <p className="text-base md:text-sm font-medium text-slate-700">
              {formatprice(price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
