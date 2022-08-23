import { SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export interface Command {
  slashCommand: SlashCommandSubcommandsOnlyBuilder;
  execute(...args: any): Promise<any>;
}
