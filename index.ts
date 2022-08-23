import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import commands from "./commands";
import events from "./events";

import { config } from "./utils/config";

const rest = new REST({ version: config.REST_VERSION }).setToken(config.TOKEN);

rest
  .put(Routes.applicationCommands(config.CLIENT_ID), {
    body: commands.map((c) => c.slashCommand.toJSON())
  })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);

const client: Client = new Client({ intents: [GatewayIntentBits.Guilds] });

for (const event of events) {
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(commands, ...args));
  }
}
client.login(config.TOKEN);
