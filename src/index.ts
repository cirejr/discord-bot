import { Hono } from "hono";
import {
  Client,
  Events,
  GatewayIntentBits,
  Collection,
  MessageFlags,
} from "discord.js";
import "dotenv/config";

const app = new Hono();

interface ExtendedClient extends Client {
  commands: Collection<string, any>;
}

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// Create a new client instance
const baseClient = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
baseClient.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
baseClient.login(process.env.DISCORD_TOKEN);
const client = baseClient as ExtendedClient;
client.commands = new Collection();

const foldersPath = `${import.meta.dir}/commands`;
const glob = new Bun.Glob("*/*.{ts,js}");

for await (const relativePath of glob.scan({ cwd: foldersPath })) {
  const filePath = `${foldersPath}/${relativePath}`;
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

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands!.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});

export default app;
