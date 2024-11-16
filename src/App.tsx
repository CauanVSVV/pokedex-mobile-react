import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen'; // Importe a tela inicial
import Home from './components/Home';
import PokemonDetails from './components/PokemonDetails';

const App: React.FC = () => {
  return (
    <Routes>
      {/* Rota da tela inicial */}
      <Route path="/" element={<SplashScreen />} />

      {/* Rota para a Home */}
      <Route path="/home" element={<Home />} />

      {/* Rota para detalhes do Pokémon */}
      <Route path="/pokemon/:id" element={<PokemonDetails />} />
    </Routes>
  );
};

export default App;
