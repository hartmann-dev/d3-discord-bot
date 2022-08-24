type D3OnOff = "on" | "off";

type DictResultSrc = {
  srd?: string;
  book: string;
  book_long: string;
  p: string;
};

type DictResultType = "monster";

export type DictResult = {
  name_de: string;
  name_de_ulisses: string | null;
  name_en: string;
  src_de: DictResultSrc;
  src_en: DictResultSrc;
  type: DictResultType;
};

export interface Dict {
  o: "dict";
  v: number;
  s: string;
  magicitems: D3OnOff;
  monsters: D3OnOff;
  spells: D3OnOff;
  item: D3OnOff;
  misc: D3OnOff;
  backlink: string;
  result?: DictResult[];
  error?: "string";
}
