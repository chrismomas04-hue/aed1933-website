import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // ── PLAYERS ──────────────────────────────────────────────────────────────────
  const playerCount = await prisma.player.count();
  if (playerCount === 0) {
    await prisma.player.createMany({
      data: [
        { no: 1,  firstName: "Κώστας",      lastName: "Μεταξάς",      position: "Τερματοφύλακας",  positionEn: "GK", age: 28, nationality: "Ελλάδα" },
        { no: 5,  firstName: "Γιώργος",     lastName: "Αντωνίου",     position: "Αμυντικός",        positionEn: "CB", age: 25, nationality: "Ελλάδα" },
        { no: 3,  firstName: "Νίκος",       lastName: "Σταματίου",    position: "Αριστερός Μπακ",  positionEn: "LB", age: 23, nationality: "Ελλάδα" },
        { no: 8,  firstName: "Δημήτρης",    lastName: "Ηλίας",        position: "Κεντρικός Μέσος", positionEn: "CM", age: 26, nationality: "Ελλάδα" },
        { no: 6,  firstName: "Παναγιώτης", lastName: "Κοντός",       position: "Αμυντικός Μέσος", positionEn: "DM", age: 29, nationality: "Ελλάδα" },
        { no: 11, firstName: "Χρήστος",    lastName: "Λαμπράκης",    position: "Εξτρέμ",           positionEn: "LW", age: 22, nationality: "Ελλάδα" },
        { no: 10, firstName: "Αλέξης",     lastName: "Νικολάου",     position: "Επιθετικός Μέσος", positionEn: "AM", age: 27, nationality: "Ελλάδα" },
        { no: 9,  firstName: "Νίκος",      lastName: "Παπαδόπουλος", position: "Επιθετικός",       positionEn: "ST", age: 24, nationality: "Ελλάδα" },
      ],
    });
    console.log("✅ Players seeded");
  } else {
    console.log(`⏭  Players table not empty (${playerCount} rows), skipping`);
  }

  // ── MATCHES ──────────────────────────────────────────────────────────────────
  const matchCount = await prisma.match.count();
  if (matchCount === 0) {
    await prisma.match.createMany({
      data: [
        {
          date: "Κυριακή, 15 Ιουν 2025", time: "17:00",
          competition: "Α' ΕΠΣ Έβρου", round: "Αγωνιστική 18",
          home: "Α.Ε. ΔΙΔΥΜΟΤΕΙΧΟΥ", away: "ΑΟ ΟΡΕΣΤΙΑΔΑ",
          homeShort: "ΑΕΔ", awayShort: "ΑΟΟ",
          scoreHome: 2, scoreAway: 1, done: true, result: "W",
          venue: "Δημοτικό Στάδιο Διδυμοτείχου",
        },
        {
          date: "Κυριακή, 22 Ιουν 2025", time: "18:00",
          competition: "Α' ΕΠΣ Έβρου", round: "Αγωνιστική 19",
          home: "ΟΡΦΕΑΣ ΟΡΕΣΤΙΑΔΑΣ", away: "Α.Ε. ΔΙΔΥΜΟΤΕΙΧΟΥ",
          homeShort: "ΟΡΦ", awayShort: "ΑΕΔ",
          scoreHome: 0, scoreAway: 0, done: true, result: "D",
          venue: "Γήπεδο Ορεστιάδας",
        },
        {
          date: "Κυριακή, 06 Ιουλ 2025", time: "17:00",
          competition: "Α' ΕΠΣ Έβρου", round: "Αγωνιστική 20",
          home: "ΞΑΝΘΗ FC", away: "Α.Ε. ΔΙΔΥΜΟΤΕΙΧΟΥ",
          homeShort: "ΞΑΝ", awayShort: "ΑΕΔ",
          scoreHome: null, scoreAway: null, done: false, result: null,
          venue: "Στάδιο Ξάνθης",
        },
        {
          date: "Κυριακή, 13 Ιουλ 2025", time: "17:00",
          competition: "Α' ΕΠΣ Έβρου", round: "Αγωνιστική 21",
          home: "Α.Ε. ΔΙΔΥΜΟΤΕΙΧΟΥ", away: "ΑΕ ΚΑΒΑΛΑ",
          homeShort: "ΑΕΔ", awayShort: "ΑΕΚ",
          scoreHome: null, scoreAway: null, done: false, result: null,
          venue: "Δημοτικό Στάδιο Διδυμοτείχου",
        },
      ],
    });
    console.log("✅ Matches seeded");
  } else {
    console.log(`⏭  Matches table not empty (${matchCount} rows), skipping`);
  }

  // ── TRANSFERS ────────────────────────────────────────────────────────────────
  const transferCount = await prisma.transfer.count();
  if (transferCount === 0) {
    await prisma.transfer.createMany({
      data: [
        { firstName: "Νίκος",   lastName: "Παπαδόπουλος",  position: "Επιθετικός",        positionShort: "ST", club: "Ορφέας Ορεστιάδας", age: 24, nationality: "GR", type: "IN" },
        { firstName: "Μάριος",  lastName: "Κωνσταντίνου", position: "Μεσοεπιθετικός",    positionShort: "AM", club: "ΑΕΚ Β'",             age: 22, nationality: "GR", type: "IN" },
        { firstName: "Θανάσης", lastName: "Γεωργίου",     position: "Δεξί Μπακ",         positionShort: "RB", club: "Ελεύθερος",          age: 27, nationality: "GR", type: "IN" },
        { firstName: "Σπύρος",  lastName: "Αλεξίου",      position: "Αμυντικός",          positionShort: "CB", club: "ΑΟ Ορεστιάδα",       age: 29, nationality: "GR", type: "OUT" },
        { firstName: "Λευτέρης",lastName: "Δήμου",        position: "Αριστερό Εξτρέμ",  positionShort: "LW", club: "Ελεύθερος",          age: 26, nationality: "GR", type: "OUT" },
        { firstName: "Βασίλης", lastName: "Κατσαρός",     position: "Κεντρικός Μέσος",   positionShort: "CM", club: "Ξάνθη FC",           age: 31, nationality: "GR", type: "OUT" },
      ],
    });
    console.log("✅ Transfers seeded");
  } else {
    console.log(`⏭  Transfers table not empty (${transferCount} rows), skipping`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
