import { Scraper } from "./types.js";
import { kleinanzeigenScraper } from "./kleinanzeigen.js";
import { vintedScraper } from "./vinted.js";
import { logger } from "../lib/logger.js";

const PRIMARY_SCRAPERS: Scraper[] = [
  kleinanzeigenScraper,
  vintedScraper,
];

const SECONDARY_SCRAPERS: Scraper[] = [];

export const SCRAPERS: Scraper[] = [...PRIMARY_SCRAPERS, ...SECONDARY_SCRAPERS];

export async function searchAllPlatforms(query: string, options: any = {}): Promise<any[]> {
  const allResults: any[] = [];
  
  for (const scraper of PRIMARY_SCRAPERS) {
    try {
      const results = await scraper.search(query, options);
      
      if (results.length === 0) {
        logger.warn(`⚠️ ${scraper.name} returned 0 items - possible IP block`);
        if (scraper.lastRawHtml) {
          const preview = scraper.lastRawHtml.substring(0, 300);
          logger.debug(`${scraper.name} HTML preview: ${preview}`);
        }
      }
      
      allResults.push(...results);
    } catch (error) {
      logger.error(`❌ ${scraper.name} failed: ${String(error)}`);
    }
  }
  
  if (allResults.length === 0 && SECONDARY_SCRAPERS.length > 0) {
    logger.info("🔄 Primary scrapers returned 0 items, triggering secondary scrapers...");
    
    for (const scraper of SECONDARY_SCRAPERS) {
      try {
        const results = await scraper.search(query, options);
        
        if (results.length === 0) {
          logger.warn(`⚠️ ${scraper.name} returned 0 items - possible IP block`);
          if (scraper.lastRawHtml) {
            const preview = scraper.lastRawHtml.substring(0, 300);
            logger.debug(`${scraper.name} HTML preview: ${preview}`);
          }
        }
        
        allResults.push(...results);
      } catch (error) {
        logger.error(`❌ ${scraper.name} failed: ${String(error)}`);
      }
    }
  }
  
  return allResults;
}