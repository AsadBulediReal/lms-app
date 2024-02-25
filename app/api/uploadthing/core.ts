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

      const file = req.files;
      if (file[0].size > 4 * 1024 * 1024) {
        throw new UploadThingError("File size exceeds the limit.");
      }

      return authResult; // Pass user ID or relevant data)
    })
    .onUploadComplete(() => {}),

  courseAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(async (req) => {
      const authResult = handelAuth();

      const file = req.files;
      if (file[0].size > 4 * 1024 * 1024) {
        throw new UploadThingError("File size exceeds the limit.");
      }

      return authResult; // Pass user ID or relevant data)
    })
    .onUploadComplete(() => {}),

  chapterVideo: f({ video: { maxFileSize: "512B", maxFileCount: 1 } })
    .middleware(async (req) => {
      const authResult = handelAuth();

      const file = req.files;
      if (file[0].size > 4 * 1024 * 1024) {
        throw new UploadThingError("File size exceeds the limit.");
      }

      return authResult; // Pass user ID or relevant data)
    })
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
