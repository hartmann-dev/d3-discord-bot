import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, ChatInputCommandInteraction, Collection, Interaction, InteractionResponseFields } from "discord.js";

import dictSubCommand, { execute as dict } from "./subs/dict";
import monsterSubCommand, { execute as monster } from "./subs/monster";
import lootSubCommand, { execute as loot } from "./subs/loot";
import helpSubCommand, { execute as help } from "./subs/help";

const slashCommand = new SlashCommandBuilder()
  .setName("d3")
  .setDescription("Verwendet die dnddeutsch.de API")
  .addSubcommand(dictSubCommand)
  .addSubcommand(monsterSubCommand)
  .addSubcommand(lootSubCommand)
  .addSubcommand(helpSubCommand);
const execute = async (interaction: Interaction) => {
  if (!interaction.isRepliable() || !interaction.isChatInputCommand()) return;

  let command = interaction.options.getSubcommand();

  switch (command) {
    case "help":
      await help(interaction).catch((error) => sendError(interaction, error));
      break;
    case "dict":
      await dict(interaction).catch((error) => sendError(interaction, error));
      break;
    case "monster":
      monster(interaction).catch((error) => sendError(interaction, error));
      break;
    case "loot":
      loot(interaction).catch((error) => sendError(interaction, error));
      break;
    default:
      throw new Error("Command " + command + " not found");
  }
};

const sendError = async (
  interaction: ChatInputCommandInteraction<CacheType> & InteractionResponseFields<CacheType>,
  error: string
) => {
  console.error("asdada");
  console.error(error);
  await interaction.reply({
    content: "Ein Fehler ist aufgetreten!",
    ephemeral: true
  });
};

export default { slashCommand, execute };
