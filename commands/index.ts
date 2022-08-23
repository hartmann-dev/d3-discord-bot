import { Collection } from "discord.js";
import { Command } from "../interfaces/Command";
import d3 from "./d3";

const commands: Collection<string, Command> = new Collection();
commands.set(d3.slashCommand.name, d3);

export default commands;
