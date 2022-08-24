import axios from "axios";

import { Monster } from "../../interfaces/d3/Monster";
import { D3BaseRequest } from "./BaseRequest";

export class D3MonsterRequest extends D3BaseRequest {
  static DICT_COMMAND = {
    key: "o",
    value: "monster"
  };

  static REQUEST_MAP = {
    monsterName: "q"
  };

  monsterName: string;

  constructor(baseUrl: URL, version: string, monsterName: string) {
    super(baseUrl, version);
    this.monsterName = monsterName;
  }

  async request() {
    this.url.searchParams.set(D3MonsterRequest.REQUEST_MAP.monsterName, this.monsterName);
    this.url.searchParams.set(D3MonsterRequest.DICT_COMMAND.key, D3MonsterRequest.DICT_COMMAND.value);

    try {
      const { data } = await axios.get<Monster>(this.url.toString(), {
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
