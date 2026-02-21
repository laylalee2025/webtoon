import WebtoonList from '@/components/WebtoonList';
import { Webtoon } from '@/components/WebtoonCard';
import Chatbot from '@/components/Chatbot';
import webtoonsData from '@/data/webtoons.json';

export default async function Home() {
  const webtoons: Webtoon[] = webtoonsData as Webtoon[];

  return (
    <main className="min-h-screen relative pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 px-6 sm:px-12 lg:px-24 bg-gradient-to-b from-primary/20 to-transparent">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-primary/30 blur-[120px] rounded-full point-events-none -z-10" />

        <div className="max-w-7xl mx-auto z-10 relative text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Webtoon Finder
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Discover your next favorite story. Explore our collection of premium webtoons and let our AI Chatbot recommend the perfect match for your taste.
          </p>
        </div>
      </section>

      {/* Webtoons Grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 z-10 relative">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="w-8 h-1 bg-primary rounded-full"></span>
            Popular Webtoons
          </h2>
          <span className="text-sm font-medium text-gray-500 bg-secondary px-3 py-1 rounded-full border border-white/5">
            {webtoons.length} Titles
          </span>
        </div>

        {webtoons.length > 0 ? (
          <WebtoonList webtoons={webtoons} />
        ) : (
          <div className="py-20 text-center text-gray-500 border border-dashed border-gray-700/50 rounded-2xl">
            No webtoons found. Please check your data source.
          </div>
        )}
      </section>

      {/* Floating Chatbot */}
      <Chatbot />
    </main>
  );
}
