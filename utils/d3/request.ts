import axios from "axios";

import { Dict } from "../../interfaces/d3/Dict";

abstract class D3Request {
  url: URL;
  constructor(baseUrl: URL, version: string) {
    this.url = new URL(baseUrl);
    this.url.searchParams.set("apiv", version);
  }
}

type D3DictRequestOptions = {
  withMagicItems: boolean;
  withMonsters: boolean;
  withSpells: boolean;
  withItems: boolean;
  withMisc: boolean;
};

export class D3DictRequest extends D3Request {
  static DICT_ON = "on";
  static DICT_OFF = "off";
  static DICT_COMMAND = {
    key: "o",
    value: "dict"
  };

  static REQUEST_MAP = {
    searchText: "s",
    withMagicItems: "mi",
    withMonsters: "mo",
    withSpells: "sp",
    withItems: "it",
    withMisc: "misc"
  };

  searchText: string;
  options: D3DictRequestOptions;

  constructor(baseUrl: URL, version: string, searchText: string, options?: D3DictRequestOptions) {
    super(baseUrl, version);
    const defaultOptions: D3DictRequestOptions = {
      withMagicItems: true,
      withMonsters: true,
      withSpells: true,
      withItems: true,
      withMisc: true
    };
    this.searchText = searchText;
    this.options = { ...defaultOptions, ...options };
  }

  async request() {
    this.url.searchParams.set(D3DictRequest.REQUEST_MAP.searchText, this.searchText);
    this.url.searchParams.set(D3DictRequest.DICT_COMMAND.key, D3DictRequest.DICT_COMMAND.value);
    this.url.searchParams.set(
      D3DictRequest.REQUEST_MAP.withMagicItems,
      this.options.withMagicItems ? D3DictRequest.DICT_ON : D3DictRequest.DICT_OFF
    );
    this.url.searchParams.set(
      D3DictRequest.REQUEST_MAP.withMonsters,
      this.options.withMonsters ? D3DictRequest.DICT_ON : D3DictRequest.DICT_OFF
    );
    this.url.searchParams.set(
      D3DictRequest.REQUEST_MAP.withSpells,
      this.options.withSpells ? D3DictRequest.DICT_ON : D3DictRequest.DICT_OFF
    );
    this.url.searchParams.set(
      D3DictRequest.REQUEST_MAP.withItems,
      this.options.withItems ? D3DictRequest.DICT_ON : D3DictRequest.DICT_OFF
    );
    this.url.searchParams.set(
      D3DictRequest.REQUEST_MAP.withMisc,
      this.options.withMisc ? D3DictRequest.DICT_ON : D3DictRequest.DICT_OFF
    );
    try {
      const { data } = await axios.get<Dict>(this.url.toString(), {
        headers: {
          Accept: "application/json"
        }
      });
      return data;
    } catch (error) {
      console.log("unexpected error: ", error);
      return;
    }
  }
}
