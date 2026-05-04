import React, { useState } from 'react';
import './Rankings.css';
import Partners from '../JeepRally/components/Partners';
const Rankings = () => {
  const [activeTab, setActiveTab] = useState('Stock & Prepaid');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = ['Stock & Prepaid', 'Quad Bike', 'Dirt Bike', '4x4', 'Truck Race'];

  const rankingData = [
    {
      pos: 1,
      driveTeam: 'LUCIANO BENAVIDES',
      team: 'RED BULL KTM FACTORY RACING',
      time: "49H 00' 41\"",
      variation: "+ 00H 25' 12\"",
      penalty: "00H 10' 00\""
    },
    {
      pos: 2,
      driveTeam: 'LUCIANO BENAVIDES',
      team: 'RED BULL KTM FACTORY RACING',
      time: "49H 00' 41\"",
      variation: "+ 00H 25' 12\"",
      penalty: "00H 10' 00\""
    },
    {
      pos: 3,
      driveTeam: 'LUCIANO BENAVIDES',
      team: 'RED BULL KTM FACTORY RACING',
      time: "49H 00' 41\"",
      variation: "+ 00H 25' 12\"",
      penalty: "00H 10' 00\""
    },
    {
      pos: 4,
      driveTeam: 'LUCIANO BENAVIDES',
      team: 'RED BULL KTM FACTORY RACING',
      time: "49H 00' 41\"",
      variation: "+ 00H 25' 12\"",
      penalty: "00H 10' 00\""
    },
    {
      pos: 5,
      driveTeam: 'LUCIANO BENAVIDES',
      team: 'RED BULL KTM FACTORY RACING',
      time: "49H 00' 41\"",
      variation: "+ 00H 25' 12\"",
      penalty: "00H 10' 00\""
    }
  ];

  return (
    <>

      <div className="rankings-page !mt-[100px]">
        <div className="rankings-container">
          {/* Banner Section */}
          <div className="rankings-banner">
            <div className="banner-frame-container">
              <img src="/assets/images/frame.png" alt="TDCP Jeep Rally Frame" className="banner-frame-img" />
              <div className="banner-text-overlay">
                <h1 className="banner-title">TDCP JEEP RALLY</h1>
              </div>
            </div>
            <p className="banner-subtitle">Cholistan 2026</p>
          </div>


          {/* Header Action Row */}
          <div className="rankings-header-row">
            <h1 className="rankings-title">026 Rankings after the stage 13</h1>
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
          <div className="rankings-filters no-scrollbar">
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

          {/* Table Section */}
          <div className="rankings-table-wrapper">
            <div className="table-title-bar">
              <h2>Team Standing</h2>
              <img src="/assets/images/head.png" alt="pattern" className="header-pattern" />
            </div>
            <table className="rankings-table">
              <thead>
                <tr>
                  <th>POS.</th>
                  <th>DRIVE-TEAM</th>
                  <th>TEAM</th>
                  <th>TIME</th>
                  <th>VARIATION</th>
                  <th>PENALTY</th>
                </tr>
              </thead>
              <tbody>
                {rankingData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.pos}</td>
                    <td className="drive-team">{row.driveTeam}</td>
                    <td className="team-name">{row.team}</td>
                    <td className="time-val">{row.time}</td>
                    <td className="variation-plus">{row.variation}</td>
                    <td>{row.penalty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Section */}
          <div className="rankings-footer">
            {/* Checkered flags at bottom right */}
            <div className="footer-flags-wrapper">
              <img src='/assets/images/flag_black.png' alt="flag" className='w-20 md:w-60 ' />
              {/* <span style={{ fontSize: '3rem' }}>🏁🏁</span> */}
            </div>
          </div>
        </div>
      </div>
      <Partners />
    </>
  );
};

export default Rankings;
