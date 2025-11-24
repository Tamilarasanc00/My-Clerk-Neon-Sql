import { Webhook } from "svix";
import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import createUser from "@/lib/actions/user.action";

export async function POST(req: Request) {
  const secret = process.env.SIGNING_SECRET;
  if (!secret) return new Response("Missing SIGNING_SECRET", { status: 500 });

  // DON'T await headers() — call it synchronously
  const headerList = headers() as unknown as { get(name: string): string | null };

  const svixHeaders = {
    "svix-id": headerList.get("svix-id") ?? "",
    "svix-timestamp": headerList.get("svix-timestamp") ?? "",
    "svix-signature": headerList.get("svix-signature") ?? "",
  };

  const payload = await req.text();
  const wh = new Webhook(secret);

  let event: WebhookEvent;
  try {
    event = wh.verify(payload, svixHeaders) as WebhookEvent;
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "user.created") {
    const d = event.data;
    const user = {
      clerkId: d.id,
      userName: d.username ?? d.first_name ?? "unknown",
      age: 0,
      email: d.email_addresses?.[0]?.email_address ?? "",
      mobile_no: d.phone_numbers?.[0]?.phone_number ?? "",
      userType: (d.public_metadata?.userType as string) ?? "user",
      status: Number(d.public_metadata?.status ?? 1),
    };

    await createUser(user);
  }

  return NextResponse.json({ success: true });
}
