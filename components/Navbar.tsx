'use client';
import React, { useEffect } from 'react';
import UserPreferences from "@/components/userPrefrence";
import Recommended from "@/components/Recommended";
import FuseSearch from "@/components/FuseSearch";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p className="text-gray-400 text-center bg-gray-900 p-4 rounded-lg">Loading...</p>;
  }
  const handleClick=()=>{
    router.replace("/myMovies")
  }
 const  handleClickHome=()=>{
    router.replace("/")
  }
  console.log(session);
 const handleClickRec=()=>{
    router.replace("/recommended")
  }
  return (
    <div className="bg-gray-900 flex items-center py-[30px] gap-6 px-8">
         <img onClick={handleClickHome} className='w-[50px] cursor-pointer  h-[50px]' src="/images/logo.png" alt="" />
         <p className="text-white">Welcome, {session?.user?.name}</p>
         <p onClick={handleClick} className='text-white cursor-pointer bg-gray-800 p-[10px] rounded-2xl'>My Movies</p>
         <p onClick={handleClickRec} className='text-white cursor-pointer bg-gray-800 p-[10px] rounded-2xl'>Recommeded</p>
      <FuseSearch />
      
      
     
      <div className="flex items-center gap-2">
       
        <button
          onClick={() => signOut()}
          className="flex items-center text-white hover:text-gray-300 transition-colors cursor-pointer"
        >
          <LogOut size={20} className="mr-1" />
          Logout
        </button>
      </div>
      <UserPreferences />
    </div>
  );
}
