import 'dotenv/config';
import { Config } from '../interfaces/Config';

let config: Config;

try {
  config = require('../config.json');
} catch (error) {
  console.error(
    ' --- config.json existiert nicht.\n --- Kopiere die Datei config.json.example und passe die Daten an.'
  );
}

export { config };
