import React, { useEffect, useState } from "react";
import { fetchPokemonDetails } from "../services/api";
import { useNavigate } from "react-router-dom";

// Mapeamento de cores para cada tipo
const typeColors: { [key: string]: string } = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const Home: React.FC = () => {
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUrl, setCurrentUrl] = useState<string>(
    "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20"
  );
  const [previousUrl, setPreviousUrl] = useState<string | null>(null);
  const [nextUrl, setNextUrl] = useState<string | null>(null);

  const navigate = useNavigate();

  const loadPokemons = async () => {
    try {
      setLoading(true);
      const response = await fetch(currentUrl);
      const data = await response.json();

      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const id = pokemon.url.split("/").filter(Boolean).pop();
          const details = await fetchPokemonDetails(
            `https://pokeapi.co/api/v2/pokemon/${id}`
          );
          return {
            id: parseInt(id, 10),
            name: details.name,
            types: details.types.map((t: any) => t.type.name),
            image: details.sprites.other["official-artwork"].front_default,
          };
        })
      );

      setPokemons(detailedPokemons);
      setNextUrl(data.next);
      setPreviousUrl(data.previous);
    } catch (error) {
      console.error("Erro ao carregar os Pokémons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPokemons();
  }, [currentUrl]);

  const formatPokemonNumber = (id: number) => id.toString().padStart(4, "0");

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative">
      <style>
        {`
          @import url('https://fonts.cdnfonts.com/css/pokemon-solid');
        `}
      </style>

      <h1
        className="text-center mb-8"
        style={{
          fontSize: "3rem",
          color: "#FFCB05",
          textShadow: `-2px -2px 0 #3B4CCA, 2px -2px 0 #3B4CCA, -2px 2px 0 #3B4CCA, 2px 2px 0 #3B4CCA`,
          fontFamily: `'Pokemon Solid', sans-serif`,
          letterSpacing: "0.2em",
        }}
      >
        Pokédex
      </h1>

      {loading ? (
        <p className="text-center text-gray-500 font-bold">Carregando...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 mb-14">
          {pokemons.map((pokemon) => (
            <div
              key={pokemon.id}
              className="relative p-4 rounded-lg shadow-lg hover:scale-105 transform transition-transform cursor-pointer flex flex-col items-center text-white"
              onClick={() => navigate(`/pokemon/${pokemon.id}`)}
              style={{
                background: `linear-gradient(to bottom, ${
                  typeColors[pokemon.types[0].toLowerCase()]
                }, #ffffff)`,
              }}
            >
              <span className="absolute top-2 left-2 text-sm font-bold">
                N° {formatPokemonNumber(pokemon.id)}
              </span>
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className="w-26 h-26 mt-4 mb-2 drop-shadow-xl"
              />
              <p className="text-center text-xl capitalize font-bold drop-shadow-md">
                {pokemon.name}
              </p>
              <div className="flex gap-2 mt-2">
                {pokemon.types.map((type: string) => (
                  <span
                    key={type}
                    className="px-2 py-1 rounded text-xs font-semibold uppercase shadow-lg"
                    style={{
                      backgroundColor: typeColors[type.toLowerCase()],
                    }}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botões de navegação */}
      <div className="fixed bottom-4 left-4">
        {previousUrl && (
          <button
            onClick={() => setCurrentUrl(previousUrl)}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full shadow-md hover:bg-gray-200 font-semibold"
          >
            Voltar
          </button>
        )}
      </div>
      <div className="fixed bottom-4 right-4">
        {nextUrl && (
          <button
            onClick={() => setCurrentUrl(nextUrl)}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-full shadow-md hover:bg-gray-200 font-semibold"
          >
            Mais
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
