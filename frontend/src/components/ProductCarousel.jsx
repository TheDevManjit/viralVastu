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
    <Carousel className="w-full max-w-xs group">
      <CarouselContent>

        {productImg?.map((img, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <img
                    src={img.url}
                    alt={`Product image ${index + 1}`}
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}

      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
