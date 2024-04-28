import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handelAuth = () => {
  const { userId, sessionClaims } = auth();
  if (!userId && sessionClaims?.metadata?.role === "admin") {
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

  courseAttachment: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 4,
    },
    video: {
      maxFileSize: "128MB",
      maxFileCount: 1,
    },
    text: {
      maxFileSize: "16MB",
      maxFileCount: 4,
    },
    pdf: {
      maxFileSize: "64MB",
      maxFileCount: 1,
    },
  })
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
