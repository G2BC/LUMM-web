import React from "react";

type PropType = {
  selected: boolean;
  onClick: () => void;
  photo?: string;
};

export const SlideThumb: React.FC<PropType> = (props) => {
  const { selected, onClick, photo } = props;

  return (
    <div className={"embla-thumbs__slide".concat(selected ? " embla-thumbs__slide--selected" : "")}>
      <button
        onClick={onClick}
        type="button"
        className="embla-thumbs__slide__number overflow-hidden"
      >
        <img src={photo} className="h-[80px] w-[80px] object-cover object-center" />
      </button>
    </div>
  );
};
