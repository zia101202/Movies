'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

interface TVShow {
  id: number;
  name: string;
  overview: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
}

const Hero = () => {
  const [shows, setShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchTopRatedShows = async () => {
      try {
        const response = await axios.get("https://api.themoviedb.org/3/tv/top_rated", {
          params: {
            api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
            language: "en-US",
            page: 1,
          },
        });
        setShows(response.data.results);
      } catch (err) {
        setError("Failed to load top-rated TV shows. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedShows();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleShowClick = (id: number) => {
    router.push(`/tv/${id}`);
  };

  return (
    <>
   

      <SwiperComponent
        modules={[Pagination, Autoplay]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        loop={true}
        spaceBetween={20}
        slidesPerView={4}
        breakpoints={{
          1024: {
            slidesPerView: 1,
            spaceBetween: 30,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          480: {
            slidesPerView: 1,
            spaceBetween: 15,
          },
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
        }}
        className="w-[95%] mx-auto rounded-2xl overflow-hidden"
      >
        {shows.map((show) => (
          <SwiperSlide key={show.id}>
            <div
              className="relative flex flex-col items-center cursor-pointer"
              onClick={() => handleShowClick(show.id)}
            >
              <div
                className="w-[86%] h-[400px] bg-cover bg-center rounded-2xl shadow-lg mb-4"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/original${show.backdrop_path})`,
                }}
              />
           
            </div>
          </SwiperSlide>
        ))}
      </SwiperComponent>
    </>
  );
};

export default Hero;
