import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder, Interaction } from "discord.js";
import { Dict } from "../interfaces/d3/Dict";
import { config } from "../utils/config";
import { D3DictRequest } from "../utils/d3/request";

import dictSubCommand from "./subs/dict";

const slashCommand = new SlashCommandBuilder()
  .setName("d3")
  .setDescription("Verwendet die dnddeutsch.de API")
  .addSubcommand(dictSubCommand);

const execute = async (interaction: Interaction) => {
  if (!interaction.isRepliable() || !interaction.isChatInputCommand()) return;
  let command = interaction.options.getSubcommand();

  switch (command) {
    case "dict":
      const searchtext = interaction.options.getString("suche");
      if (!searchtext) return;
      await interaction.deferReply();

      const options = {
        withMagicItems: interaction.options.getBoolean("mi") ?? true,
        withMonsters: interaction.options.getBoolean("mo") ?? true,
        withSpells: interaction.options.getBoolean("sp") ?? true,
        withItems: interaction.options.getBoolean("it") ?? true,
        withMisc: interaction.options.getBoolean("misc") ?? true
      };

      const d3DictReq = new D3DictRequest(new URL(config.D3_API_BASE_URL), config.D3_API_VERSION, searchtext, options);
      const data = await d3DictReq.request();

      if (data) {
        const embed = getDictEmbed(data);
        await interaction.editReply({ embeds: [embed] });
        return;
      }
      break;
  }

  await interaction.editReply("Ein Fehler ist aufgetreten.");
};

const getDictEmbed = (data: Dict): EmbedBuilder => {
  let description = "";
  if (data.error) {
    description = "Ein Fehler ist aufgetreten:\n";
    description += `${data.error}\n\n`;
  } else {
    description = "Suche in:\n";
    description += (data.magicitems == D3DictRequest.DICT_ON ? "✅" : "❌") + " Magische Gegenstände\n";
    description += (data.monsters == D3DictRequest.DICT_ON ? "✅" : "❌") + " Monster\n";
    description += (data.spells == D3DictRequest.DICT_ON ? "✅" : "❌") + " Zaubersprüche\n";
    description += (data.item == D3DictRequest.DICT_ON ? "✅" : "❌") + " Ausrüstung\n";
    description += (data.misc == D3DictRequest.DICT_ON ? "✅" : "❌") + " Sonstiges\n\n";
  }

  description += `Backlink: ${data.backlink}\n\n`;

  const embed: EmbedBuilder = new EmbedBuilder().setColor(0xee3333).setTitle(`D3 Übersetzung für: ${data.s}`);
  if (data.result) {
    const maxCount = Math.round(config.DICT_MAX_RESULTS);
    if (data.result.length > maxCount) {
      description += `**Mehr als ${maxCount} Ergebnisse (${data.result.length}), versuche die Filter um weniger Ergebnisse zu bekommen**`;
    }

    const slicedRes = data.result.slice(0, maxCount);

    slicedRes.forEach((res) => {
      embed
        .addFields(
          { name: "Name DE", value: `${res.name_de}`, inline: true },
          { name: "Name DE (Ulisses)", value: `${res.name_de_ulisses ?? "\u200B"}`, inline: true },
          { name: "Name EN", value: `${res.name_en}`, inline: true }
        )
        .addFields(
          // ToDo Sinnvolle Anzeige für Typ?
          { name: "Typ", value: `${res.type}`, inline: true },
          { name: "Quelle DE", value: `${res.src_de.book_long} (S. ${res.src_de.p})`, inline: true },
          { name: "Quelle EN", value: `${res.src_en.book_long} (S. ${res.src_en.p})`, inline: true }
        );
      if (res.src_en.srd) {
        embed.addFields({ name: "5thSRD", value: `${config.D3_BASE_URL}${res.src_en.srd}` });
      }
      embed.addFields({ name: "\u200B", value: "\u200B" });
    });
  }
  embed.setDescription(description);

  return embed;
};

export default { slashCommand, execute };
