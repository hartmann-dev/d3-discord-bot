import {
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionResponseFields,
  SlashCommandSubcommandBuilder
} from "discord.js";
import { Monster, MonsterList } from "../../interfaces/d3/Monster";
import { config } from "../../utils/config";
import { D3MonsterRequest } from "../../utils/d3/MonsterRequest";
import { sliceEmbeds } from "../../utils/sliceEmbeds";

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

export const execute = async (
  interaction: ChatInputCommandInteraction<CacheType> & InteractionResponseFields<CacheType>
) => {
  const monsterName = interaction.options.getString("name");
  if (!monsterName) return;
  await interaction.deferReply();
  const short = interaction.options.getBoolean("short") ?? false;

  const d3MonsterReq = new D3MonsterRequest(new URL(config.D3_API_BASE_URL), config.D3_API_VERSION, monsterName);

  try {
    const monsterData = await d3MonsterReq.request();
    if (monsterData) {
      const embeds = getMonsterEmbeds(monsterName, monsterData, short);
      const slicedEmbeds = sliceEmbeds(embeds);

      if (slicedEmbeds.length) await interaction.editReply({ embeds: [...slicedEmbeds] });
      return true;
    }
  } catch (error) {
    return new Error();
  }
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
        { name: "HG", value: `${res.cr_human ?? res.cr}`, inline: true },
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

export default dictSubCommand;
