import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";

const infoCommand = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Get info about a user or a server!")
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName("user")
        .setDescription("info about a user")
        .addUserOption((input) =>
          input.setName("target").setDescription("The user"),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("server").setDescription("Info about the server"),
    ),
};

export default infoCommand;
