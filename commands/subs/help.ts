import { SlashCommandSubcommandBuilder } from "discord.js";

const helpSubCommand = (subcommand: SlashCommandSubcommandBuilder) =>
  subcommand.setName("help").setDescription("Hilfe zu /d3");
export default helpSubCommand;
