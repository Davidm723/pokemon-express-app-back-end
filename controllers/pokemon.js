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
      sprite: pokeData.sprite,
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

router.get("/party", verifyToken, async (req, res) => {
  try {
    const party = await Pokemon.find({
      user: req.user._id,
      location: "party",
    }).sort({ createdAt: 1 });

    res.status(200).json(party);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get("/box", verifyToken, async (req, res) => {
  try {
    const box = await Pokemon.find({
      user: req.user._id,
      location: "box",
    }).sort({ pokeId: 1 });

    res.status(200).json(box);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.put("/:pokemonId/move", verifyToken, async (req, res) => {
  try {
    const pokemon = await Pokemon.findOne({
      _id: req.params.pokemonId,
      user: req.user._id,
    });

    if (!pokemon) {
      return res.status(404).json({ err: "Pokemon not found" });
    }

    if (pokemon.location === "box") {
      const partyCount = await Pokemon.countDocuments({
        user: req.user._id,
        location: "party",
      });

      if (partyCount >= 6) {
        return res.status(400).json({ err: "Party is full" });
      }

      pokemon.location = "party";
    } else {
      pokemon.location = "box";
    }

    await pokemon.save();
    res.status(200).json(pokemon);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.delete("/:pokemonId", verifyToken, async (req, res) => {
  try {
    const deletedPokemon = await Pokemon.findOneAndDelete({
      _id: req.params.pokemonId,
      user: req.user._id,
    });

    if (!deletedPokemon) {
      return res.status(404).json({ err: "Pokemon not found" });
    }

    res.status(200).json({
      message: `${deletedPokemon.name} was released`,
      pokemon: {
        id: deletedPokemon._id,
        name: deletedPokemon.name,
        location: deletedPokemon.location,
      },
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
