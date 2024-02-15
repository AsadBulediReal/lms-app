"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toast } from "@/components/ui/toast";
import toast from "react-hot-toast";

const formSchema = z.object({
  title: z.string().min(4, {
    message: "The title must contain a minimum of 4 characters.",
  }),
});

const CreateCourse = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/courses", data);
      router.push(`/courses/${response.data.id}`);
    } catch (error) {
      toast.error("something went wrong!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div className="">
        <h1 className="text-2xl">Name your course</h1>
        <p className="text-sm text-slate-600">
          What would you like to name your cousre? Don&apos;t worry you can
          change it later.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl {...field}>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Advance web development'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What will you teach in this Course?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              {!isValid || isSubmitting ? (
                <Link href={"/"}>
                  <Button size={"sm"} variant={"destructive"} type="button">
                    Cancel
                  </Button>
                </Link>
              ) : (
                <Button
                  size={"sm"}
                  variant={"destructive"}
                  type="button"
                  disabled={true}
                >
                  Cancel
                </Button>
              )}
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                variant={"default"}
              >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateCourse;
