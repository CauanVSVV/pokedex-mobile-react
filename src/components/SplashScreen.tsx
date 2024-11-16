import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Estilo para animação
const fallingAnimation = `
  @keyframes fall {
    0% {
      transform: translateY(-100%);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    100% {
      transform: translateY(100vh);
      opacity: 0;
    }
  }
`;

// Animação para as cores do botão (mais lenta)
const buttonColorAnimation = `
  @keyframes buttonColorChange {
    0% { background-color: #A8A77A; } /* Normal */
    10% { background-color: #EE8130; } /* Fire */
    20% { background-color: #6390F0; } /* Water */
    30% { background-color: #F7D02C; } /* Electric */
    40% { background-color: #7AC74C; } /* Grass */
    50% { background-color: #96D9D6; } /* Ice */
    60% { background-color: #C22E28; } /* Fighting */
    70% { background-color: #A33EA1; } /* Poison */
    80% { background-color: #E2BF65; } /* Ground */
    90% { background-color: #A98FF3; } /* Flying */
    100% { background-color: #A8A77A; } /* Normal (loop) */
  }
`;

const SplashScreen: React.FC = () => {
  const [pokemonImages, setPokemonImages] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPokemonImages = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=30" // Aumenta o limite para 30 Pokémons
        );
        const data = await response.json();

        const imageUrls = await Promise.all(
          data.results.map(async (pokemon: any) => {
            const pokemonDetails = await fetch(pokemon.url);
            const detailsData = await pokemonDetails.json();
            return detailsData.sprites.other["official-artwork"].front_default;
          })
        );

        // Duplicação para criar mais movimento
        const expandedImages = [...imageUrls, ...imageUrls.slice(0, 50)];
        setPokemonImages(expandedImages.filter((url: string | null) => url !== null));
      } catch (error) {
        console.error("Erro ao buscar as imagens dos Pokémons:", error);
      }
    };

    fetchPokemonImages();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #ffffff, #d3eaf7)",
      }}
    >
      {/* Adiciona animações personalizadas */}
      <style>{fallingAnimation}</style>
      <style>{buttonColorAnimation}</style>

      {/* Importa a fonte "Pokemon Solid" */}
      <style>
        {`
          @import url('https://fonts.cdnfonts.com/css/pokemon-solid');
        `}
      </style>

      {/* Pokémons caindo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {pokemonImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Pokemon ${index}`}
            className="absolute w-20 h-20"
            style={{
              animation: `fall ${4 + Math.random() * 50}s linear infinite`, // Duração aleatória entre 4 e 9 segundos
              left: `${Math.random() * 80}%`, // Posição horizontal aleatória
              top: `-${Math.random() * 50}vh`, // Começa fora da tela
            }}
          />
        ))}
      </div>

      {/* Título principal estilizado */}
      <h1
        className="text-6xl font-bold mb-[200px] drop-shadow-lg z-10"
        style={{
          color: "#FFCB05", // Cor amarela
          textShadow: `
            -2px -2px 0 #3B4CCA, 
            2px -2px 0 #3B4CCA, 
            -2px 2px 0 #3B4CCA, 
            2px 2px 0 #3B4CCA`,
          fontFamily: `'Pokemon Solid', sans-serif`, // Fonte personalizada
          letterSpacing: "0.15em", // Maior espaçamento entre letras
        }}
      >
        Pokédex
      </h1>

      {/* Botão para iniciar com animação de cores */}
      <button
        onClick={() => navigate("/home")} // Redireciona para Home.tsx
        className="text-white px-8 py-3 rounded-full text-2xl shadow-md hover:scale-105 transition-transform transform z-10"
        style={{
          animation: "buttonColorChange 50s infinite", // Animação de cores lenta (15 segundos)
        }}
      >
        Toque para iniciar
      </button>
    </div>
  );
};

export default SplashScreen;
