import { Monster } from "../../interfaces/d3/Monster";

export abstract class D3BaseRequest {
  url: URL;
  constructor(baseUrl: URL, version: string) {
    this.url = new URL(baseUrl);
    this.url.searchParams.set("apiv", version);
  }
}
