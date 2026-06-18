import * as cheerio from "cheerio";
import { logger } from "../lib/logger.js";
import { fetchWithRetry } from "../utils/fetchWrapper.js";
import { ScrapedItem, SearchOptions, Scraper } from "./types.js";

const VINTED_BASE = "https://www.vinted.de";

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
];

function randomUA(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]!;
}

function extractBrand(title: string, searchQuery: string): string {
  const brands = ["Nike", "Adidas", "Lacoste", "Ralph Lauren", "Carhartt", "Puma", "Tommy Hilfiger"];
  const titleLower = title.toLowerCase();
  for (const brand of brands) {
    if (titleLower.includes(brand.toLowerCase())) return brand;
  }
  return searchQuery.split(" ")[0] || "—";
}

function extractSize(title: string): string {
  const sizePatterns = [
    /\b(XXS|XS|S|M|L|XL|XXL|XXXL)\b/i,
    /\b(3XL|4XL|5XL)\b/i,
    /\bGr\.?\s*(\d{2})\b/i,
    /\bGröße\s*(\d{2})\b/i,
    /\b(\d{2})\b(?=\s|$)/,
  ];
  for (const pattern of sizePatterns) {
    const match = title.match(pattern);
    if (match) return match[1] || match[0];
  }
  return "—";
}

async function search(searchText: string, options: SearchOptions = {}): Promise<ScrapedItem[]> {
  try {
    const params = new URLSearchParams({
      search_text: searchText,
      order: "newest_first",
    });
    
    if (options.maxPrice && options.maxPrice > 0) {
      params.append("price_to", options.maxPrice.toString());
    }
    
    const searchUrl = `${VINTED_BASE}/vetements?${params.toString()}`;
    logger.info(`🔍 Vinted: ${searchText}`);

    const response = await fetchWithRetry(searchUrl, {
      headers: {
        "User-Agent": randomUA(),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "de-DE,de;q=0.9,en;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
      },
    });

    vintedScraper.lastRawHtml = response.data;
    const $ = cheerio.load(response.data);
    const items: ScrapedItem[] = [];

    $("div[data-testid='feed-grid'] a").each((_, element) => {
      try {
        const $item = $(element);
        const link = $item.attr("href") || "";
        if (!link || !link.includes("/items/")) return;
        
        const id = link.split("/items/")[1]?.split("-")[0] || "";
        if (!id) return;
        
        const title = $item.find("h3").text().trim();
        if (!title) return;
        
        const priceText = $item.find("[data-testid='item-price']").text().trim();
        const priceMatch = priceText.match(/(\d+(?:[.,]\d+)?)/);
        const price = priceMatch ? parseFloat(priceMatch[1].replace(",", ".")) : 0;
        
        const imageUrl = $item.find("img").attr("src") || "";
        const brand = extractBrand(title, searchText);
        const size = extractSize(title);
        
        items.push({
          id,
          title,
          price,
          size,
          brand,
          link: link.startsWith("http") ? link : `${VINTED_BASE}${link}`,
          imageUrl,
          platform: "vinted",
        });
      } catch (err) {
        logger.warn("Parse error:", err);
      }
    });

    logger.info(`✅ Vinted: ${items.length} items`);
    return items;
  } catch (error) {
    logger.error(`❌ Vinted: ${String(error)}`);
    return [];
  }
}

export const vintedScraper: Scraper = {
  name: "vinted",
  search,
};
