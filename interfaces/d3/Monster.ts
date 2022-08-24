export type MonsterList = {
  name_de: string;
  name_de_ulisses: string | null;
  name_en: string;
  page_de: string;
  page_en: string;
  src: string[];
  srdname: string;
  size: string;
  type: string;
  tags: string;
  alignment: string;
  cr: string;
  xp: string;
  singleline: string;
};

export interface Monster {
  o: "monster";
  v: number;
  monster: MonsterList[];
  backlink?: string;
}
