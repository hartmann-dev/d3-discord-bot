import { SlashCommandSubcommandBuilder } from "discord.js";

const dictSubCommand = (subcommand: SlashCommandSubcommandBuilder) =>
  subcommand
    .setName("monster")
    .setDescription("Sucht nach Monstern")
    .addStringOption((option) =>
      option.setName("name").setDescription("Bestandteil eines Monsternamen").setRequired(true)
    )
    .addBooleanOption((option) =>
      option.setName("short").setDescription("reduzierte Ausgabe (Standard: False)").setRequired(false)
    );
export default dictSubCommand;
