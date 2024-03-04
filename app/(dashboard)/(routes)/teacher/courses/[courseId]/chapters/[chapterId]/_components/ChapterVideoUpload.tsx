"use client";

import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Loader2, Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";
import FileUpload from "@/components/FileUpload";
import MuxPlayer from "@mux/mux-player-react";

interface ChapterVideoUploadProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1, {
    message: "Video is required",
  }),
  deletevidoeUrl: z.string().min(1).nullable(),
});

const ChapterVideoUpload = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoUploadProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsUpdating(true);
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, {
        videoUrl: data.videoUrl,
      });

      toast.success("Chapter Video updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("something went wrong!");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 relative">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Chapter Video
        <Button variant={"outline"} onClick={toggleEdit}>
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a Video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md m-2">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""} />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({
                  videoUrl: url,
                  deletevidoeUrl: initialData.videoUrl,
                });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload This Chapter&apos;s Video
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <p className="text-xs text-muted-foreground mt-2">
          Video can take few minutes to process. Refresh the page if video does
          not appear.
        </p>
      )}
    </div>
  );
};

export default ChapterVideoUpload;
