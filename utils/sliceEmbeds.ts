import { EmbedBuilder } from "discord.js";
import { config } from "./config";

export const sliceEmbeds = (embeds: EmbedBuilder[]): EmbedBuilder[] => {
  if (embeds.length > config.MAX_EMBEDS) {
    console.warn(`Auf Grund der Discord Beschränkungen sind nur maximal ${config.MAX_EMBEDS} Embeds möglich!`);
    return embeds.slice(0, config.MAX_EMBEDS);
  }
  return embeds;
};
