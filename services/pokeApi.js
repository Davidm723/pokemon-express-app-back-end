const getPokemonData = async (nameOrId) => {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);

    if (!res.ok) {
      throw new Error("Pokemon not found or API error");
    }

    const data = await res.json();

    const stats = {
      hp: data.stats.find((s) => s.stat.name === "hp").base_stat,
      attack: data.stats.find((s) => s.stat.name === "attack").base_stat,
      defense: data.stats.find((s) => s.stat.name === "defense").base_stat,
      specialAttack: data.stats.find((s) => s.stat.name === "special-attack")
        .base_stat,
      specialDefense: data.stats.find((s) => s.stat.name === "special-defense")
        .base_stat,
      speed: data.stats.find((s) => s.stat.name === "speed").base_stat,
    };

    return {
      pokeId: data.id,
      sprite: data.sprites.front_default,
      name: data.name,
      types: data.types.map((t) => t.type.name),
      stats,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = { getPokemonData };
