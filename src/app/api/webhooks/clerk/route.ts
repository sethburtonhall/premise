import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { createContact, updateContact, deleteContact, sendEvent } from "@/lib/loops";

export async function POST(req: NextRequest) {
  let evt: Awaited<ReturnType<typeof verifyWebhook>>;

  try {
    evt = await verifyWebhook(req);
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  const { type, data } = evt;

  if (type === "user.created") {
    const email = data.email_addresses?.[0]?.email_address;
    if (!email) return new Response("OK", { status: 200 });

    await createContact({
      email,
      firstName: data.first_name ?? undefined,
      lastName: data.last_name ?? undefined,
      userId: data.id,
      userGroup: "free",
    });

    await sendEvent(email, "userSignedUp");
  }

  if (type === "user.updated") {
    const email = data.email_addresses?.[0]?.email_address;
    if (!email) return new Response("OK", { status: 200 });

    await updateContact({
      email,
      firstName: data.first_name ?? undefined,
      lastName: data.last_name ?? undefined,
      userId: data.id,
    });
  }

  if (type === "user.deleted") {
    if (data.id) await deleteContact({ userId: data.id });
  }

  if (
    type === "subscription.created" ||
    type === "subscription.updated" ||
    type === "subscription.active" ||
    type === "subscription.pastDue"
  ) {
    const email = data.payer?.email;
    const userId = data.payer?.user_id;
    if (email && userId) {
      const isPaidPlan = data.items?.some(
        (item) => (item.plan?.amount ?? 0) > 0
      );

      const userGroup =
        data.status === "active" && isPaidPlan ? "pro" :
        data.status === "past_due" ? "past_due" :
        "free";
      await updateContact({ email, userId, userGroup });

      if (
        (type === "subscription.created" || type === "subscription.active") &&
        data.status === "active" &&
        isPaidPlan
      ) {
        await sendEvent(email, "userUpgraded");
      }

      if (type === "subscription.pastDue") {
        await sendEvent(email, "paymentPastDue");
      }
    }
  }

  return new Response("OK", { status: 200 });
}
