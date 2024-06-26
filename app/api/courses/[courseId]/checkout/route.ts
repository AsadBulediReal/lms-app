import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();
    if (!user || !user.id || !user.emailAddresses?.[0].emailAddress) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const course = await db.course.findUnique({
      where: { id: params.courseId, isPublished: true },
    });
    if (!course) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });
    if (purchase) {
      return NextResponse.json(
        { message: "Already purchased" },
        { status: 400 }
      );
    }
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          product_data: {
            name: course.title,
            description: course.description!,
            images: [course.imageUrl!],
          },
          unit_amount: course.isFree ? 0 : Math.round(course.price! * 100),
        },
      },
    ];
    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });
    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
      });
      stripeCustomer = await db.stripeCustomer.create({
        data: {
          userId: user.id,
          stripeCustomerId: customer.id,
        },
      });
    }
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      payment_method_types: ["card", "amazon_pay"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
      metadata: {
        courseId: course.id,
        userId: user.id,
        price: course.isFree ? 0 : course.price,
      },
    });
    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.log("[COURSE_CHECKOUT]", error);
    return NextResponse.json(
      { message: "Internal Error" },
      {
        status: 500,
      }
    );
  }
}
