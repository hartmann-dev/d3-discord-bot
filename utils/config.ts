import "dotenv/config";
import { Config } from "../interfaces/Config";

let config: Config;

/*https://discordjs.guide/popular-topics/embeds.html#embed-limits */
const MAX_EMBEDS = 10;

try {
  config = require("../config.json");
  config.MAX_EMBEDS = MAX_EMBEDS;
} catch (error) {
  console.error(
    " --- config.json existiert nicht.\n --- Kopiere die Datei config.json.example und passe die Daten an."
  );
}

export { config };
