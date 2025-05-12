// app/api/cloudinary-images/route.ts
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function GET() {
  try {
    const result = await cloudinary.api.resources({
        type: 'upload',
        resource_type: 'image',
       
        max_results: 500,
      });
      
console.log(result);
    const urls = result.resources.map((img: any) => img.secure_url);
    return NextResponse.json({ urls });
  } catch (error: any) {
    console.error('Cloudinary fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}
