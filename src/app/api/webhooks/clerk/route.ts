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

  if (type === "subscription.created" || type === "subscription.updated") {
    const email = data.payer?.email;
    const userId = data.payer?.user_id;
    if (email && userId) {
      const isActive = data.status === "active";
      await updateContact({
        email,
        userId,
        userGroup: isActive ? "pro" : "free",
      });
    }
  }

  return new Response("OK", { status: 200 });
}
