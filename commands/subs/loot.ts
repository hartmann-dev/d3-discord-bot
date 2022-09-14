import {
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionResponseFields,
  SlashCommandSubcommandBuilder
} from "discord.js";
import { Treasur } from "../../interfaces/d3/Treasur";
import { config } from "../../utils/config";
import { D3TreasureRequest } from "../../utils/d3/TreasurRequest";
import { sliceEmbeds } from "../../utils/sliceEmbeds";

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

export const execute = async (
  interaction: ChatInputCommandInteraction<CacheType> & InteractionResponseFields<CacheType>
) => {
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
export default lootSubCommand;
