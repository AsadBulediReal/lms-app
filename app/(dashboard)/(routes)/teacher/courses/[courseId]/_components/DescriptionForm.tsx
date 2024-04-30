"use client";

import * as z from "zod";
import axios from "axios";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { Course } from "@prisma/client";
import Preview from "@/components/Preview";
import Editor from "@/components/Editor";

interface DescriptionFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  description: z
    .string()
    .min(10, {
      message: "The description must contain a minimum of 10 characters.",
    })
    .max(500, {
      message: "The description must contain a maximum of 500 characters.",
    }),
});

const DescriptionForm = ({ initialData, courseId }: DescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description!,
    },
    mode: "all",
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, data);
      toast.success("Course description updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("something went wrong!");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Description
        <Button variant={"outline"} onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Description
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <div
          className={cn(
            "m-2 p-1 pl-4 bg-slate-200 font-medium md:text-lg rounded-md text-ellipsis overflow-hidden",
            !initialData.description && "text-slate-500 italic"
          )}
        >
          {!initialData.description && "No Description"}
          {initialData.description && (
            <Preview value={initialData.description} />
          )}
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default DescriptionForm;
