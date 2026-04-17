
import React, { useState, useEffect } from "react";

const CountdownBox = ({ value, label }) => (
  <div className="bg-white rounded-lg shadow-xl p-4 md:p-6 min-w-[100px] md:min-w-[140px] flex flex-col items-center">
    <span className="text-4xl md:text-6xl font-germania text-black leading-none">
      {String(value).padStart(2, '0')}
    </span>
    <span className="text-[10px] md:text-[14px] font-sans font-bold text-gray-400 mt-2 tracking-widest uppercase">
      {label}
    </span>
  </div>
);

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 43,
    minutes: 33,
    seconds: 0
  });

  useEffect(() => {
    // Setting target date to 30 days from now for demonstration
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="relative py-12 md:py-24 overflow-hidden bg-white"
      style={{
        backgroundImage: "url('/assets/images/dessert_2.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center 80%',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="container mx-auto relative z-10 px-4">
        {/* Timer Section */}
        <div className="grid grid-cols-2 md:flex md:justify-center gap-4 md:gap-8 mb-12 lg:mb-20">
          <CountdownBox value={timeLeft.days} label="Days" />
          <CountdownBox value={timeLeft.hours} label="Hours" />
          <CountdownBox value={timeLeft.minutes} label="Mins" />
          <CountdownBox value={timeLeft.seconds} label="Seconds" />
        </div>

        {/* Content Section */}
        <div className="text-center max-w-4xl mx-auto space-y-6 md:space-y-10">
          <h2 className="heading text-black leading-tight drop-shadow-sm">
            Gear Up For Cholistan Challenge
          </h2>
          <div className="space-y-4 md:space-y-6">
            <p className="para text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Cholistan Desert Rally started back in 2005 and has since grown in leaps and bounds.
              The upcoming rally will mark this event’s 21st edition which reflects its
              ever-increasing popularity.
            </p>
            <p className="para text-gray-700 max-w-3xl mx-auto leading-relaxed hidden md:block">
              The event portrays a positive and softer image
              of Pakistan abroad and bring to highlight the real beauty of south Punjab's
              landscape. Besides promoting tourism, such events also enhance the livelihood
              of the locals.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Jeep Image */}
      <div className="absolute -right-4 md:right-0 bottom-0 md:bottom-10 lg:bottom-16 w-[50%] md:w-[35%] lg:w-96 z-20 pointer-events-none group">
        <img
          src="/assets/images/jeep_2.png"
          alt="Jeep Rally"
          className="w-full h-auto drop-shadow-2xl translate-x-12 md:translate-x-0 transition-transform duration-700 group-hover:-translate-x-4"
        />
      </div>
    </section>
  );
};

export default Countdown;
