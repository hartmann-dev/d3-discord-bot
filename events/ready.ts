import { Client } from "discord.js";

const name = "ready";
const once = true;
const execute = (client: Client) => {
  console.log(`${client.user?.tag} wurde im Dungeon beschworen.`);
};

export default { name, once, execute };
