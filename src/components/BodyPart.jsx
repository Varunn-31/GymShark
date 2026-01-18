import React from "react";
import Icon from "../assets/icons/gym.png";

const BodyPart = ({ item, setBodyPart, bodyPart }) => {
  const isActive = bodyPart === item;
  
  return (
    <button
      type="button"
      onClick={() => {
        setBodyPart(item);
        window.scrollTo({ top: 1800, left: 100, behavior: "smooth" });
      }}
      className={`
        flex flex-col items-center justify-center
        bg-white/45 rounded-bl-2xl rounded-tr-2xl backdrop-blur-xl border border-white/60
        w-[270px] h-[280px]
        cursor-pointer gap-12
        transition-all duration-300
        hover:shadow-xl hover:scale-105
        ${isActive ? 'border-t-4 border-amber-400 shadow-lg' : 'border-t-4 border-transparent'}
      `}
    >
      <img
        src={Icon}
        alt="dumbbell"
        className="w-10 h-10"
      />
      <h3 className="text-2xl font-bold text-gray-900 capitalize">
        {item}
      </h3>
    </button>
  );
};

export default BodyPart;
