const LOOPS_API_KEY = process.env.LOOPS_API_KEY;
const LOOPS_BASE = "https://app.loops.so/api/v1";

async function post(path: string, body: unknown): Promise<void> {
  if (!LOOPS_API_KEY) return;
  try {
    const res = await fetch(`${LOOPS_BASE}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOOPS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`Loops ${path} failed: ${res.status}`, body);
    }
  } catch (err) {
    console.error(`Loops ${path} error:`, err);
  }
}

type ContactData = {
  email: string;
  firstName?: string;
  lastName?: string;
  userId: string;
  userGroup?: string;
};

export async function createContact(data: ContactData): Promise<void> {
  await post("/contacts/create", data);
}

export async function updateContact(data: ContactData): Promise<void> {
  await post("/contacts/update", data);
}

export async function deleteContact(
  contact: { email: string } | { userId: string },
): Promise<void> {
  await post("/contacts/delete", contact);
}

export async function sendEvent(
  email: string,
  eventName: string,
  properties?: Record<string, string | number | boolean>,
): Promise<void> {
  await post("/events/send", { email, eventName, ...properties });
}
