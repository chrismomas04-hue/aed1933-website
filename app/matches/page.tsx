import { prisma } from "@/lib/prisma";
import MatchesClientUI from "./MatchesClientUI";

export default async function MatchesPage() {
  const matches = await prisma.match.findMany({
    orderBy: { createdAt: "asc" },
  });

  return <MatchesClientUI matches={matches} />;
}
