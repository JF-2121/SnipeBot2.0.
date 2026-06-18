export interface CategoryConfig {
  label: string;
  keyword: string;
  channelName: string;
  kleinanzeigenCategory: string;
}

export const CATEGORIES: Record<string, CategoryConfig> = {
  shirts: {
    label: "Shirts & Polos",
    keyword: "polo shirt",
    channelName: "men_shirts",
    kleinanzeigenCategory: "87",
  },
  pants: {
    label: "Hosen & Jeans",
    keyword: "hose jeans",
    channelName: "men_pants",
    kleinanzeigenCategory: "87",
  },
  shoes: {
    label: "Schuhe",
    keyword: "schuhe sneaker",
    channelName: "men_shoes",
    kleinanzeigenCategory: "158",
  },
  accessories: {
    label: "Accessoires",
    keyword: "",
    channelName: "deals",
    kleinanzeigenCategory: "87",
  },
};

export const ALL_CATEGORY_KEYS = Object.keys(CATEGORIES);
