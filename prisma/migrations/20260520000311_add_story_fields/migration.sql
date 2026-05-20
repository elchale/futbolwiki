-- Adds `story` JSONB columns to entities so we can store rich,
-- multi-section content (founding story, golden eras, anecdotes, etc.)
-- without flat-text blobs.

ALTER TABLE "Team"              ADD COLUMN "story" JSONB;
ALTER TABLE "Player"            ADD COLUMN "story" JSONB;
ALTER TABLE "Coach"             ADD COLUMN "story" JSONB;
ALTER TABLE "League"            ADD COLUMN "story" JSONB;
ALTER TABLE "Tournament"        ADD COLUMN "story" JSONB;
ALTER TABLE "TournamentEdition" ADD COLUMN "story" JSONB;
ALTER TABLE "NationalTeam"      ADD COLUMN "story" JSONB;
