import React, { useContext } from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";

import { ExerciseCard } from ".";
import { BodyPart } from ".";
import RightArrowIcon from "../assets/icons/right-arrow.png";
import LeftArrowIcon from "../assets/icons/left-arrow.png";

const LeftArrow = () => {
  const { scrollPrev } = useContext(VisibilityContext);

  return (
    <button
      onClick={() => scrollPrev()}
      className="absolute bottom-[-20px] right-32 flex items-center justify-center text-amber-700 text-2xl rounded-lg p-2 bg-white/55 border border-white/60 hover:bg-white/70 transition-all duration-300 hover:scale-125 z-10 backdrop-blur"
    >
      <img src={LeftArrowIcon} alt="left-arrow" className="w-6 h-6" />
    </button>
  );
};

const RightArrow = () => {
  const { scrollNext } = useContext(VisibilityContext);

  return (
    <button
      onClick={() => scrollNext()}
      className="absolute bottom-[-20px] right-20 flex items-center justify-center text-amber-700 text-2xl rounded-lg p-2 bg-white/55 border border-white/60 hover:bg-white/70 transition-all duration-300 hover:scale-125 z-10 backdrop-blur"
    >
      <img src={RightArrowIcon} alt="right-arrow" className="w-6 h-6" />
    </button>
  );
};

const HorizontalScrollbar = ({
  data,
  bodyParts,
  setBodyPart,
  bodyPart,
  isBodyParts,
}) => (
  <div className="relative">
    <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
      {data.map((item) => (
        <div
          key={item.id || item}
          itemId={item.id || item}
          title={item.id || item}
          className="mx-10"
        >
          {isBodyParts ? (
            <BodyPart item={item} setBodyPart={setBodyPart} bodyPart={bodyPart} />
          ) : (
            <ExerciseCard exercise={item} />
          )}
        </div>
      ))}
    </ScrollMenu>
  </div>
);

export default HorizontalScrollbar;
