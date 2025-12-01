import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function ProductCarousel({ productImg }) {

  return (
    <Carousel className=" group p-0 m-0 shadow-none " 
    
    opts={{
      loop:true
    }}

    >
      <CarouselContent>

        {productImg?.map((img, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="  p-0! m-0! border-none! shadow-none ">
                <CardContent className="flex aspect-square items-center justify-center 100 p-0! m-0! overflow-hidden">
                  <img
                    src={img.url}
                    alt={`Product image ${index + 1}`}
                    className="object-cover  transition-transform duration-500 "
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}

      </CarouselContent>

      
    </Carousel>
  );
}
