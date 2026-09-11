/**
 * Placeholder dish photography.
 *
 * The mock API returns person portraits in `avatar`, so until real dish photos
 * exist every item is mapped to one of these plated-food photos by id. Swap
 * `dishImage()` for `item.avatar` once the API serves food imagery.
 *
 * All hosts are allow-listed in next.config.ts (`images.remotePatterns`).
 */
const UNSPLASH = "https://images.unsplash.com/photo-";
const PARAMS = "?auto=format&fit=crop&w=800&q=80";

const POOL = [
  "1546069901-ba9599a7e63c",
  "1540189549336-e6e99c3679fe",
  "1512058564366-18510be2db19",
  "1565299624946-b28f40a0ae38",
  "1476224203421-9ac39bcb3327",
  "1568901346375-23c9450c58cd",
  "1551183053-bf91a1d81141",
  "1432139555190-58524dae6a55",
  "1567620905732-2d1ec7ab7445",
  "1490645935967-10de6ba17061",
  "1529042410759-befb1204b468",
  "1504674900247-0877df9cc836",
  "1555939594-58d7cb561ad1",
  "1473093295043-cdd812d0e601",
  "1484723091739-30a097e8f929",
  "1467003909585-2f8a72700288",
  "1414235077428-338989a2e8c0",
  "1543353071-873f17a7a088",
  "1455619452474-d2be8b1e70cd",
].map((id) => `${UNSPLASH}${id}${PARAMS}`);

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Deterministic photo per item id, so the same dish always shows the same plate. */
export function dishImage(id: string): string {
  const n = Number(id);
  const index = Number.isFinite(n) ? Math.abs(Math.trunc(n)) : hash(id);
  return POOL[index % POOL.length];
}

/** Three plates used by the hero composition. */
export const HERO_PLATES = [POOL[0], POOL[1], POOL[6]] as const;
