import { Scraper } from "./types.js";
import { kleinanzeigenScraper } from "./kleinanzeigen.js";
import { vintedScraper } from "./vinted.js";

export const SCRAPERS: Scraper[] = [
  kleinanzeigenScraper,
  vintedScraper,
];

export async function searchAllPlatforms(query: string, options: any = {}): Promise<any[]> {
  const results = await Promise.all(
    SCRAPERS.map(scraper => scraper.search(query, options))
  );
  return results.flat();
}
