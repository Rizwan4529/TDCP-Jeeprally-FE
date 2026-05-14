import { useState } from 'react';
import { useParams } from 'react-router';

const PlayerProfile = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('driver'); // 'driver' or 'navigator'
    const [expandedTeamStanding, setExpandedTeamStanding] = useState(0); // Index of expanded row
    const [expandedOtherRaces, setExpandedOtherRaces] = useState(null); // Index of expanded row

    // Dummy data for the profile
    const player = {
        id: 1,
        number: '#22',
        name: 'Hassan Malik',
        team: 'Hero Moto Sport Rally Team',
        image: '/assets/images/ppm.png', // Main image
        driverImage: '/assets/images/pp1.png',
        navigatorImage: '/assets/images/pp2.png',
        details: {
            Age: '26',
            Occupation: 'Driver',
            'Date of Birth': 'Born on 30/08/1994',
            Location: 'Lagos, Nigeria',
            Team: 'red bull ktm racing'
        },
        teamStanding: [
            { year: '2025', stage: '1 stage', rank: '7', role: 'Driver', cat: 'Bike', team: 'RED BULL GASGAS FACTORY RACING' },
            { year: '2024', stage: '1 stage', rank: '7' },
            { year: '2023', stage: '1 stage', rank: '7' },
        ],
        otherRaces: [
            { year: '2025', stage: '1 stage', rank: '7' },
            { year: '2024', stage: '1 stage', rank: '7' },
            { year: '2023', stage: '1 stage', rank: '7' },
            { year: '2024', stage: '1 stage', rank: '7' },
        ]
    };

    return (
        <div className="mt-[100px] player-profile-page min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative h-[400px] md:h-[500px] w-full">
                {/* Checkered Background overlay */}
                <div
                    className="absolute inset-0 opacity-100"
                    style={{
                        backgroundImage: 'url("/assets/images/blocks.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                ></div>
                {/* Grey Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-200/50 to-white/10"></div>

                {/* Player Image center */}
                <div className="absolute inset-0 flex items-end justify-center">
                    <div className="relative h-full flex items-end">
                        <img
                            src={player.image}
                            alt={player.name}
                            className="h-[80%] md:h-[90%] w-auto object-contain z-10"
                        />
                    </div>
                </div>

                {/* Profile Box overlap */}
                <div className=" absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
                    <div className="bg-white px-10 py-8 rounded-sm shadow-xl text-center min-w-[300px] border border-gray-100 flex flex-col items-center justify-center gap-2">
                        <h2 className="text-[32px] md:text-[48px]  text-gray-900 leading-none">
                            {player.number}
                        </h2>
                        <div className=" text-gray-600 font-medium text-sm md:text-lg leading-tight uppercase tracking-wide">
                            {player.team}
                        </div>
                    </div>
                </div>
            </section>

            {/* Spacing for overlap box */}
            <div className="h-32 md:h-40"></div>

            {/* Main Content */}
            <section className="container mx-auto px-4 pb-20">

                {/* Driver/Navigator Toggle */}
                <div className="flex justify-center gap-6 md:gap-10 mb-16 overflow-x-auto no-scrollbar max-w-full">
                    {/* Driver Tab */}
                    <div className="relative group cursor-pointer" onClick={() => setActiveTab('driver')}>
                        <div className={`w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-sm overflow-hidden border-4 transition-all duration-300 ${activeTab === 'driver' ? 'border-primary' : 'border-transparent opacity-60'}`}>
                            <img src={player.driverImage} alt="Driver" className="w-full h-full object-cover" />
                        </div>
                        <div className={`mt-[-20px] mx-auto w-fit relative z-10 px-6 py-2 rounded-sm shadow-lg transition-all duration-300 ${activeTab === 'driver' ? 'bg-primary text-white' : 'bg-[#333] text-white'}`}>
                            <span className="font-gilda text-lg">Driver</span>
                            {activeTab === 'driver' && (
                                <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-primary"></div>
                            )}
                        </div>
                    </div>

                    {/* Navigator Tab */}
                    <div className="relative group cursor-pointer" onClick={() => setActiveTab('navigator')}>
                        <div className={`w-[140px] h-[140px] md:w-[220px] md:h-[220px] rounded-sm overflow-hidden border-4 transition-all duration-300 ${activeTab === 'navigator' ? 'border-primary' : 'border-transparent opacity-60'}`}>
                            <img src={player.navigatorImage} alt="Navigator" className="w-full h-full object-cover" />
                        </div>
                        <div className={`mt-[-20px] mx-auto w-fit relative z-10 px-6 py-2 rounded-sm shadow-lg transition-all duration-300 ${activeTab === 'navigator' ? 'bg-primary text-white' : 'bg-[#333] text-white'}`}>
                            <span className="font-gilda text-lg">Navigator</span>
                            {activeTab === 'navigator' && (
                                <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-primary"></div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Info Card */}
                <div className="max-w-3xl mx-auto bg-white rounded-sm shadow-2xl p-8 mb-20 border border-gray-50">
                    <h2 className="text-[32px] md:text-[42px] font-gilda text-primary mb-8 border-b border-gray-100 pb-4">
                        {player.name}
                    </h2>
                    <div className="space-y-4">
                        {Object.entries(player.details).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                <span className="font-bold text-primary uppercase text-sm tracking-wider w-1/3">
                                    {key}
                                </span>
                                <span className="text-gray-600 text-right w-2/3">
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                    {/* Team Standing */}
                    <div>
                        <div className="bg-primary text-white px-6 py-4 rounded-t-sm">
                            <h3 className="font-gilda text-xl">Team Standing</h3>
                        </div>
                        <div className="bg-white border-x border-b border-gray-100 rounded-b-sm overflow-hidden shadow-sm">
                            {player.teamStanding.map((item, idx) => (
                                <div key={idx} className="border-b border-gray-100 last:border-0">
                                    <div
                                        className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => setExpandedTeamStanding(expandedTeamStanding === idx ? null : idx)}
                                    >
                                        <span className="font-bold text-xl italic">{item.year}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="bg-gray-100 px-3 py-1 rounded text-xs text-gray-600 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                                {item.stage}
                                            </span>
                                            <span className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-sm font-bold">
                                                {item.rank}
                                            </span>
                                            <svg
                                                className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${expandedTeamStanding === idx ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    {expandedTeamStanding === idx && (
                                        <div className="p-4 bg-gray-50/50 flex flex-wrap gap-2 text-[10px] uppercase font-bold tracking-tighter transition-all duration-300 animate-in fade-in slide-in-from-top-1">
                                            <span className="px-3 py-1 border border-gray-200 rounded-full bg-white flex items-center gap-1 italic">
                                                Role : <span className="text-gray-500">{item.role || 'Driver'}</span>
                                            </span>
                                            <span className="px-3 py-1 border border-gray-200 rounded-full bg-white flex items-center gap-1 italic">
                                                Cat : <span className="text-gray-500">{item.cat || 'T1'}</span>
                                            </span>
                                            <span className="px-3 py-1 border border-gray-200 rounded-full bg-white flex items-center gap-1 italic">
                                                Team : <span className="text-gray-500">{item.team || 'Privateer'}</span>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Other Races */}
                    <div>
                        <div className="bg-[#333] text-white px-6 py-4 rounded-t-sm">
                            <h3 className="font-gilda text-xl">Other Races</h3>
                        </div>
                        <div className="bg-white border-x border-b border-gray-100 rounded-b-sm overflow-hidden shadow-sm">
                            {player.otherRaces.map((item, idx) => (
                                <div key={idx} className="border-b border-gray-100 last:border-0">
                                    <div
                                        className={`p-4 flex items-center justify-between transition-colors cursor-pointer ${idx % 2 !== 0 ? 'bg-gray-100/50' : 'bg-white'} hover:bg-gray-50`}
                                        onClick={() => setExpandedOtherRaces(expandedOtherRaces === idx ? null : idx)}
                                    >
                                        <span className="font-bold text-xl italic">{item.year}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="bg-gray-100 px-3 py-1 rounded text-xs text-gray-600 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                                {item.stage}
                                            </span>
                                            <span className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-sm font-bold bg-white">
                                                {item.rank}
                                            </span>
                                            <svg
                                                className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${expandedOtherRaces === idx ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    {expandedOtherRaces === idx && (
                                        <div className="p-4 bg-gray-50/50 flex flex-wrap gap-2 text-[10px] uppercase font-bold tracking-tighter transition-all duration-300 animate-in fade-in slide-in-from-top-1">
                                            <span className="px-3 py-1 border border-gray-200 rounded-full bg-white flex items-center gap-1 italic">
                                                Event : <span className="text-gray-500">Rally Championship</span>
                                            </span>
                                            <span className="px-3 py-1 border border-gray-200 rounded-full bg-white flex items-center gap-1 italic">
                                                Vehicle : <span className="text-gray-500">4x4 Modified</span>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
};

export default PlayerProfile;
