import { REST, Routes } from "discord.js";

const token = Bun.env.DISCORD_TOKEN;
const clientId = Bun.env.APP_ID;
const guildId = Bun.env.GUILD_ID;

const commands = [];
const foldersPath = `${import.meta.dir}/commands`;
const glob = new Bun.Glob("*/*.{ts,js}");

for await (const file of glob.scan({ cwd: foldersPath })) {
  const filePath = `${foldersPath}/${file}`;
  const module = await import(filePath);
  const command = module.default;

  if (command?.data && command?.execute) {
    commands.push(command.data.toJSON());
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
    );
  }
}

const rest = new REST().setToken(token!);

(async () => {
  try {
    if (!clientId || !guildId) {
      throw new Error("Missing APP_ID or GUILD_ID in environment variables.");
    }

    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );

    const data = (await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    )) as any[]; // Casted to any[] so .length works without TS complaints

    console.log(
      `Successfully reloaded ${data?.length} application (/) commands.`,
    );
  } catch (error) {
    console.error(error);
  }
})();
