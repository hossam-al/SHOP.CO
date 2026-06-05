"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { A11y, Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const reviews = [
  {
    name: "Sarah M.",
    copy: "I'm blown away by the quality and style of the clothes I received from Shop.co. The range of options is impressive.",
  },
  {
    name: "Alex K.",
    copy: "Finding clothes that match my personal style used to be hard. This store makes it simple, fast, and genuinely enjoyable.",
  },
  {
    name: "James L.",
    copy: "The pieces feel premium, the fit is sharp, and checkout was smooth. I keep coming back for new arrivals.",
  },
  {
    name: "Maya R.",
    copy: "Great selection, clean product details, and the quality matched what I expected from the photos.",
  },
  {
    name: "Daniel H.",
    copy: "The styling feels modern without being overdone. My order arrived exactly as shown and fits beautifully.",
  },
];

export function CustomerReviewsSlider() {
  return (
    <div className="relative mt-8 w-full max-w-full min-w-0">
      <div className="relative w-full max-w-full min-w-0 overflow-hidden">
        <Swiper
          modules={[Navigation, A11y, Autoplay]}
          className="customer-swiper w-full max-w-full"
          spaceBetween={20}
          slidesPerView={1}
          speed={650}
          loop
          autoplay={{
            delay: 2800,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={{
            prevEl: ".customer-prev",
            nextEl: ".customer-next",
          }}
          breakpoints={{
            640: {
              slidesPerView: 1.2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          }}
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.name} className="!h-auto">
              <div className="h-full w-full">
                <article className="card customer-review-card h-full w-full p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <p className="stars">{"\u2605\u2605\u2605\u2605\u2605"}</p>
                  <h3 className="mt-3 font-bold">
                    {review.name} <span className="text-green-500">{"\u25CF"}</span>
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{review.copy}</p>
                </article>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export function CustomerReviewsControls({ locale }: { locale: Locale }) {
  const isRtl = locale === "ar";

  return (
    <div className="flex shrink-0 gap-3">
      <button
        type="button"
        className="customer-prev grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white text-black transition hover:bg-black hover:text-white"
        aria-label={isRtl ? "المراجعة السابقة" : "Previous review"}
      >
        {isRtl ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
      <button
        type="button"
        className="customer-next grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white text-black transition hover:bg-black hover:text-white"
        aria-label={isRtl ? "المراجعة التالية" : "Next review"}
      >
        {isRtl ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
    </div>
  );
}
