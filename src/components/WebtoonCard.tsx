import Image from 'next/image';

export interface Webtoon {
  title: string;
  author: string;
  thumbnail: string;
  link: string;
  story?: string;
  genre?: string[];
  ageRating?: string;
}

export default function WebtoonCard({ webtoon }: { webtoon: Webtoon }) {
  // Extracting just clean genres
  const displayGenres = webtoon.genre
    ? webtoon.genre.filter((g) => !g.includes('\n')).slice(0, 3)
    : [];

  return (
    <a
      href={webtoon.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-[#1a1c23] shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-800">
        <Image
          src={webtoon.thumbnail}
          alt={webtoon.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/40 to-transparent opacity-80" />
        
        <div className="absolute bottom-0 p-4 w-full">
          <h3 className="text-xl font-bold text-white drop-shadow-md truncate">
            {webtoon.title}
          </h3>
          <p className="text-sm text-gray-300 mb-2 truncate">{webtoon.author}</p>
          <div className="flex flex-wrap gap-1">
            {displayGenres.map((genre) => (
              <span
                key={genre}
                className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/90 backdrop-blur-sm"
              >
                {genre.replace('#', '')}
              </span>
            ))}
          </div>
        </div>
      </div>
    </a>
  );
}
