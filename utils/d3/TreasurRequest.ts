import axios from "axios";

import { Treasur } from "../../interfaces/d3/Treasur";
import { D3BaseRequest } from "./BaseRequest";

export class D3TreasureRequest extends D3BaseRequest {
  static DICT_COMMAND = {
    key: "o",
    value: "treasure"
  };

  static REQUEST_MAP = {
    cr: "cr",
    count: "ic"
  };

  cr: number;
  ic: number | "hoard";

  constructor(baseUrl: URL, version: string, cr: number, count: number | "hoard") {
    super(baseUrl, version);
    this.cr = cr;
    this.ic = count;
  }

  async request() {
    this.url.searchParams.set(D3TreasureRequest.REQUEST_MAP.cr, this.cr.toString());
    this.url.searchParams.set(D3TreasureRequest.REQUEST_MAP.count, this.ic.toString());
    this.url.searchParams.set(D3TreasureRequest.DICT_COMMAND.key, D3TreasureRequest.DICT_COMMAND.value);

    try {
      const { data } = await axios.get<Treasur>(this.url.toString(), {
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
