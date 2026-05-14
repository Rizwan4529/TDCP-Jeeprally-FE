import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen bg-white grid place-items-center">
      <div className="flex flex-col items-center gap-5">
        <div className="relative h-16 w-16">
          <span className="absolute inset-0 rounded-full border-4 border-primary/15" />
          <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-secondary animate-spin" />
        </div>
        <div className="space-y-1 text-center">
          <p className="font-gilda text-[26px] text-black">Loading content</p>
          <p className="text-sm text-gray-500">Please wait a moment...</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
