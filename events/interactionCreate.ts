import { Collection, Interaction } from "discord.js";

const name = "interactionCreate";
const execute = async (commands: Collection<String, any>, interaction: Interaction) => {
  //console.log(`${interaction.user.tag} triggered an interaction.`);
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true
    });
  }
};

export default { name, execute };
