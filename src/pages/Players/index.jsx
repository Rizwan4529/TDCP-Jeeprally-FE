import React, { useState } from 'react';
import './Players.css';
import Partners from '../JeepRally/components/Partners';

const Players = () => {
  const [activeTab, setActiveTab] = useState('Stock & Prepaid');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = ['Stock & Prepaid', 'Quad Bike', 'Dirt Bike', '4x4', 'Truck Race'];

  const playersData = [
    {
      id: 1,
      number: '#12',
      name: 'Farhan Qureshi',
      image: '/assets/images/pl1.png'
    },
    {
      id: 2,
      number: '#54',
      name: 'Hassan Malik',
      image: '/assets/images/pl2.png'
    },
    {
      id: 3,
      number: '# 22',
      name: 'Ahmed Khan',
      image: '/assets/images/pl3.png'
    },
    {
      id: 4,
      number: '#12',
      name: 'Daniel Sanders',
      image: '/assets/images/pl1.png'
    }
  ];

  return (
    <div className="players-page mt-[100px]">
      <div className="players-container">
        {/* Banner Section */}
        <div className="players-banner">
          <div className="banner-frame-container">
            <img src="/assets/images/frame.png" alt="TDCP Jeep Rally Frame" className="banner-frame-img" />
            <div className="banner-text-overlay">
              <h1 className="banner-title">TDCP JEEP RALLY</h1>
            </div>
          </div>
          <p className="banner-subtitle">Cholistan 2026</p>
        </div>

        {/* Header Content Row */}
        <div className="players-header-row">
          <h1 className="players-title">Players Name</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Driver name"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn">Search</button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="players-filters">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`filter-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Players Grid Section */}
        <div className="players-grid">
          {playersData.map((player) => (
            <div key={player.id} className="player-card">
              <img src={player.image} alt={player.name} className="player-img" />
              <div className="player-info-box">
                <span className="player-number">{player.number}</span>
                <span className="player-name">{player.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Partners />
    </div>
  );
};

export default Players;
