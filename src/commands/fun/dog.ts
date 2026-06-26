import { SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
  .setName("dog")
  .setNameLocalizations({
    pl: "pies",
    de: "hund",
  })
  .setDescription("Get a cute pic of a dog!")
  .setDescriptionLocalizations({
    pl: "Słodkie zdjęcie pieska!",
    de: "Poste ein niedliches Hundebild!",
  })
  .addStringOption((option) =>
    option
      .setName("breed")
      .setDescription("Breed of dog")
      .setNameLocalizations({
        pl: "rasa",
        de: "rasse",
      })
      .setDescriptionLocalizations({
        pl: "Rasa psa",
        de: "Hunderasse",
      }),
  );

export default data;
