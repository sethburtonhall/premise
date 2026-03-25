import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { upsertContact, deleteContact, sendEvent } from "@/lib/loops";

export async function POST(req: NextRequest) {
  let evt: Awaited<ReturnType<typeof verifyWebhook>>;

  try {
    evt = await verifyWebhook(req);
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  const { type, data } = evt;

  if (type === "user.created" || type === "user.updated") {
    const email = data.email_addresses?.[0]?.email_address;
    if (!email) return new Response("OK", { status: 200 });

    await upsertContact({
      email,
      firstName: data.first_name ?? undefined,
      lastName: data.last_name ?? undefined,
      userId: data.id,
      userGroup: type === "user.created" ? "free" : undefined,
    });

    if (type === "user.created") {
      await sendEvent(email, "userSignedUp");
    }
  }

  if (type === "user.deleted") {
    if (data.id) await deleteContact({ userId: data.id });
  }

  return new Response("OK", { status: 200 });
}
