import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.log("[WEBHOOK_ERROR]", error);
    return NextResponse.json(
      {
        message: `Webhook Error: ${error.message}`,
      },
      {
        status: 400,
      }
    );
  }
  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session?.metadata?.userId;
  const courseId = session?.metadata?.courseId;
  const price = session?.metadata?.price;

  if (event.type === "checkout.session.completed") {
    if (!userId || !courseId) {
      return NextResponse.json(
        { message: "Webhook Error: Missing metadata" },
        { status: 400 }
      );
    }

    await db.purchase.create({
      data: {
        courseId: courseId,
        userId: userId,
        price: Number(price),
      },
    });
  } else {
    return NextResponse.json(
      { message: `Webhook Error: Unhandled event type ${event.type}` },
      { status: 200 }
    );
  }
  return NextResponse.json(null, { status: 200 });
}
