const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verify-token");

const Pokemon = require("../models/pokemon");
const { getPokemonData } = require("../services/pokeApi");

router.post("/", verifyToken, async (req, res) => {
  try {
    const { nameOrId } = req.body;

    if (!nameOrId) {
      return res.status(400).json({ err: "Missing Pokemon name or ID" });
    }

    const pokeData = await getPokemonData(nameOrId);

    const partyCount = await Pokemon.countDocuments({
      user: req.user._id,
      location: "party",
    });

    const location = partyCount < 6 ? "party" : "box";

    const newPokemon = await Pokemon.create({
      user: req.user._id,
      pokeId: pokeData.pokeId,
      name: pokeData.name,
      types: pokeData.types,
      stats: pokeData.stats,
      location,
    });

    res.status(201).json({ pokemon: newPokemon });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});
