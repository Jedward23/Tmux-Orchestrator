import { JSX } from "preact";
import Card from "./Card.tsx";

interface TestimonialProps {
  text: string;
  author: string;
  company: string;
  avatar: string;
  rating: number;
}

export default function TestimonialCard(
  { text, author, company, avatar, rating }: TestimonialProps,
): JSX.Element {
  return (
    <Card className="p-8">
      {/* Rating Stars */}
      <div class="flex mb-4">
        {Array.from(
          { length: rating },
          (_, i) => <span key={i} class="text-yellow-400 text-xl">★</span>,
        )}
      </div>

      {/* Quote */}
      <p class="text-gray-700 mb-6 italic leading-relaxed">
        "{text}"
      </p>

      {/* Author */}
      <div class="flex items-center">
        <div
          class={`w-12 h-12 ${avatar} rounded-full mr-4 flex items-center justify-center text-white font-bold`}
        >
          {author.charAt(0)}
        </div>
        <div>
          <h4 class="font-semibold text-gray-800">{author}</h4>
          <p class="text-sm text-gray-500">{company}</p>
        </div>
      </div>
    </Card>
  );
}
