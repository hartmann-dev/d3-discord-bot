import { SlashCommandSubcommandBuilder } from "discord.js";
const LootCrOptions = [
  { name: "0-4", value: "0" },
  { name: "5-10", value: "5" },
  { name: "11-16", value: "11" },
  { name: "17-20", value: "20" }
];
const lootSubCommand = (subcommand: SlashCommandSubcommandBuilder) =>
  subcommand
    .setName("loot")
    .setDescription("Generiert Loot für ein(e) Monster(-gruppe) oder Hort")
    .addStringOption((option) =>
      option
        .setName("cr")
        .setNameLocalization("de", "hg")
        .setChoices(...LootCrOptions)
        .setDescription("Herausforderungsgrad des/der Monster")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("count")
        .setNameLocalization("de", "anzahl")
        .setDescription("Anzahl der Moster oder 'Hort'")
        .setRequired(true)
    );
export default lootSubCommand;
