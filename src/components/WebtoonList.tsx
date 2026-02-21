import WebtoonCard, { Webtoon } from './WebtoonCard';

export default function WebtoonList({ webtoons }: { webtoons: Webtoon[] }) {
    return (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {webtoons.map((webtoon, idx) => (
                <WebtoonCard
                    key={`${webtoon.title}-${idx}`}
                    webtoon={webtoon}
                />
            ))}
        </div>
    );
}
