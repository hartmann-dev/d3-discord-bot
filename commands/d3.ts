import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder, Interaction, MessageFlags } from "discord.js";

import { Dict, DictResult } from "../interfaces/d3/Dict";
import { Monster, MonsterList } from "../interfaces/d3/Monster";
import { Treasur } from "../interfaces/d3/Treasur";

import { config } from "../utils/config";
import { D3DictRequest } from "../utils/d3/DictRequest";
import { D3MonsterRequest } from "../utils/d3/MonsterRequest";
import { D3TreasureRequest } from "../utils/d3/TreasurRequest";

import dictSubCommand from "./subs/dict";
import monsterSubCommand from "./subs/monster";
import lootSubCommand from "./subs/loot";
import helpSubCommand from "./subs/help";

const fs = require("fs");

/*https://discordjs.guide/popular-topics/embeds.html#embed-limits */
const MAX_EMBEDS = 10;

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

  // ToDo split into separate files
  switch (command) {
    case "help":
      fs.readFile("help.txt", "utf8", (err: string, data: string) => {
        if (err) {
          console.error(err);
          return;
        }
        interaction.reply({ content: data, flags: MessageFlags.SuppressEmbeds });
      });
      return;
    case "dict":
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
        const slicedEmbeds = sliceEmbeds(embeds);

        if (slicedEmbeds.length) await interaction.editReply({ embeds: [...slicedEmbeds] });
        return;
      }
      break;
    case "loot":
      const cr = Number.parseInt(interaction.options.getString("cr", true));
      const count = interaction.options.getString("count", true).toLowerCase();

      let ic: number | "hoard";

      if (count == "hort" || count == "hoard") {
        ic = "hoard";
      } else {
        let num = Number(count);
        if (Number.isInteger(num) && num > 0 && num < Number.MAX_SAFE_INTEGER) {
          ic = num;
        } else {
          await interaction.reply("Fehlerhafte Eingabe");
          return;
        }
      }
      await interaction.deferReply();

      if (cr >= 0 && ic) {
        const d3TreasureReq = new D3TreasureRequest(new URL(config.D3_API_BASE_URL), config.D3_API_VERSION, cr, ic);
        const traesureData = await d3TreasureReq.request();
        if (traesureData) {
          const embeds = getLootEmbeds(traesureData);
          const slicedEmbeds = sliceEmbeds(embeds);

          await interaction.editReply({ embeds: [...slicedEmbeds] });
          return;
        }
        return;
      }

      break;
  }

  await interaction.editReply("Ein Fehler ist aufgetreten.");
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

const getLootEmbeds = (data: Treasur): EmbedBuilder[] => {
  const lootEmbeds: EmbedBuilder[] = [];

  const embed = new EmbedBuilder().setColor(0xee3333).setTitle(`Schatzgenerator`);
  const description = [];
  if (data.error) {
    description.push("Ein Fehler ist aufgetreten:");
    description.push(`${data.error}\n`);
  } else {
    if (data.ic == "hoard") {
      description.push(`**für einen Hort mit HG ${data.crtier}**`);
    } else {
      description.push(`**für ${data.ic} Monster mit HG ${data.crtier}**`);
    }
  }
  description.push(`\nVault: [${data.vault}](https://www.dnddeutsch.de/schatzgenerator/?vault=${data.vault})`);
  description.push(`Backlink: ${data.backlink ?? config.D3_DEFAULT_BACKLINK}\n`);

  if (data.coins) {
    description.push("**:coin: Münzen**");
    if (data.coins.copper) description.push(`Kupfer: ${data.coins.copper} Münzen`);
    if (data.coins.silver) description.push(`Silber: ${data.coins.silver} Münzen`);
    if (data.coins.electrum) description.push(`Elektrum: ${data.coins.electrum} Münzen`);
    if (data.coins.gold) description.push(`Gold: ${data.coins.gold} Münzen`);
    if (data.coins.platinum) description.push(`Platinum: ${data.coins.platinum} Münzen`);
    description.push("\n*Münzen insgesamt:*");
    description.push(`insgesamt: ${data.coins.count} Münzen`);
    description.push(`Wert: ${data.coins.value} Goldmünzen`);
    description.push(`Gewicht: ${data.coins.weight} Pfund\n`);
  }

  if (data.gemstone) {
    description.push("**:gem: Edelsteine**");
    Object.entries(data.gemstone).forEach(([name, gem], index) => {
      if (typeof gem !== "number") description.push(`${gem.count} **${name}** (Wert: ${gem.value} Goldmünzen )`);
    });
    description.push("\n*Edelsteine insgesamt:*");
    description.push(`insgesamt: ${data.gemstone.count} Edelsteine`);
    description.push(`Wert: ${data.gemstone.value} Goldmünzen`);
    description.push(`Gewicht: ${data.gemstone.weight} Pfund\n`);
  }

  if (data.artobject) {
    description.push("**:frame_photo: Kunstobjekte**");
    Object.entries(data.artobject).forEach(([name, art], index) => {
      if (typeof art !== "number") description.push(`${art.count} **${name}** (Wert: ${art.value} Goldmünzen )`);
    });
    description.push("\n*Kunstobjekte insgesamt:*");
    description.push(`insgesamt: ${data.artobject.count} Kunstobjekte`);
    description.push(`Wert: ${data.artobject.value} Goldmünzen`);
    description.push(`Gewicht: ${data.artobject.weight} Pfund\n`);
  }
  description.push("**:moneybag: Gesamtwert aller Schätze**");
  description.push(`Wert: ${data.sum.value} Goldmünzen`);
  description.push(`Gewicht: ${data.sum.weight} Pfund\n`);

  embed.setDescription(description.join("\n"));

  if (data.magicitem) {
    data.magicitem.forEach((mi) => {
      const miEmbed: EmbedBuilder = new EmbedBuilder().setColor(0xee3333);
      const miDescription = [];
      miDescription.push(`**Name EN:** ${mi.name_en}`);
      if (mi.name_de_ulisses) miDescription.push(`**Name DE (Ulisses):** ${mi.name_de_ulisses}`);
      miDescription.push(`\n**Quelle DE:** ${mi.src_de.book} (S.${mi.src_de.p})`);
      miDescription.push(`**Quelle EN:** ${mi.src_en.book} (S.${mi.src_en.p})`);
      miDescription.push(`\n**Wurf:** Tabelle: ${mi.table} (${mi.roll})`);

      miEmbed.setTitle(`:small_orange_diamond: ${mi.name_de}`).setDescription(miDescription.join("\n"));
      miEmbed.addFields({ name: "5thSRD", value: `${config.D3_BASE_URL}${mi.src_en.srd}` });

      lootEmbeds.push(miEmbed);
    });
  }

  lootEmbeds.unshift(embed);
  return lootEmbeds;
};

const sliceEmbeds = (embeds: EmbedBuilder[]): EmbedBuilder[] => {
  if (embeds.length > MAX_EMBEDS) {
    console.warn(`Auf Grund der Discord Beschränkungen sind nur maximal ${MAX_EMBEDS} Embeds möglich!`);
    return embeds.slice(0, MAX_EMBEDS);
  }
  return embeds;
};

export default { slashCommand, execute };
