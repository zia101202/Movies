import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Movie from '@/models/movie';
import User from '@/models/user';
import mongoose from 'mongoose';
import Category from '@/models/category';  // Use the correct import here
import Test from '@/models/test';
export async function GET() {
  try {
    await connectToDatabase();
   
    const movies = await Movie.find();
    return NextResponse.json(movies);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch data', error }, { status: 500 });
  }
}
