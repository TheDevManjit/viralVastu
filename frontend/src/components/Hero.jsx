import React from "react";
import { Button } from "./ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-flip";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

const Hero = () => {

    const images = [
        "/img1.jpeg",
        "/img2.jpeg",
        "/img3.webp",

    ];

    return (
        <>

            <section className=" mt-20 bg-blue-600 md:py-12 pt-24 rounded-b-3xl shadow-blue-200/50 bg-gradient-to-br from-blue-300 via-blue-400 to-indigo-700 lg:h-[500px]">
              

                <div className=" mx-auto px-4 ">
                    <div className="grid md:grid-cols-2 gap-8 justify-around items-center">

                        <div>
                            <h1 className="text-4xl md:text-6xl font-bold mb-4">Latest Electronics at Best Prices</h1>
                            <p className="text-xl mb-6 text-blue-100">Discover cutting-edge technology with unbeatable deals on smartphones , laptops</p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button className="bg-white text-blue-600 hover:bg-gray-100">Shop Now</Button>
                                <Button variant='outline' className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent">View Deals</Button>
                            </div>


                        </div>

                        <div className="relative">
                            <Swiper
                                effect="coverflow"
                                grabCursor={true}
                                centeredSlides={true}
                                slidesPerView="auto"
                                loop={true}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                }}
                                coverflowEffect={{
                                    rotate: 50,
                                    stretch: 0,
                                    depth: 100,
                                    modifier: 1,
                                    slideShadows: true,
                                }}
                                modules={[EffectCoverflow, Autoplay]}
                                className="mySwiper w-full h-[400px]"
                            >
                                {images.map((img, i) => (
                                    <SwiperSlide key={i} className="w-[300px] h-[400px]">
                                        <img
                                            src={img}
                                            alt={`Slide ${i}`}
                                            className=" h-[400px] w-full object-cover rounded-2xl"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>

            </section>

        </>
    )

}

export default Hero