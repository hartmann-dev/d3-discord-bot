type ArtObject = {
  count: number;
  value: number;
};
type ArtObjects = {
  [index: string]: ArtObject;
};

type SumObject = {
  count?: number;
  value: number;
  weight: number;
};

type Book = {
  book: string;
  p: number;
  srd?: string;
};

type MagicItem = {
  name_de: string;
  name_de_ulisses?: string;
  table: string; // ToDo enum
  roll: number;
  info: string;
  name_en: string;
  src_en: Book;
  src_de: Book;
};

export type GemStone = {
  count: number;
  value: number;
};

type GemStones = {
  [index: string]: GemStone;
};

type Coins = {
  copper?: number;
  silver?: number;
  electrum?: number;
  gold?: number;
  platinum?: number;
  value: number;
  count: number;
  weight: number;
};

export interface Treasur {
  o: "treasur";
  v: number;
  cr: string;
  crtier?: "0-5" | "6-10" | "11-16" | "17-20";
  ic: string;
  hoard_roll?: number;
  artobject?: ArtObjects & SumObject;
  magicitem?: MagicItem[];
  gemstone?: GemStones & SumObject;
  coins: Coins;
  sum: SumObject;
  vault: string;
  backlink?: string;
  error?: string;
}
