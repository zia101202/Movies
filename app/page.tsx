"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PopularMovies from "@/components/popular";
import Tv from "@/components/Tv";
import Trending from "@/components/Trending";
import Search from "@/components/search";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
export default function Home() {
  const { data: session, status } = useSession();
  
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }
 console.log(session);

  if (session) {
    return (
      <>
      <div className="bg-gray-900">
      <Hero/>
        <PopularMovies />
        <Trending />
        <Tv/>
        </div>
      </>
    );
  }

  return null;
}
