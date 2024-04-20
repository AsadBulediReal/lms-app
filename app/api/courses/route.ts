import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    const { userId, sessionClaims } = auth();
    const { title } = await req.json();

    if (sessionClaims?.metadata.role !== "admin" || !userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const coures = await db.course.create({
      data: {
        userId,
        title,
      },
    });
    return NextResponse.json(coures);
  } catch (error) {
    console.log("[COURSES]", error);
    return NextResponse.json(
      { message: "Internal Error" },
      {
        status: 500,
      }
    );
  }
}
