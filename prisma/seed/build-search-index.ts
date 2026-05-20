import { prisma } from "./client";
import { log } from "./util";

/**
 * Rebuilds the SearchDocument table from primary entity rows.
 * Called at the end of every full seed and can be invoked
 * standalone via `npm run seed:search`.
 *
 * SearchDocument has a tsvector generated column (`search_vector`)
 * added by the search_vector_column migration — we just upsert
 * the source fields (title / subtitle / body), Postgres computes
 * the vector automatically.
 */
export async function buildSearchIndex(): Promise<void> {
  log.start("build-search-index");
  let written = 0;

  const teams = await prisma.team.findMany({ include: { country: true } });
  for (const t of teams) {
    await upsertDoc({
      entityType: "TEAM",
      entityId: t.id,
      slug: t.slug,
      title: t.name,
      subtitle: t.country?.name ?? null,
      body: [t.shortName, ...(t.nicknames ?? []), t.description ?? ""].filter(Boolean).join(" "),
    });
    written++;
  }

  const players = await prisma.player.findMany({ include: { currentTeam: true } });
  for (const p of players) {
    await upsertDoc({
      entityType: "PLAYER",
      entityId: p.id,
      slug: p.slug,
      title: p.fullName,
      subtitle: p.currentTeam?.name ?? p.knownAs ?? null,
      body: [p.knownAs, p.birthplace, p.bio ?? ""].filter(Boolean).join(" "),
    });
    written++;
  }

  const coaches = await prisma.coach.findMany();
  for (const c of coaches) {
    await upsertDoc({
      entityType: "COACH",
      entityId: c.id,
      slug: c.slug,
      title: c.fullName,
      subtitle: null,
      body: c.bio ?? "",
    });
    written++;
  }

  const leagues = await prisma.league.findMany({ include: { country: true } });
  for (const l of leagues) {
    await upsertDoc({
      entityType: "LEAGUE",
      entityId: l.id,
      slug: l.slug,
      title: l.name,
      subtitle: l.country?.name ?? null,
      body: [l.organizer, l.description ?? ""].filter(Boolean).join(" "),
    });
    written++;
  }

  const tournaments = await prisma.tournament.findMany();
  for (const t of tournaments) {
    await upsertDoc({
      entityType: "TOURNAMENT",
      entityId: t.id,
      slug: t.slug,
      title: t.name,
      subtitle: t.organizer ?? null,
      body: t.description ?? "",
    });
    written++;
  }

  const nationalTeams = await prisma.nationalTeam.findMany({ include: { country: true } });
  for (const n of nationalTeams) {
    await upsertDoc({
      entityType: "NATIONAL_TEAM",
      entityId: n.id,
      slug: n.slug,
      title: n.name,
      subtitle: n.country?.name ?? null,
      body: n.nickname ?? "",
    });
    written++;
  }

  log.done("build-search-index", written);
}

async function upsertDoc(args: {
  entityType: string;
  entityId: string;
  slug: string;
  title: string;
  subtitle: string | null;
  body: string;
}) {
  await prisma.searchDocument.upsert({
    where: { entityType_entityId: { entityType: args.entityType, entityId: args.entityId } },
    create: { ...args },
    update: { ...args },
  });
}

// allow `tsx prisma/seed/build-search-index.ts` direct execution
if (process.argv[1] && process.argv[1].endsWith("build-search-index.ts")) {
  buildSearchIndex()
    .then(() => prisma.$disconnect())
    .catch((e) => {
      process.stderr.write(`build-search-index failed: ${e.message}\n`);
      return prisma.$disconnect().finally(() => process.exit(1));
    });
}
