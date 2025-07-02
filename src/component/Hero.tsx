"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Mousewheel, EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    title: "Hallstatt, Austria",
    text: "Visit Hallstatt, Austria, a beautiful village by a clear lake, surrounded by tall mountains.",
    bg: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Hallstatt_-_Zentrum_.JPG",
    key: "one",
  },
  {
    title: "Paris, France",
    text: "Explore Paris, the City of Light, known for its romance and famous landmarks like the Eiffel Tower.",
    bg: "https://avianet.ge/storage/app/media/cropped-images/PARIS-0-0-0-0-1624280981.jpeg",
    key: "two",
  },
  {
    title: "Amsterdam, Netherlands",
    text: "Discover Amsterdam, a city full of canals, bicycles, and culture.",
    bg: "https://www.holland.com/upload_mm/2/4/4/80160_fullimage_rondvaartboot%20vaart%20onder%20brug%20door%20met%20mooie%20wolkenlucht%20%C2%A9%20illusion-x%20via%20pixabay_1150x663_438x353.jpg",
    key: "three",
  },
  {
    title: "Kyoto, Japan",
    text: "Travel to Kyoto, Japan, a city rich in tradition and beauty.",
    bg: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Kiyomizu-dera_in_Kyoto.jpg/800px-Kiyomizu-dera_in_Kyoto.jpg",
    key: "four",
  },
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative min-h-screen bg-[#232328] font-[Quicksand,sans-serif]">
      <Swiper
        direction="vertical"
        effect="fade"
        speed={1000}
        loop={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        mousewheel={{ forceToAxis: false, thresholdDelta: 50, sensitivity: 1 }}
        modules={[Pagination, Mousewheel, EffectFade, Autoplay]}
        className="w-full h-screen swiper-container"
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={slide.key}
            className="relative w-full h-screen swiper-slide"
          >
            <div
              className={`absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center w-[90%] max-w-2xl text-[#f2f2f2] text-center p-6 z-20 transition-opacity duration-500 ease-in-out
  ${activeIndex === index ? "opacity-100 animate-fadeIn" : "opacity-0"}`}
            >
              <h1 className="font-[Salsa,cursive] text-4xl md:text-6xl mb-5">
                {slide.title}
              </h1>
              <p className="text-lg font-medium leading-snug">{slide.text}</p>
            </div>

            <div
              className={`background absolute inset-0 w-full h-full z-10 transition-all duration-[3000ms] ease-in-out ${
                activeIndex === index
                  ? "clip-show opacity-100"
                  : "clip-hide opacity-0"
              }`}
              style={{
                backgroundImage: `url(${slide.bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* შავი overlay ფენა */}
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
          </SwiperSlide>
        ))}
        <div className="swiper-pagination" />
      </Swiper>
    </div>
  );
}
