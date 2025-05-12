import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import favourite from '@/models/favourite';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { email, name } = await req.json();

    // Check if the user already exists
    const existingUser = await favourite.findOne({ email });

    if (existingUser) {
     
      existingUser.name.push(name);
      await existingUser.save();
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Create a new user with the name as an array
    const newUser = await favourite.create({ email, name: [name] });
    await newUser.save();

    return NextResponse.json({ message: "Created" }, { status: 201 });
  } catch (error) {
    console.error('Error creating user preference:', error);
    return NextResponse.json({ error: 'Failed to create user preference' }, { status: 500 });
  }
}


export async function PUT(req: NextResponse) {
    try {
      await connectToDatabase();
      const { email } = await req.json();
  
      // Check if the user already exists
      const existingUser = await favourite.findOne({ email });
  
      return NextResponse.json({ user: existingUser }, { status: 201 });
    } catch (error) {
      console.error('Error creating user preference:', error);
      return NextResponse.json({ error: 'Failed to create user preference' }, { status: 500 });
    }
  }
  