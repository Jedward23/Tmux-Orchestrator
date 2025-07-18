import { JSX } from "preact";
import Card from "./Card.tsx";

interface ArticleProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  gradient: string;
  readTime: string;
}

export default function ArticleCard(
  { title, excerpt, date, category, gradient, readTime }: ArticleProps,
): JSX.Element {
  return (
    <Card>
      <div
        class={`w-full h-48 bg-gradient-to-r ${gradient} rounded-lg mb-4 flex items-center justify-center`}
      >
        <span class="text-5xl text-white opacity-80">📰</span>
      </div>

      <div class="flex items-center justify-between mb-3">
        <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
          {category}
        </span>
        <span class="text-xs text-gray-500">{readTime}</span>
      </div>

      <div class="text-sm text-gray-500 mb-2">{date}</div>

      <h3 class="font-bold text-lg mb-3 text-gray-800 line-clamp-2">{title}</h3>

      <p class="text-gray-600 text-sm mb-4 line-clamp-3">{excerpt}</p>

      <a
        href="#"
        class="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
      >
        Leer más
        <span class="ml-1">→</span>
      </a>
    </Card>
  );
}
