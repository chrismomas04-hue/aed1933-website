import { prisma } from "@/lib/prisma";
import TeamClientUI from "./TeamClientUI";

export default async function TeamPage() {
  const [players, coaches] = await Promise.all([
    prisma.player.findMany({ orderBy: { no: "asc" } }),
    prisma.coach.findMany({ orderBy: { id: "asc" } }),
  ]);

  return <TeamClientUI players={players} coaches={coaches} />;
}
