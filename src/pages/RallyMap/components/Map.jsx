import React, { useState } from 'react'
import '../RallyMap.css'
import Partners from '../../JeepRally/components/Partners';
const Map = () => {
    const [activeTab, setActiveTab] = useState('Jeep');

    const tabs = ['Jeep', 'Quad Bike', 'Dirt Bike'];

    return (
        <div className="rm-wrapper ">
            {/* Header Section */}
            <header className="rm-header">
                <div className="rm-title-row">
                    <img src='/assets/images/flag.png' alt="flag" className='w-10 md:w-20 rotate-y-180' />
                    <p className='font-gilda text-[24px] md:text-[42px]'>Cholistan Desert</p>
                    <img src='/assets/images/flag.png' alt="flag" className='w-10 md:w-20' />
                </div>
                <div className="rm-stats">
                    <p>Total Distance: <strong>~200 KM</strong></p>
                    <p>Estimated Time: <strong>3–5 Hours</strong></p>
                </div>

                <div className="rm-toggle-container">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={`rm-toggle-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            <div className="rm-canvas">

                <img
                    src="/assets/images/map_line.png"
                    alt="Rally Track"
                    className="rm-road-img "
                />

                {/* LEFT ITEMS */}
                <div className="rm-item rm-left" style={{ top: '14.5%' }}>
                    <div className="rm-card">
                        <img src="/assets/images/jeep_3_1.jpg" alt="Warm-Up" className="rm-card-img" />
                        <div className="rm-card-body">
                            <h2 className="rm-card-title">Warm-Up Track <span className="rm-km">(0–40 KM)</span></h2>
                            <ul className="rm-list">
                                <li>Flat Desert Terrain</li>
                                <li>Light Sand</li>
                                <li>Speed Build-Up Zone</li>
                            </ul>
                        </div>
                    </div>
                    <div className="rm-dot-connector"></div>
                </div>

                <div className="rm-item rm-left rm-chk-item" style={{ top: '40%' }}>
                    <div className="rm-cp-text">
                        <p className="rm-cp-title">Checkpoint 1 (50 KM) <span className="red-dot">●</span></p>
                        <ul className="rm-list">
                            <li>Water / Safety Check</li>
                            <li>Quick Inspection</li>
                        </ul>
                    </div>
                    <div className="rm-dot-connector red"></div>
                </div>

                <div className="rm-item rm-left" style={{ top: '46.5%', left: '5%' }}>
                    <div className="rm-card">
                        <img src="/assets/images/jeep_5_1.jpg" alt="Technical" className="rm-card-img" />
                        <div className="rm-card-body">
                            <h2 className="rm-card-title">Technical Terrain <span className="rm-km">(100–160 KM)</span></h2>
                            <ul className="rm-list">
                                <li>Rough Patches</li>
                                <li>Narrow Tracks</li>
                                <li>Zig-Zag Navigation</li>
                            </ul>
                        </div>
                    </div>
                    <div className="rm-dot-connector"></div>
                </div>

                {/* RIGHT ITEMS */}
                <div className="rm-item rm-right" style={{ top: '0.5%' }}>
                    <div className="rm-dot-connector"></div>
                    <div className="rm-card">
                        <img src="/assets/images/jeep_4_2.png" alt="Dune" className="rm-card-img" />
                        <div className="rm-card-body">
                            <h2 className="rm-card-title">Dune Challenge <span className="rm-km">(40–100 KM)</span></h2>
                            <ul className="rm-list">
                                <li>Medium To High Dunes</li>
                                <li>Elevation Changes</li>
                                <li>Sharp Inclines & Drops</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="rm-item rm-right rm-chk-item" style={{ top: '22%' }}>
                    <div className="rm-dot-connector red"></div>
                    <div className="rm-cp-text">
                        <p className="rm-cp-title"><span className="red-dot">●</span> Checkpoint 2 (100 KM)</p>
                        <ul className="rm-list">
                            <li>Midpoint Break</li>
                            <li>Refueling Zone</li>
                        </ul>
                    </div>
                </div>

                <div className="rm-item rm-right" style={{ top: '29%', }}>
                    <div className="rm-dot-connector"></div>
                    <div className="rm-card">
                        <img src="/assets/images/jeep_3_3.jpg" alt="Speed Run" className="rm-card-img" />
                        <div className="rm-card-body">
                            <h2 className="rm-card-title">Speed Run <span className="rm-km">(160–200 KM)</span></h2>
                            <ul className="rm-list">
                                <li>Long Straight Track</li>
                                <li>High-Speed Zone</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* <div className="rm-item rm-right" style={{ top: '85%' }}>
          <div className="rm-dot-connector"></div>
          <div className="rm-card">
            <img src="/assets/images/jeep_3_5.jpg" alt="Final Speed" className="rm-card-img" />
            <div className="rm-card-body">
              <h2 className="rm-card-title">Speed Run <span className="rm-km">(160–200 KM)</span></h2>
              <ul className="rm-list">
                <li>Long Straight Track</li>
                <li>High-Speed Zone</li>
              </ul>
            </div>
          </div>
        </div> */}

            </div>
        </div>)
}

export default Map