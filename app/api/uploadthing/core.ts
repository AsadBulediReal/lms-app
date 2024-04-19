import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handelAuth = () => {
  const { userId } = auth();
  if (!userId) {
    throw new UploadThingError("Unauthorized");
  }
  return { userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async (req) => {
      const authResult = handelAuth();

      return authResult; // Pass user ID or relevant data)
    })
    .onUploadComplete(() => {}),

  courseAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(async (req) => {
      const authResult = handelAuth();

      return authResult; // Pass user ID or relevant data)
    })
    .onUploadComplete(() => {}),

  chapterVideo: f({ video: { maxFileSize: "4GB", maxFileCount: 1 } })
    .middleware(async (req) => {
      const authResult = handelAuth();

      return authResult; // Pass user ID or relevant data)
    })
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
