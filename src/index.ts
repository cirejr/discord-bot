import { Hono } from "hono";
import { Client, GatewayIntentBits, Collection } from "discord.js";

interface ExtendedClient extends Client {
  commands: Collection<string, any>;
  cooldowns: Collection<string, any>;
}

const app = new Hono();

app.get("/", (c) => {
  return c.text("Bot is alive");
});

const baseClient = new Client({ intents: [GatewayIntentBits.Guilds] });

const client = baseClient as ExtendedClient;
client.commands = new Collection();
client.cooldowns = new Collection();

const commandseventsFolderPath = `${import.meta.dir}/commands`;
const commandGlob = new Bun.Glob("*/*.{ts,js}");

//Find and dynamically import all commands
for await (const relativePath of commandGlob.scan({
  cwd: commandseventsFolderPath,
})) {
  const filePath = `${commandseventsFolderPath}/${relativePath}`;
  const module = await import(filePath);

  const command = module.default;

  if (command && "data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
    );
  }
}

const eventsFolderPath = `${import.meta.dir}/events`;
const eventGlob = new Bun.Glob("*.{ts,js}");

//Find and dynamically import all events
for await (const eventFiles of eventGlob.scan({ cwd: eventsFolderPath })) {
  const filePath = `${eventsFolderPath}/${eventFiles}`;
  const module = await import(filePath);

  const event = module.default;
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

baseClient.login(process.env.DISCORD_TOKEN);

export default {
  port: Bun.env.PORT || 3000,
  fetch: app.fetch,
};
