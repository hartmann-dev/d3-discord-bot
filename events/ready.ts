import { ActivityType, Client } from "discord.js";

const name = "ready";
const once = true;
const execute = (client: Client) => {
  client.user?.setActivity({ type: ActivityType.Listening, name: "/d3" });
  console.log(`${client.user?.tag} wurde im Dungeon beschworen.`);
};

export default { name, once, execute };
