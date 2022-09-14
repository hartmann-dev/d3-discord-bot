import {
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionResponseFields,
  SlashCommandSubcommandBuilder
} from "discord.js";
import { Dict, DictResult } from "../../interfaces/d3/Dict";
import { config } from "../../utils/config";
import { D3DictRequest } from "../../utils/d3/DictRequest";
import { sliceEmbeds } from "../../utils/sliceEmbeds";

const dictSubCommand = (subcommand: SlashCommandSubcommandBuilder) =>
  subcommand
    .setName("dict")
    .setDescription("Übersetzt einen Begriff")
    .addStringOption((option) =>
      option.setName("suche").setDescription("Der Begriff den es zu übersetzten gilt").setRequired(true)
    )
    .addBooleanOption((option) =>
      option.setName("mi").setDescription("Magische Gegenstände berücksichtigen").setRequired(false)
    )
    .addBooleanOption((option) => option.setName("mo").setDescription("Monster berücksichtigen").setRequired(false))
    .addBooleanOption((option) =>
      option.setName("sp").setDescription("Zaubersprüche berücksichtigen").setRequired(false)
    )
    .addBooleanOption((option) => option.setName("it").setDescription("Ausrüstung berücksichtigen").setRequired(false))
    .addBooleanOption((option) =>
      option.setName("misc").setDescription("Verschiedenes berücksichtigen").setRequired(false)
    );
export const execute = async (
  interaction: ChatInputCommandInteraction<CacheType> & InteractionResponseFields<CacheType>
) => {
  const searchtext = interaction.options.getString("suche");
  if (!searchtext) return;
  await interaction.deferReply();

  const possibleOptions = {
    withMagicItems: interaction.options.getBoolean("mi"),
    withMonsters: interaction.options.getBoolean("mo"),
    withSpells: interaction.options.getBoolean("sp"),
    withItems: interaction.options.getBoolean("it"),
    withMisc: interaction.options.getBoolean("misc")
  };

  const isOptionSet = Object.values(possibleOptions).some((option) => option != null);

  const options = {
    withMagicItems: possibleOptions.withMagicItems || !isOptionSet,
    withMonsters: possibleOptions.withMonsters || !isOptionSet,
    withSpells: possibleOptions.withSpells || !isOptionSet,
    withItems: possibleOptions.withItems || !isOptionSet,
    withMisc: possibleOptions.withMisc || !isOptionSet
  };
  const d3DictReq = new D3DictRequest(new URL(config.D3_API_BASE_URL), config.D3_API_VERSION, searchtext, options);
  const dictData = await d3DictReq.request();

  if (dictData) {
    const embeds = getDictEmbeds(dictData);
    const slicedEmbeds = sliceEmbeds(embeds);

    await interaction.editReply({ embeds: [...slicedEmbeds] });
    return;
  }
};

const getDictEmbeds = (data: Dict): EmbedBuilder[] => {
  const embeds: EmbedBuilder[] = [];

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

  const titleEmbed: EmbedBuilder = new EmbedBuilder().setColor(0xee3333).setTitle(`D3 Übersetzung für: ${data.s}`);
  if (data.result) {
    const maxCount = Math.round(config.DICT_MAX_RESULTS);
    if (data.result.length > maxCount) {
      description += `**Mehr als ${maxCount} Ergebnisse (${data.result.length}), versuche die Filter um weniger Ergebnisse zu bekommen**`;
    }

    const slicedRes = data.result.slice(0, maxCount);
    const dictResultEmbeds = getDictResultEmbeds(slicedRes);
    embeds.push(...dictResultEmbeds);
  }
  titleEmbed.setDescription(description);
  embeds.unshift(titleEmbed);

  return embeds;
};

const getDictResultEmbeds = (dict: DictResult[]): EmbedBuilder[] => {
  const dictEmbeds: EmbedBuilder[] = [];

  dict.forEach((res) => {
    const dictEmbed: EmbedBuilder = new EmbedBuilder().setColor(0xee3333);

    dictEmbed
      .addFields(
        { name: "Name DE", value: `${res.name_de}`, inline: true },
        {
          name: `${res.name_de_ulisses ? "Name DE (Ulisses)" : "\u200B"}`,
          value: `${res.name_de_ulisses ?? "\u200B"}`,
          inline: true
        },
        { name: "Name EN", value: `${res.name_en}`, inline: true }
      )
      .addFields(
        // ToDo Sinnvolle Anzeige für Typ?
        { name: "Typ", value: `${res.type}`, inline: true },
        { name: "Quelle DE", value: `${res.src_de.book_long} (S. ${res.src_de.p})`, inline: true },
        { name: "Quelle EN", value: `${res.src_en.book_long} (S. ${res.src_en.p})`, inline: true }
      );
    if (res.src_en.srd) {
      dictEmbed.addFields({ name: "5thSRD", value: `${config.D3_BASE_URL}${res.src_en.srd}` });
    }

    dictEmbeds.push(dictEmbed);
  });

  return dictEmbeds;
};

export default dictSubCommand;
