import { SlashCommandSubcommandBuilder } from "discord.js";

const dictSubCommand = (subcommand: SlashCommandSubcommandBuilder) =>
  subcommand
    .setName("dict")
    .setDescription("Übersetzt einen Begriff")
    .addStringOption((option) =>
      option.setName("suche").setDescription("Der Begriff den es zu übersetzten gilt").setRequired(true)
    )
    .addBooleanOption((option) =>
      option.setName("mi").setDescription("Magische Gegenstände berücksichtigen (Standard: True)").setRequired(false)
    )
    .addBooleanOption((option) =>
      option.setName("mo").setDescription("Monster berücksichtigen (Standard: True)").setRequired(false)
    )
    .addBooleanOption((option) =>
      option.setName("sp").setDescription("Zaubersprüche berücksichtigen (Standard: True)").setRequired(false)
    )
    .addBooleanOption((option) =>
      option.setName("it").setDescription("Ausrüstung berücksichtigen (Standard: True)").setRequired(false)
    )
    .addBooleanOption((option) =>
      option.setName("misc").setDescription("Verschiedenes berücksichtigen (Standard: True)").setRequired(false)
    );
export default dictSubCommand;
