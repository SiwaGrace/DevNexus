"use client";
import Image from "next/image";
import React from "react";

const Explorebtn = () => {
  const handleExploreClick = () => {
    // Logic to navigate to the explore page or section
    console.log("Explore button clicked");
  };
  return (
    <button
      type="button"
      id="explore-btn"
      onClick={handleExploreClick}
      className="mt-7 mx-auto"
    >
      <a href="#event">
        Explore Events
        <Image
          src="/icons/arrow-down.svg"
          alt="arrow-down"
          width={24}
          height={24}
        />
      </a>
    </button>
  );
};

export default Explorebtn;
