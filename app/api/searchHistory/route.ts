import { NextResponse } from 'next/server';
import UserSearch from '@/models/search';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
export async function POST(request: Request) {
    try {
      await connectToDatabase();
      const { email, searchHistory } = await request.json();
    //   const data = await request.json();
    //   console.log(data.data.genre.map(genre => genre.name));

      if (!email || !searchHistory) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
      }
  console.log(email, searchHistory);
      const user =  await  UserSearch.findOne({email})
      console.log(user);
      if(user){
        user.searchHistory.push(searchHistory)
        await user.save();
        return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
      }
               
              
      const newUser = new UserSearch({ email});
      newUser.searchHistory.push(searchHistory)
      await newUser.save();
      return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }



  export async function PUT(request: Request) {
    try {
      await connectToDatabase();
      const { email } = await request.json();
 console.log(email);
      const user =  await  UserSearch.find({email})
   console.log(user);
      return NextResponse.json({ userSearch: user }, { status: 201 }, );
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }