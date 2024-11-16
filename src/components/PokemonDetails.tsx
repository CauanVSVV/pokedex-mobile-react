import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPokemonDetails } from "../services/api";

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
  unknown: "#68a090", // "???" no exemplo
};

const PokemonDetails: React.FC = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPokemonDetails = async () => {
      setLoading(true);
      const data = await fetchPokemonDetails(
        `https://pokeapi.co/api/v2/pokemon/${id}`
      );
      setPokemon(data);
      setLoading(false);
    };

    loadPokemonDetails();
  }, [id]);

  if (loading) {
    return <p className="text-center">Carregando...</p>;
  }

  if (!pokemon) {
    return <p className="text-center">Erro ao carregar dados do Pokémon.</p>;
  }

  const getBarColor = (value: number) => {
    if (value > 150) return "bg-teal-500";
    if (value >= 100) return "bg-green-500";
    if (value >= 60) return "bg-yellow-400";
    if (value >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const totalStats = pokemon.stats.reduce(
    (total: number, stat: any) => total + stat.base_stat,
    0
  );

  const formatPokemonNumber = (id: number) => {
    return id.toString().padStart(4, '0'); // Formata para 0001, 0010, etc.
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start pt-20 pb-8"
      style={{
        background: `linear-gradient(to bottom, ${typeColors[pokemon.types[0].type.name.toLowerCase()]}, #ffffff)`,
      }}
    >
      {/* Botão de voltar */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] text-center relative">
        <img
          src={pokemon.sprites.other["official-artwork"].front_default}
          alt={pokemon.name}
          className="w-40 h-40 mx-auto mt-[-50px] drop-shadow-lg"
        />
        <h2 className="text-2xl font-bold capitalize mt-4">{pokemon.name}</h2>
        <span className="text-gray-500 text-sm font-bold">
            N° {formatPokemonNumber(pokemon.id)}
        </span>

        {/* Tipos do Pokémon */}
        <div className="flex justify-center gap-2 mt-4">
          {pokemon.types.map((type: any) => (
            <span
              key={type.type.name}
              style={{
                backgroundColor: typeColors[type.type.name.toLowerCase()],
                color: "white",
              }}
              className="px-3 py-1 rounded text-xs font-semibold uppercase shadow"
            >
              {type.type.name}
            </span>
          ))}
        </div>

        {/* Informações de Habilidades, Altura e Peso */}
        <div className="mt-6 flex justify-between">
          {/* Coluna de habilidades */}
          <div className="flex-1 text-left">
            <strong>Habilidades:</strong>
            <ol className="list-decimal list-inside mt-1">
              {pokemon.abilities.map((a: any, index: number) => (
                <li key={index} className="capitalize">
                  {a.ability.name}
                </li>
              ))}
            </ol>
          </div>
          {/* Coluna de Altura e Peso */}
          <div className="flex-1 text-right">
            <div>
              <strong>Altura</strong>
              <p>{(pokemon.height / 10).toFixed(1)} m</p>
            </div>
            <div className="mt-2">
              <strong>Peso</strong>
              <p>{(pokemon.weight / 10).toFixed(1)} kg</p>
            </div>
          </div>
        </div>

        {/* Exibir Status do Pokémon */}
        <div className="mt-6 text-left">
          <h3 className="text-lg font-bold mb-4">Status</h3>
          {pokemon.stats.map((stat: any, index: number) => (
            <div key={index} className="flex items-center mb-2">
              <span className="w-24 text-sm pr-8 font-semibold capitalize">
                {stat.stat.name}
              </span>
              <span className="w-10 text-sm font-bold">{stat.base_stat}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-4 ml-2 relative">
                <div
                  className={`h-4 rounded-full ${getBarColor(stat.base_stat)}`}
                  style={{
                    width: `${Math.min((stat.base_stat / 255) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
          <div className="flex items-center mt-4">
            <span className="w-24 text-sm font-semibold">Total</span>
            <span className="w-10 text-sm font-bold">{totalStats}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetails;
