import { Webhook } from "svix";
import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import createUser from "@/lib/actions/user.action";

export async function POST(req: Request) {
  const secret = process.env.SIGNING_SECRET;
  if (!secret) {
    console.error("Missing SIGNING_SECRET env var");
    return new Response("Missing SIGNING_SECRET", { status: 500 });
  }

  // get headers (synchronously)
  const headerList = headers() as unknown as { get(name: string): string | null };
  const svixHeaders = {
    "svix-id": headerList.get("svix-id") ?? "",
    "svix-timestamp": headerList.get("svix-timestamp") ?? "",
    "svix-signature": headerList.get("svix-signature") ?? "",
  };

  // Use raw bytes to avoid any transformation issues
  const arr = await req.arrayBuffer();
  const payload = Buffer.from(arr).toString("utf8");

  // Debug logs (remove in production)
  console.log("SVIX headers:", svixHeaders);
  console.log("Raw payload length:", payload.length);
  // Optionally log payload (only on staging or masked)
  // console.log("Raw payload:", payload);

  const wh = new Webhook(secret);
  let event: WebhookEvent;
  try {
    event = wh.verify(payload, svixHeaders) as WebhookEvent;
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "user.created") {
    const d = event.data as any; // avoid strict TS type errors while debugging
    const user = {
      clerkId: d.id,
      userName: d.username ?? d.first_name ?? "unknown",
      age: 0,
      email: d.email_addresses?.[0]?.email_address ?? "",
      mobile_no: d.phone_numbers?.[0]?.phone_number ?? "",
      // if TypeScript complains, keep public metadata access via `as any`
      userType: (d.public_metadata?.userType as string) ?? "user",
      status: Number(d.public_metadata?.status ?? 1),
    };

    try {
      await createUser(user);
    } catch (err) {
      console.error("createUser failed:", err);
      // return 500 if you want Clerk to retry; otherwise respond 200 to stop retries
      return new Response("createUser failed", { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
