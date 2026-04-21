import React, { useState } from 'react';
import './PreviousRallies.css';
import Partners from '../JeepRally/components/Partners';
import AnimatedButton from '../../components/common/AnimatedButton';

const PreviousRallies = () => {
    const [activeTab, setActiveTab] = useState('Stock & Prepaid');

    const tabs = ['Stock & Prepaid', 'Quad Bike', 'Dirt Bike', '4x4', 'Truck Race'];

    const rallies = [
        {
            id: 1,
            title: 'Toronto Motorcycle',
            date: '31 AUGUST, 2025',
            description: 'Room Service at TDCP resorts refers to the in-room dining facility that allows guests to order food and beverages.',
            image: '/assets/images/jeep_3_1.jpg',
            type: 'small'
        },
        {
            id: 2,
            title: 'Cholistan Desert Rally',
            date: '31 AUGUST, 2025',
            description: 'Room Service at TDCP resorts refers to the in-room dining facility that allows guests to order food and beverages.',
            image: '/assets/images/dessert_2.png',
            type: 'large'
        },
        {
            id: 3,
            title: 'Toronto Motorcycle',
            date: '31 AUGUST, 2025',
            description: 'Room Service at TDCP resorts refers to the in-room dining facility that allows guests to order food and beverages.',
            image: '/assets/images/jeep_3_2.jpg',
            type: 'small'
        },
        {
            id: 4,
            title: 'Toronto Motorcycle',
            date: '31 AUGUST, 2025',
            description: 'Room Service at TDCP resorts refers to the in-room dining facility that allows guests to order food and beverages.',
            image: '/assets/images/jeep_3_3.jpg',
            type: 'small'
        },
        {
            id: 5,
            title: 'Toronto Motorcycle',
            date: '31 AUGUST, 2025',
            description: 'Room Service at TDCP resorts refers to the in-room dining facility that allows guests to order food and beverages.',
            image: '/assets/images/jeep_3_4.jpg',
            type: 'small'
        }
    ];

    return (
        <div className="previous-page">
            <div className="container previous-container">
                {/* Header Section */}
                <div className="previous-header">
                    <img src="/assets/images/header-frame.png" alt="pattern" className="header-frame" />
                    <h1 className="previous-title">Previous Rallies</h1>
                </div>

                {/* Filter Tabs */}
                <div className="players-filters flex justify-center flex-wrap gap-2 md:gap-4 mb-12">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={`px-6 py-2 rounded-full text-sm transition-all duration-300 ${activeTab === tab
                                ? 'bg-brand-green text-white shadow-md'
                                : 'bg-white/50 text-gray-600 hover:bg-white'
                                }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Rallies Grid */}
                <div className="rallies-grid">
                    {rallies.map((rally) => (
                        <div
                            key={rally.id}
                            className={`rally-card ${rally.type === 'large' ? 'card-vertical' : 'card-horizontal'}`}
                        >
                            <div className="card-image-wrapper">
                                <span className="date-tag">{rally.date}</span>
                                <img src={rally.image} alt={rally.title} className="rally-img" />
                            </div>
                            <div className="card-content">
                                <h2 className="card-title">{rally.title}</h2>
                                <p className="card-description">{rally.description}</p>
                                <AnimatedButton text='View Details' />
                                {/* <a href="#" className="view-details">
                                    View Details 
                                    <span className="arrow-icon">→</span>
                                </a> */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Partners />
        </div>
    );
};

export default PreviousRallies;
