import {
  CacheType,
  ChatInputCommandInteraction,
  InteractionResponseFields,
  MessageFlags,
  SlashCommandSubcommandBuilder
} from "discord.js";

import fs from "fs";

const helpSubCommand = (subcommand: SlashCommandSubcommandBuilder) =>
  subcommand.setName("help").setDescription("Hilfe zu /d3");

export const execute = async (
  interaction: ChatInputCommandInteraction<CacheType> & InteractionResponseFields<CacheType>
) => {
  const data = fs.readFile("help.txt", "utf8", (error, data) => {
    if (data !== undefined) interaction.reply({ content: data, flags: MessageFlags.SuppressEmbeds });
    if (error) {
      console.log(error);
    }
  });
};
export default helpSubCommand;
