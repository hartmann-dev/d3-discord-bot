import { Collection, Interaction } from "discord.js";

const name = "interactionCreate";
const execute = async (commands: Collection<String, any>, interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "Ein Fehler ist aufgetreten!",
      ephemeral: true
    });
  }
};

export default { name, execute };
