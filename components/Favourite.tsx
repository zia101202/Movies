import React from 'react';

import { Heart } from 'lucide-react';

import { signOut, useSession } from "next-auth/react";
interface NameIconButtonProps {
  name: string;
}

const Favourite: React.FC<NameIconButtonProps> = ({ name }) => {
    const { data: session, status } = useSession();
  const handleClick = async () => {
    try {
      const response = await fetch('/api/favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email: session?.user?.email }), 
      });
      const data = await response.json();
      console.log(data);
      
    } catch (error) {
      console.error('Request failed', error);
      alert('Request failed');
    }
  };

  return (
    <div className="flex items-center gap-2 cursor-pointer" onClick={handleClick}>
      <Heart size={24} className="text-blue-600 hover:text-blue-800 transition-all" />
      <span className="text-lg font-medium text-white">Add favourite</span>
    </div>
  );
};

export default Favourite;
