import React from 'react'
import axios from 'axios'; 
import { signOut, useSession } from "next-auth/react";
function GetFav() {
    const { data: session, status } = useSession();
async function getFav(){
 const res=await   axios.put(`${process.env.NEXT_URL}/api/favorite`,{
email:session?.user?.email,
    })}

 const res=   getFav()
console.log(res);
  return (
    <div>
      
    </div>
  )
}

export default GetFav
