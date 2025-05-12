"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { signOut, useSession } from "next-auth/react";
import { Settings, Bell, Moon, Sun, Save, ChevronRight } from "lucide-react";

const UserPreferences = () => {
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [preferredGenres, setPreferredGenres] = useState<string[]>([]);
  const [themeMode, setThemeMode] = useState('light');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const genres = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", "Documentary"];

  const toggleGenre = (genre: string) => {
    if (preferredGenres.includes(genre)) {
      setPreferredGenres(preferredGenres.filter(g => g !== genre));
    } else {
      setPreferredGenres([...preferredGenres, genre]);
    }
  };

  const savePreferences = async () => {
    try {
      const res = await fetch('/api/prefrence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session?.user?.email,
          preferredLanguage,
          preferredGenres,
          themeMode,
          notificationsEnabled,
        }),
      });

      
      const data = await res.json();
      if (res.ok) {
        toast.success('Preferences saved successfully!');
        setIsOpen(false);
      } else throw new Error(data.error || 'Failed to save preferences');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences. Please try again.');
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className=" bg-gray-800 text-white py-2 px-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
      >
        <Settings size={20} />
        Settings
      </button>

      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, x: 100 }} 
          animate={{ opacity: 1, x: 0 }} 
          exit={{ opacity: 0, x: 100 }} 
          transition={{ duration: 0.3 }}
          className="fixed top-20 right-4 w-80 p-6 rounded-2xl shadow-lg bg-gray-900 text-white z-50 border border-gray-700"
        >
          <h2 className="text-2xl font-bold mb-4">User Preferences</h2>

          <select 
            value={preferredLanguage} 
            onChange={(e) => setPreferredLanguage(e.target.value)} 
            className="w-full p-2 mb-4 rounded border bg-gray-800 text-white border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
          </select>

          <div className="mb-4">
            <label className="block mb-2">Preferred Genres</label>
            <div className="grid grid-cols-2 gap-2">
              {genres.map((genre) => (
                <label key={genre} className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={preferredGenres.includes(genre)} 
                    onChange={() => toggleGenre(genre)} 
                    className="mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {genre}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Notifications</label>
            <label className="flex items-center">
              <Bell size={20} className="mr-2" />
              <input 
                type="checkbox" 
                checked={notificationsEnabled} 
                onChange={(e) => setNotificationsEnabled(e.target.checked)} 
                className="w-5 h-5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </label>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Theme Mode</label>
            <label className="flex items-center">
              <Sun size={20} className="mr-2" />
              <input 
                type="checkbox" 
                checked={themeMode === 'dark'} 
                onChange={(e) => setThemeMode(e.target.checked ? 'dark' : 'light')} 
                className="w-5 h-5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <Moon size={20} className="ml-2" />
            </label>
          </div>

          <button 
            onClick={savePreferences} 
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Save Preferences
          </button>
        </motion.div>
      )}
    </>
  );
};

export default UserPreferences;
