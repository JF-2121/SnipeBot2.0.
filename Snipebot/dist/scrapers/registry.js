import { kleinanzeigenScraper } from "./kleinanzeigen.js";
import { vintedScraper } from "./vinted.js";
export const SCRAPERS = [
    kleinanzeigenScraper,
    vintedScraper,
];
export async function searchAllPlatforms(query, options = {}) {
    const results = await Promise.all(SCRAPERS.map(scraper => scraper.search(query, options)));
    return results.flat();
}
