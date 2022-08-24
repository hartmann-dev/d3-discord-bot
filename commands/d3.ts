import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder, Interaction } from "discord.js";
import { Dict } from "../interfaces/d3/Dict";
import { Monster, MonsterList } from "../interfaces/d3/Monster";
import { config } from "../utils/config";
import { D3DictRequest } from "../utils/d3/DictRequest";
import { D3MonsterRequest } from "../utils/d3/MonsterRequest";

import dictSubCommand from "./subs/dict";
import monsterSubCommand from "./subs/monster";

const slashCommand = new SlashCommandBuilder()
  .setName("d3")
  .setDescription("Verwendet die dnddeutsch.de API")
  .addSubcommand(dictSubCommand)
  .addSubcommand(monsterSubCommand);

const execute = async (interaction: Interaction) => {
  if (!interaction.isRepliable() || !interaction.isChatInputCommand()) return;
  let command = interaction.options.getSubcommand();

  // ToDo split into separate files
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
      const dictData = await d3DictReq.request();

      if (dictData) {
        const embed = getDictEmbed(dictData);
        await interaction.editReply({ embeds: [embed] });
        return;
      }
      break;
    case "monster":
      const monsterName = interaction.options.getString("name");
      if (!monsterName) return;
      await interaction.deferReply();
      const short = interaction.options.getBoolean("short") ?? false;

      const d3MonsterReq = new D3MonsterRequest(new URL(config.D3_API_BASE_URL), config.D3_API_VERSION, monsterName);
      const monsterData = await d3MonsterReq.request();
      if (monsterData) {
        const embeds = getMonsterEmbeds(monsterName, monsterData, short);
        await interaction.editReply({ embeds: [...embeds] });
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

const getMonsterEmbeds = (monsterName: string, data: Monster, short?: boolean): EmbedBuilder[] => {
  const embeds: EmbedBuilder[] = [];

  const titleEmbed: EmbedBuilder = new EmbedBuilder().setColor(0xee3333).setTitle(`Monstersuche für: ${monsterName}`);
  let description = `Backlink: ${data.backlink ?? config.D3_DEFAULT_BACKLINK}\n\n`;

  if (data.monster) {
    const maxCount = Math.round(config.MONSTER_MAX_RESULTS);
    if (data.monster.length > maxCount) {
      description += `**Mehr als ${maxCount} Ergebnisse (${data.monster.length}), versuche einen spezifischeren Namen um weniger Ergebnisse zu bekommen**`;
    }
    const slicedRes = data.monster.slice(0, maxCount);
    let monsterEmbeds;
    if (short) {
      monsterEmbeds = getShortMonsterEmbeds(slicedRes);
    } else {
      monsterEmbeds = getLongMonsterEmbeds(slicedRes);
    }
    embeds.push(...monsterEmbeds);
  } else {
    description += `\nKeine Monster für deine Suche gefunden.`;
  }
  titleEmbed.setDescription(description);
  embeds.unshift(titleEmbed);
  return embeds;
};

const getLongMonsterEmbeds = (monsters: MonsterList[]): EmbedBuilder[] => {
  const monsterEmbeds: EmbedBuilder[] = [];

  monsters.forEach((res) => {
    const monsterEmbed: EmbedBuilder = new EmbedBuilder().setColor(0xee3333);
    monsterEmbed
      .addFields(
        { name: "Name DE", value: `${res.name_de || "\u200B"}`, inline: true },
        { name: "Name DE (Ulisses)", value: `${res.name_de_ulisses ?? "\u200B"}`, inline: true },
        { name: "Name EN", value: `${res.name_en}`, inline: true }
      )
      .addFields(
        { name: "Typ", value: `${res.type}`, inline: true },
        { name: "Größe", value: `${res.size}`, inline: true },
        { name: "Gesinnung", value: `${res.alignment}`, inline: true }
      )
      .addFields(
        { name: "HG", value: `${res.cr}`, inline: true },
        { name: "EP", value: `${res.xp}`, inline: true },
        { name: "Schlagworte", value: `${res.tags || "\u200B"}`, inline: true }
      )
      .addFields(
        { name: "Quelle", value: `${res.src.join(", ")}`, inline: true },
        { name: "Seite (DE)", value: `${res.page_de}`, inline: true },
        { name: "Seite (EN)", value: `${res.page_en}`, inline: true }
      );
    monsterEmbeds.push(monsterEmbed);
  });
  return monsterEmbeds;
};

const getShortMonsterEmbeds = (monsters: MonsterList[]): EmbedBuilder[] => {
  const monsterEmbeds: EmbedBuilder[] = [];

  monsters.forEach((res) => {
    const monsterEmbed: EmbedBuilder = new EmbedBuilder().setColor(0xee3333);
    monsterEmbed.setDescription(res.singleline);
    monsterEmbeds.push(monsterEmbed);
  });
  return monsterEmbeds;
};

export default { slashCommand, execute };
