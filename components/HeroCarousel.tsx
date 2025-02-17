"use client";

import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";

const heroImages = [
  { imgUrl: "assets/images/hero-1.svg", alt: "smartwatch" },
  { imgUrl: "assets/images/hero-2.svg", alt: "bag" },
  { imgUrl: "assets/images/hero-3.svg", alt: "lamp" },
  { imgUrl: "assets/images/hero-4.svg", alt: "air fryer" },
  { imgUrl: "assets/images/hero-5.svg", alt: "chair" },
];

const HeroCarousel = () => {
  return (
    <div className="hero-carousel">
      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        interval={2000}
        showArrows={false}
        showStatus={false}
      >
        {heroImages.map((image) => (
          <Image
            key={image.alt}
            src={image.imgUrl}
            alt={image.alt}
            width={488}
            height={488}
            className="object-contain"
          />
        ))}
      </Carousel>
    </div>
  );
};

export default HeroCarousel;
