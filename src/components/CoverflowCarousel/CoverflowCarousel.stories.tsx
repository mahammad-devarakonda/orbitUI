import type { Meta, StoryObj } from '@storybook/react';
import { CoverflowCarousel } from './CoverflowCarousel';
import { Button } from '../Button/Button';
import { Play, ArrowRight } from 'lucide-react';

const meta: Meta<typeof CoverflowCarousel> = {
  title: 'Components/CoverflowCarousel',
  component: CoverflowCarousel,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof CoverflowCarousel>;

const movies = [
  {
    id: 1,
    title: 'Drishyam 3',
    desc: 'Georgekutty is not just protecting his family from the world, he is protecting them from the truth, and from ...',
    bgImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80',
    tags: ['PG15', 'MAL', 'Thriller'],
  },
  {
    id: 2,
    title: 'Dune: Part Two',
    desc: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
    bgImage: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80',
    tags: ['PG13', 'ENG', 'Sci-Fi'],
  },
  {
    id: 3,
    title: 'The Dark Knight',
    desc: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
    bgImage: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&q=80',
    tags: ['PG13', 'ENG', 'Action'],
  },
  {
    id: 4,
    title: 'Oppenheimer',
    desc: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    bgImage: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80',
    tags: ['R', 'ENG', 'Drama'],
  },
  {
    id: 5,
    title: 'Interstellar',
    desc: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80',
    tags: ['PG13', 'ENG', 'Sci-Fi'],
  },
];

const MovieCard = ({ movie }: { movie: typeof movies[0] }) => {
  return (
    <div className="relative w-full h-full text-left font-sans">
      <img
        src={movie.bgImage}
        alt={movie.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/80 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 z-10 text-white">
        <div className="relative mb-2">
          {/* Overlapping subtitle text behind/above the title */}
          <div className="absolute -top-6 left-0 right-0 text-gray-400 text-xs md:text-sm tracking-widest uppercase font-semibold whitespace-nowrap z-0">
            USE HEADPHONES FOR BETTER EXPERIENCE
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight z-10 relative">{movie.title}</h2>
        </div>

        <div className="flex gap-2 my-4">
          {movie.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-md text-xs font-semibold text-gray-200">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-gray-300 text-sm md:text-base max-w-xl leading-relaxed mb-8">
          {movie.desc}
        </p>

        <div className="flex items-center gap-4">
          <Button
            variant="primary"
            className="bg-[#00d2ff] hover:bg-[#00b0d6] text-black font-bold rounded-full px-8"
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Book now
          </Button>
          <Button
            variant="outline"
            className="border-gray-500 text-white  rounded-full px-8"
            rightIcon={<Play className="w-5 h-5" />}
          >
            Watch trailer
          </Button>
        </div>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center p-4">
      <CoverflowCarousel
        items={movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      />
    </div>
  ),
};

export const AutoPlay: Story = {
  render: () => (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center p-4">
      <CoverflowCarousel
        autoPlay
        autoPlayInterval={2000}
        items={movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      />
    </div>
  ),
};
