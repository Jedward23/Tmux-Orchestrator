// Gallery data structure for photos and videos
// This file will be used to manage all gallery content with descriptions

export interface MediaItem {
  id: string;
  title: string;
  description: string;
  type: "photo" | "video";
  filename: string;
  category: string;
  tags: string[];
  date: string;
  featured: boolean;
  gradient: string;
}

// Photo data - Add new photos here
export const photoData: MediaItem[] = [
  {
    id: "photo-1",
    title: "Sesión Fotográfica Corporativa",
    description: "Momentos capturados durante colaboraciones empresariales importantes",
    type: "photo",
    filename: "corporate-session-01.jpg", // File should be in /static/gallery/photos/
    category: "Corporativo",
    tags: ["empresa", "profesional", "colaboración"],
    date: "2024-01-15",
    featured: true,
    gradient: "from-blue-400 to-blue-600"
  },
  {
    id: "photo-2", 
    title: "Behind the Scenes - Desarrollo",
    description: "El proceso creativo detrás de mis proyectos más importantes",
    type: "photo",
    filename: "behind-scenes-dev.jpg",
    category: "Desarrollo",
    tags: ["desarrollo", "proceso", "creatividad"],
    date: "2024-01-10",
    featured: false,
    gradient: "from-purple-400 to-pink-500"
  }
  // Add more photos here when uploading new content
];

// Video data - Add new videos here
export const videoData: MediaItem[] = [
  {
    id: "video-1",
    title: "Video Promocional 2024",
    description: "Mi último trabajo creativo que muestra la evolución de mis proyectos",
    type: "video",
    filename: "promo-2024.mp4", // File should be in /static/gallery/videos/
    category: "Promocional",
    tags: ["promoción", "proyectos", "creatividad"],
    date: "2024-01-20",
    featured: true,
    gradient: "from-green-400 to-teal-500"
  },
  {
    id: "video-2",
    title: "Testimoniales en Video",
    description: "Clientes compartiendo sus experiencias trabajando conmigo",
    type: "video", 
    filename: "testimonials-compilation.mp4",
    category: "Testimonios",
    tags: ["testimonios", "clientes", "experiencias"],
    date: "2024-01-12",
    featured: false,
    gradient: "from-orange-400 to-red-500"
  }
  // Add more videos here when uploading new content
];

// Combined gallery data
export const galleryData: MediaItem[] = [...photoData, ...videoData];

// Helper functions
export const getFeaturedItems = (): MediaItem[] => {
  return galleryData.filter(item => item.featured);
};

export const getItemsByCategory = (category: string): MediaItem[] => {
  return galleryData.filter(item => item.category === category);
};

export const getItemsByType = (type: "photo" | "video"): MediaItem[] => {
  return galleryData.filter(item => item.type === type);
};

export const getItemById = (id: string): MediaItem | undefined => {
  return galleryData.find(item => item.id === id);
};