import React from "react";
import AnimatedButton from "../../../components/common/AnimatedButton";

const ChallengeCard = ({ title, description, image, isLarge = false, className = "" }) => (
  <div className={`bg-white rounded-md p-6 shadow-lg shadow-gray-200/50 border border-gray-50 flex ${isLarge ? 'flex-col h-full' : 'flex-col sm:flex-row flex-1'} gap-6 group hover:shadow-xl transition-all duration-500 ${className}`}>
    <div className={`${isLarge ? 'w-full h-72 lg:h-[400px]' : 'w-full sm:w-52 h-48 sm:h-auto'} overflow-hidden rounded-md flex-shrink-0`}>
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
    </div>
    <div className="flex-1 flex flex-col justify-between pt-2">
      <div className="space-y-4">
        <h3 className="text-2xl font-gilda text-black">{title}</h3>
        <p className="para text-gray-500 line-clamp-3">
          {description}
        </p>
      </div>
      <div className="pt-4">
        <AnimatedButton text="View Details" />
      </div>
    </div>
  </div>
);

const SelectChallenge = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="text-[42px] font-gilda text-black">Select Your Challenge</h2>
          <p className="para text-gray-500">
            Get a closer look at the terrain, distance, and key checkpoints of the race.
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-stretch">
          {/* Column 1: Stacked Small Cards */}
          <div className="flex flex-col gap-8 h-full">
            <ChallengeCard
              title="Dirt Bike Race"
              description="Navigate extreme terrains with our professional dirt bike track designed for maximum adrenaline and speed."
              image="/assets/images/jeep_4_1.jpg"
            />
            <ChallengeCard
              title="Toronto Motorcycle"
              description="Experience the urban-to-wild transition with our unique motorcycle challenge across varied landscapes."
              image="/assets/images/jeep_4_3.jpg"
            />
          </div>

          {/* Column 2: One Large Card */}
          <div className="h-full">
            <ChallengeCard
              isLarge={true}
              title="Cholistan Desert Rally"
              description="The ultimate challenge across the vast dunes of Cholistan. A test of endurance, skill, and sheer willpower."
              image="/assets/images/jeep_4_2.png"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SelectChallenge;
