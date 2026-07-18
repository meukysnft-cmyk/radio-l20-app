import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
// Ícones robustos e representativos
import { IoHome, IoMicCircle, IoNewspaper, IoFootball, IoVideocam, IoMoon, IoGameController } from 'react-icons/io5';
import './BottomNav.css'; // Importe o CSS aqui

// Estrutura de dados dos itens de navegação
const navItems = [
  { id: 1, name: 'Início', path: '/', icon: IoHome, color: '#00ccff' }, // Ciano Neon
  { id: 2, name: 'Ao Vivo', path: '/live', icon: IoMicCircle, color: '#ff3366' }, // Vermelho Neon
  { id: 3, name: 'Notícias', path: '/news', icon: IoNewspaper, color: '#ffd700' }, // Ouro Neon
  { id: 4, name: 'Esportes', path: '/sports', icon: IoFootball, color: '#33ff33' }, // Verde Neon
  { id: 5, name: 'Vídeos', path: '/videos', icon: IoVideocam, color: '#ff66ff' }, // Magenta Neon
  { id: 6, name: 'Horóscopo', path: '/horoscope', icon: IoMoon, color: '#cc99ff' }, // Violeta Claro
  { id: 7, name: 'Palavra', path: '/game', icon: IoGameController, color: '#ccccff' }, // Azul Pálido
];

const BottomNav = () => {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;
        
        return (
          <NavLink
            key={item.id}
            to={item.path}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
            // Passamos a cor via CSS Variable para animações dinâmicas
            style={{ '--active-color': item.color }}
          >
            {/* O ícone maior com animações */}
            <div className="icon-wrapper">
              <IconComponent className="nav-icon" />
              {/* O anel de animação que pulsa ao redor */}
              {isActive && <div className="pulse-ring"></div>}
            </div>
            
            {/* Rótulo de texto maior */}
            <span className="nav-label">{item.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default BottomNav;