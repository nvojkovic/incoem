import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import stripe from "stripe";

export const createSubsctiption = async (req: Request, res: Response) => {
  let userId = (req as any).session!.getUserId();
  const prisma = new PrismaClient();
  const cl = new stripe(process.env.STRIPE_SECRET_KEY || "");
  const info = await prisma.userInfo.findUnique({
    where: {
      id: userId,
    },
  });
  let user = await prisma.emailpassword_users.findFirst({
    where: {
      user_id: userId,
      app_id: "public",
    },
  });
  let customer: any;
  if (!info?.customerId) {
    const cl = new stripe(process.env.STRIPE_SECRET_KEY || "");
    const customer = await cl.customers.create({
      email: user?.email,
    });
    console.log(customer);
    await prisma.userInfo.update({
      where: {
        id: userId,
      },
      data: {
        customerId: customer.id,
      },
    });
  } else {
    customer = await cl.customers.retrieve(info.customerId);
  }

  const session = await cl.checkout.sessions.create({
    customer: customer.id,
    payment_method_types: ["card", "us_bank_account", "paypal"],
    line_items: [
      {
        price: "price_1OtrExCvn63ZLyAkvgIxNTAb",
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: "http://localhost:5173",
    cancel_url: "http://localhost:5173",
  });

  ///redirect to session.url
  return res.json({ url: session.url });

  res.json(session);
};

export const createPortalSession = async (req: Request, res: Response) => {
  let userId = (req as any).session!.getUserId();
  const prisma = new PrismaClient();
  const cl = new stripe(process.env.STRIPE_SECRET_KEY || "");
  const info = await prisma.userInfo.findUnique({
    where: {
      id: userId,
    },
  });
  let user = await prisma.emailpassword_users.findFirst({
    where: {
      user_id: userId,
      app_id: "public",
    },
  });
  let customer: any;
  if (!info?.customerId) {
    const cl = new stripe(process.env.STRIPE_SECRET_KEY || "");
    const customer = await cl.customers.create({
      email: user?.email,
    });
    console.log(customer);
    await prisma.userInfo.update({
      where: {
        id: userId,
      },
      data: {
        customerId: customer.id,
      },
    });
  } else {
    customer = await cl.customers.retrieve(info.customerId);
  }

  const session = await cl.billingPortal.sessions.create({
    customer: customer.id,
    return_url: "http://localhost:5173",
  });

  ///redirect to session.url
  return res.json({ url: session.url });

  res.json(session);
};
