import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import createUser from "@/lib/actions/user.action";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const secret = process.env.SIGNING_SECRET;
  if (!secret) throw new Error("Missing SIGNING_SECRET");

  const wh = new Webhook(secret);

  const h =await headers();
  const svixHeaders = {
    "svix-id": h.get("svix-id")!,
    "svix-timestamp": h.get("svix-timestamp")!,
    "svix-signature": h.get("svix-signature")!,
  };

  const payload = await req.text(); // important!
  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, svixHeaders) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verify error", err);
    return new Response("Invalid signature", { status: 400 });
  }

  // user created
  if (evt.type === "user.created") {
    const d = evt.data;

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

    return NextResponse.json({ success: true });
  }

  return new Response("OK", { status: 200 });
}
