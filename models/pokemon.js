const mongoose = require("mongoose");

const pokemonSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    pokeId: {
      type: Number,
      required: true,
    },
    sprite: { type: String },
    name: {
      type: String,
      required: true,
      lowercase: true,
    },
    types: {
      type: [String],
      required: true,
    },
    stats: {
      hp: { type: Number, required: true },
      attack: { type: Number, required: true },
      defense: { type: Number, required: true },
      specialAttack: { type: Number, required: true },
      specialDefense: { type: Number, required: true },
      speed: { type: Number, required: true },
    },
    location: {
      type: String,
      enum: ["party", "box"],
      default: "box",
      index: true,
    },
  },
  { timestamps: true }
);

const Pokemon = mongoose.model("Pokemon", pokemonSchema);

module.exports = Pokemon;
