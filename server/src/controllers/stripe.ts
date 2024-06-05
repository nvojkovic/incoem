import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import stripe from "stripe";
import supertokens from "supertokens-node";

const prisma = new PrismaClient();

// export const createSubsctiption = async (req: Request, res: Response) => {
//   let userId = (req as any).session!.getUserId();
//   const cl = new stripe(process.env.STRIPE_SECRET_KEY || "");
//   const info = await prisma.userInfo.findUnique({
//     where: {
//       id: userId,
//     },
//   });
//   let user = await prisma.emailpassword_users.findFirst({
//     where: {
//       user_id: userId,
//       app_id: "public",
//     },
//   });
//   let customer: any;
//   if (!info?.customerId) {
//     const cl = new stripe(process.env.STRIPE_SECRET_KEY || "");
//     customer = await cl.customers.create({
//       email: user?.email,
//     });
//     console.log(customer);
//     await prisma.userInfo.update({
//       where: {
//         id: userId,
//       },
//       data: {
//         customerId: customer.id,
//       },
//     });
//   } else {
//     customer = await cl.customers.retrieve(info.customerId);
//   }
//
//   const session = await cl.checkout.sessions.create({
//     customer: customer.id,
//     payment_method_types: ["card", "us_bank_account"],
//     line_items: [
//       {
//         price: "price_1OtrExCvn63ZLyAkvgIxNTAb",
//         quantity: 1,
//       },
//     ],
//     mode: "subscription",
//     subscription_data: {
//       trial_period_days: 14,
//     },
//     success_url: process.env.APP_URL,
//     cancel_url: process.env.APP_URL,
//   });
//
//   ///redirect to session.url
//   return res.json({ url: session.url });
//
//   res.json(session);
// };
//
export const createPortalSession = async (req: Request, res: Response) => {
  let userId = (req as any).session!.getUserId();
  const cl = new stripe(process.env.STRIPE_SECRET_KEY || "");
  const info = await prisma.userInfo.findUnique({
    where: {
      id: userId,
    },
  });

  let user = await supertokens.getUser(userId);
  let customer: any;
  if (!info?.customerId) {
    const cl = new stripe(process.env.STRIPE_SECRET_KEY || "");
    const customer = await cl.customers.create({
      email: user?.emails[0],
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
    return_url: process.env.APP_URL,
  });

  ///redirect to session.url
  return res.json({ url: session.url });

  res.json(session);
};

export const stripeWebhook = async (req: Request, res: Response) => {
  const payload = req.body;
  // const sig = req.headers["stripe-signature"] || "";
  // const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET || "";
  let event: stripe.Event = payload;
  // console.log("stripe webhook", payload, sig, endpointSecret);
  if (event.type === "customer.created") {
    console.log("customer.created", event.data.object);
    const customer = event.data.object as stripe.Customer;
    if (!customer.email) {
      return res.status(400).send(`Webhook Error: customer email is required`);
    }

    let user = await supertokens.listUsersByAccountInfo("public", {
      email: customer.email,
    });
    if (!user.length) {
      return res.status(400).send(`Webhook Error: user not found`);
    }
    await prisma.userInfo.update({
      where: {
        id: user[0].id,
      },
      data: {
        customerId: customer.id,
      },
    });
  } else if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.deleted"
  ) {
    console.log("customer.subscription.updated", event.data.object);
    const subscription = event.data.object as stripe.Subscription;
    const info = await prisma.userInfo.findFirst({
      where: {
        customerId: subscription.customer as string,
      },
    });
    await prisma.userInfo.update({
      where: {
        id: info?.id,
      },
      data: {
        subsciptionStatus: subscription.status,
      },
    });
    console.log("info", info);
  } else if (event.type === "customer.subscription.pending_update_expired") {
    await prisma.userInfo.updateMany({
      where: {
        customerId: event.data.object.customer as string,
      },
      data: {
        subsciptionStatus: "canceled",
      },
    });
  }

  // try {
  //   event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  // } catch (err) {
  //   return res.status(400).send(`Webhook Error: ${(err as any).message}`);
  // }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as stripe.Checkout.Session;
    console.log(session);
  }

  res.json({ received: true });
};
