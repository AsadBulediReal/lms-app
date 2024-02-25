"use client";

import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import FileUpload from "@/components/FileUpload";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
  name: z.string().min(1).optional(),
});

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deleteingId, setDeleteingId] = useState<string | null>(null);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, data);
      toast.success("Added attachment");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("something went wrong!");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Attachments
        <Button variant={"outline"} onClick={toggleEdit}>
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a File
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="m-2 p-1 pl-4 bg-slate-200 font-medium md:text-lg rounded-md text-slate-500 italic">
              No attachments yet
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2 mt-2">
              {initialData.attachments.map((attachment) => (
                <div
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md justify-between"
                  key={attachment.id}
                >
                  <div className="flex items-center justify-center">
                    <File className="h-4 w-4 mr-3 flex-shrink-0" />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </div>
                  {deleteingId === attachment.id ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <button
                      className="ml-auto hover:opacity-75 transition"
                      onClick={async () => {
                        try {
                          setDeleteingId(attachment.id);

                          await axios.post(
                            `/api/courses/${courseId}/attachments/${attachment.id}`,
                            { url: attachment.url }
                          );
                          toast.success("Deleted attachment");
                          router.refresh();
                        } catch (error) {
                          toast.error("something went wrong!");
                        } finally {
                          setDeleteingId(null);
                        }
                      }}
                    >
                      <X className="h-6 w-6 " />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url, name) => {
              if (url) {
                onSubmit({ url: url, name: name });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add anything that your students may need to successfully complete
            this course.
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;
