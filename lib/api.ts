
import axios from 'axios';

 
export const fetchData = async (endpoint:string, params={}) => {
  try {
    const response = await axios.get( `https://api.themoviedb.org/3${endpoint}`  , { params });
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};


