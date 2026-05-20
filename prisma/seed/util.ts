/** Minimal logger for seed scripts. No decorative ASCII art. */
export const log = {
  start(name: string): void {
    process.stdout.write(`> ${name}\n`);
  },
  upsert(slug: string, kind: string): void {
    process.stdout.write(`  upserted ${kind}: ${slug}\n`);
  },
  cite(entity: string, count: number): void {
    process.stdout.write(`  cited ${entity} with ${count} sources\n`);
  },
  warn(msg: string): void {
    process.stderr.write(`  ! ${msg}\n`);
  },
  done(name: string, count: number): void {
    process.stdout.write(`< ${name}: ${count} records\n`);
  },
};

export async function withSection<T>(name: string, fn: () => Promise<T>): Promise<T> {
  log.start(name);
  const start = Date.now();
  try {
    const out = await fn();
    process.stdout.write(`  ${name} took ${Math.round((Date.now() - start) / 100) / 10}s\n`);
    return out;
  } catch (e) {
    log.warn(`failed: ${name}`);
    throw e;
  }
}
