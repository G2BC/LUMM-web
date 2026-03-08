import React, { useState, useEffect, useCallback } from "react";
import { type EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PropType = {
  slides: { photo?: string; attribution?: string }[];
  options?: EmblaOptionsType;
};

const Slide: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi?.scrollTo(emblaMainApi.selectedScrollSnap());
    setCanScrollPrev(emblaMainApi.canScrollPrev());
    setCanScrollNext(emblaMainApi.canScrollNext());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  const scrollPrev = useCallback(() => {
    if (!emblaMainApi) return;
    emblaMainApi.scrollPrev();
  }, [emblaMainApi]);

  const scrollNext = useCallback(() => {
    if (!emblaMainApi) return;
    emblaMainApi.scrollNext();
  }, [emblaMainApi]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();

    emblaMainApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  return (
    <div className="embla h-full">
      <div className="relative">
        <div className="embla__viewport" ref={emblaMainRef}>
          <div className="embla__container">
            {slides.map((slide, index) => {
              if (!slide.photo) return null;
              return (
                <div className="embla__slide" key={index}>
                  <div className="embla__slide__number relative">
                    <img
                      className="h-full w-full object-contain object-center"
                      src={slide.photo}
                      alt=""
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                      fetchPriority={index === 0 ? "high" : "auto"}
                    />
                    {!!slide.attribution && (
                      <span className="absolute bottom-2 right-2 ml-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
                        {slide.attribution}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          aria-label="Imagem anterior"
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/50 text-white transition hover:bg-black/70 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          aria-label="Próxima imagem"
          onClick={scrollNext}
          disabled={!canScrollNext}
          className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/50 text-white transition hover:bg-black/70 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="embla-thumbs">
        <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
          <div className="embla-thumbs__container">
            {slides.map(({ photo }, index) => {
              if (!photo) return null;
              return (
                <div
                  key={index}
                  className={"embla-thumbs__slide".concat(
                    index === selectedIndex ? " embla-thumbs__slide--selected" : ""
                  )}
                >
                  <button
                    onClick={() => onThumbClick(index)}
                    type="button"
                    className="embla-thumbs__slide__number overflow-hidden"
                  >
                    <img
                      src={photo}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-[80px] w-[80px] object-cover object-center"
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slide;
