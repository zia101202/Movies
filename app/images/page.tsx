// app/gallery/page.tsx or any component
'use client';

import { useEffect, useState } from 'react';

export default function GalleryPage() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/cloudinary')
      .then(res => res.json())
      .then(data => setImages(data.urls || []))
      .catch(err => console.error(err));
  }, []);
console.log(images);
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {images.map((url, idx) => (
        <img key={idx} src={url} alt={`Image ${idx}`} className="rounded shadow" />
      ))}
    </div>
  );
}
