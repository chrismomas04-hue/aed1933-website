"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function verifyAdminPin(pin: string): Promise<boolean> {
  const expected = process.env.ADMIN_PIN;
  if (!expected) {
    console.warn("[admin] ADMIN_PIN env var not set — falling back to default dev PIN.");
    return pin === "aed1933";
  }
  return pin === expected;
}

function revalidateAll() {
  revalidatePath("/admin");
  revalidatePath("/news");
  revalidatePath("/team");
  revalidatePath("/matches");
  revalidatePath("/transfers");
  revalidatePath("/");
}

// ══════════════════════════════════════════════════════════
// MEMBERSHIP
// ══════════════════════════════════════════════════════════
export async function toggleMembershipStatus(id: number, current: string) {
  const status = current === "PENDING" ? "COMPLETED" : "PENDING";
  await prisma.membershipRequest.update({ where: { id }, data: { status } });
  revalidatePath("/admin");
}

export async function deleteMembershipRequest(id: number) {
  await prisma.membershipRequest.delete({ where: { id } });
  revalidatePath("/admin");
}

// ══════════════════════════════════════════════════════════
// NEWS
// ══════════════════════════════════════════════════════════
export async function createNews(data: {
  title: string; summary: string; content?: string;
  imageUrl?: string; category: string; featured: boolean;
}) {
  await prisma.news.create({ data });
  revalidateAll();
}

export async function updateNews(id: string, data: {
  title?: string; summary?: string; content?: string;
  imageUrl?: string | null; category?: string; featured?: boolean;
}) {
  await prisma.news.update({ where: { id }, data });
  revalidateAll();
}

export async function deleteNews(id: string) {
  await prisma.news.delete({ where: { id } });
  revalidateAll();
}

// ══════════════════════════════════════════════════════════
// PLAYER
// ══════════════════════════════════════════════════════════
export async function createPlayer(data: {
  no: number; firstName: string; lastName: string;
  position: string; positionEn: string; age: number;
  nationality: string; imageUrl?: string;
}) {
  await prisma.player.create({ data });
  revalidateAll();
}

export async function updatePlayer(id: string, data: {
  no?: number; firstName?: string; lastName?: string;
  position?: string; positionEn?: string; age?: number;
  nationality?: string; imageUrl?: string | null;
}) {
  await prisma.player.update({ where: { id }, data });
  revalidateAll();
}

export async function deletePlayer(id: string) {
  await prisma.player.delete({ where: { id } });
  revalidateAll();
}

// ══════════════════════════════════════════════════════════
// COACH
// ══════════════════════════════════════════════════════════
export async function createCoach(data: {
  firstName: string; lastName: string; role: string;
  age?: number; nationality: string; imageUrl?: string;
}) {
  await prisma.coach.create({ data });
  revalidateAll();
}

export async function updateCoach(id: number, data: {
  firstName?: string; lastName?: string; role?: string;
  age?: number | null; nationality?: string; imageUrl?: string | null;
}) {
  await prisma.coach.update({ where: { id }, data });
  revalidateAll();
}

export async function deleteCoach(id: number) {
  await prisma.coach.delete({ where: { id } });
  revalidateAll();
}

// ══════════════════════════════════════════════════════════
// MATCH
// ══════════════════════════════════════════════════════════
export async function createMatch(data: {
  date: string; time: string; competition: string; round: string;
  home: string; away: string; homeShort: string; awayShort: string;
  scoreHome?: number | null; scoreAway?: number | null;
  done: boolean; result?: string | null; venue: string; imageUrl?: string;
}) {
  await prisma.match.create({ data });
  revalidateAll();
}

export async function updateMatch(id: string, data: {
  date?: string; time?: string; competition?: string; round?: string;
  home?: string; away?: string; homeShort?: string; awayShort?: string;
  scoreHome?: number | null; scoreAway?: number | null;
  done?: boolean; result?: string | null; venue?: string; imageUrl?: string | null;
}) {
  await prisma.match.update({ where: { id }, data });
  revalidateAll();
}

export async function deleteMatch(id: string) {
  await prisma.match.delete({ where: { id } });
  revalidateAll();
}

// ══════════════════════════════════════════════════════════
// TRANSFER
// ══════════════════════════════════════════════════════════
export async function createTransfer(data: {
  firstName: string; lastName: string; position: string;
  positionShort: string; club: string; age: number;
  nationality: string; type: string; imageUrl?: string;
}) {
  await prisma.transfer.create({ data });
  revalidateAll();
}

export async function updateTransfer(id: string, data: {
  firstName?: string; lastName?: string; position?: string;
  positionShort?: string; club?: string; age?: number;
  nationality?: string; type?: string; imageUrl?: string | null;
}) {
  await prisma.transfer.update({ where: { id }, data });
  revalidateAll();
}

export async function deleteTransfer(id: string) {
  await prisma.transfer.delete({ where: { id } });
  revalidateAll();
}
