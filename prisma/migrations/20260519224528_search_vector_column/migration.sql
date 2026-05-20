-- Adds a Postgres `tsvector` generated column + GIN index to SearchDocument
-- so we can do Spanish-language full-text search.
-- Weighting: title (A) > subtitle (B) > body (C).

ALTER TABLE "SearchDocument"
  ADD COLUMN "search_vector" tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('spanish', coalesce("title", '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce("subtitle", '')), 'B') ||
    setweight(to_tsvector('spanish', coalesce("body", '')), 'C')
  ) STORED;

CREATE INDEX "search_document_vector_idx"
  ON "SearchDocument"
  USING GIN ("search_vector");
