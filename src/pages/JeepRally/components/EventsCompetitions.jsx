import React from "react";
import Button from "../../../components/common/Button";

const EventRow = ({ date, time, title, description, image, location }) => (
  <div className="py-8 md:py-12 border-t border-gray-200 grid grid-cols-1 md:grid-cols-[1.5fr_1fr_3fr_1fr] items-center gap-8 md:gap-12 group hover:bg-black/5 transition-colors px-4">
    {/* Date & Time */}
    <div className="space-y-2">
      <h4 className="text-2xl md:text-3xl font-gilda text-black">{date}</h4>
      <p className="para text-gray-500 font-medium">{time}</p>
    </div>

    {/* Small Image */}
    <div className="flex justify-center md:justify-start">
      <div className="w-24 h-24 md:w-32 md:h-32 overflow-hidden rounded-md">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
    </div>

    {/* Title & Desc */}
    <div className="space-y-2 text-center md:text-left">
      <h4 className="text-2xl font-gilda text-black">{title}</h4>
      <p className="para text-gray-500 max-w-[400px]">
        {description}
      </p>
    </div>

    {/* Location */}
    <div className="text-center md:text-right">
      <span className="text-2xl md:text-3xl font-gilda text-black">{location}</span>
    </div>
  </div>
);

const EventsCompetitions = () => {
  const events = [
    {
      date: "12-14 June 2026",
      time: "10:00 Pm - 07:00 Pm",
      title: "Inaugural ceremony",
      description: "Angles, quam un skeptic Cambridge amico dit me que Occidental es. Li Europan lingues",
      image: "/assets/images/jeep_5_1.jpg",
      location: "Bhawalpur"
    },
    {
      date: "12-14 June 2026",
      time: "10:00 Pm - 07:00 Pm",
      title: "1st Round Prepared",
      description: "Angles, quam un skeptic Cambridge amico dit me que Occidental es. Li Europan lingues",
      image: "/assets/images/jeep_5_2.jpg",
      location: "Bhawalpur"
    },
    {
      date: "12-14 June 2026",
      time: "10:00 Pm - 07:00 Pm",
      title: "Qualifying Round",
      description: "Angles, quam un skeptic Cambridge amico dit me que Occidental es. Li Europan lingues",
      image: "/assets/images/jeep_5_3.jpg",
      location: "Bhawalpur"
    }
  ];

  return (
    <section className="py-24 bg-[#F2F7F2]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-[42px] font-gilda text-black">Events & Competations</h2>
        </div>

        {/* Events List */}
        <div className="border-b border-gray-200 mb-12">
          {events.map((event, index) => (
            <EventRow key={index} {...event} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center md:justify-end">
          <Button
            variant="solid-green"
            className="!px-6 !py-2 !rounded-full !bg-brand-green hover:!bg-brand-green-hover text-white  transition-all"
          >
            Load More Events
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsCompetitions;
