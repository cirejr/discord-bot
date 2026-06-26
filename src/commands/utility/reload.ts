import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";

const reload = {
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reloads a command")
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName("command")
        .setDescription("The command to reload")
        .setRequired(true),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const commandName = interaction.options
      .getString("command", true)
      .toLocaleLowerCase();
    const command = interaction.client.commands.get(commandName);

    if (!command) {
      return interaction.reply(
        `There is no command with name \`${commandName}\`!`,
      );
    }

    try {
      const newCommand = require(`./${command.data.name}.js`);
      interaction.client.commands.set(newCommand.data.name, newCommand);
      await interaction.reply(
        `Command \`${newCommand.data.name}\` was reloaded!`,
      );
    } catch (error) {
      console.error(error);
      await interaction.reply(
        `There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``,
      );
    }
  },
};
