import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UserPreference } from '@/models/prefrence';
import { signOut, useSession } from "next-auth/react";
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { email, preferredLanguage, preferredGenres, themeMode, notificationsEnabled } = await req.json();

    // Find existing user preferences
    let availableUser = await UserPreference.findOne({ email });

    if (availableUser) {
      // Update existing user preferences
      availableUser.preferredLanguage = preferredLanguage;
      availableUser.preferredGenres = preferredGenres;
      availableUser.themeMode = themeMode;
      availableUser.notificationsEnabled = notificationsEnabled;
      await availableUser.save();
      return NextResponse.json(availableUser, { status: 200 });
    } else {
      // Create new user preferences if not found
      const newPreference = await UserPreference.create({
        email,
        preferredLanguage,
        preferredGenres,
        themeMode,
        notificationsEnabled,
      });
      return NextResponse.json(newPreference, { status: 201 });
    }

  } catch (error) {
    console.error("Error creating or updating user preference:", error);
    return NextResponse.json({ error: "Failed to create or update user preference" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    const preference = await UserPreference.findOne({ userId });
    return NextResponse.json(preference || { error: 'User preference not found' }, { status: preference ? 200 : 404 });
  } catch (error) {
    console.error('Error fetching user preference:', error);
    return NextResponse.json({ error: 'Failed to fetch user preference' }, { status: 500 });
  }
}
