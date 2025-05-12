import { NextResponse } from 'next/server';
import UserSearch from '@/models/search';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
export async function POST(request: Request) {
    try {
      await connectToDatabase();
      const { email,data } = await request.json();
    //   const data = await request.json();
    //   console.log(data.data.genre.map(genre => genre.name));
    
      if (!email || !data) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
      }
  console.log(email, data);
      const user =  await  UserSearch.findOne({email})
      console.log(user);
      if(user){
        user. watchHistory.push(data)
        await user.save();
        return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
      }
               
              
      const newUser = new UserSearch({ email});
      await newUser.save();
      console.log(newUser);
      newUser.watchHistory.push(data)
     
      return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }