"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendMembershipConfirmationEmail } from "@/lib/mail";

export async function createMembershipRequest(data: {
  fullName: string;
  phone: string;
  email: string;
  tier: string;
  deliveryMethod: string;
  address?: string;
  notes?: string;
}): Promise<{ id: number }> {
  const record = await prisma.membershipRequest.create({ data });
  revalidatePath("/admin");

  // Fire-and-forget — DB write already succeeded, email failure is non-fatal
  await sendMembershipConfirmationEmail({
    id: record.id,
    fullName: record.fullName,
    email: record.email ?? data.email,
    tier: record.tier,
    deliveryMethod: record.deliveryMethod,
    address: record.address,
  });

  return { id: record.id };
}

export async function toggleMembershipStatus(id: number, current: string) {
  const status = current === "PENDING" ? "COMPLETED" : "PENDING";
  await prisma.membershipRequest.update({ where: { id }, data: { status } });
  revalidatePath("/admin");
}

export async function deleteMembershipRequest(id: number) {
  await prisma.membershipRequest.delete({ where: { id } });
  revalidatePath("/admin");
}
