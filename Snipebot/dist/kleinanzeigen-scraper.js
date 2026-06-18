const KLEINANZEIGEN_BASE = "https://www.kleinanzeigen.de";
const USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
];
function randomUA() {
    return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}
// Kleinanzeigen scraping is disabled because it requires a headless browser
// The site uses JavaScript to render content and cannot be scraped with simple HTTP requests
export async function searchKleinanzeigen(searchText, options = {}) {
    // Return empty array - Kleinanzeigen requires headless browser (Puppeteer/Playwright)
    return [];
}
export async function findCheaperAlternatives(searchText, targetPrice, options = {}) {
    return [];
}
