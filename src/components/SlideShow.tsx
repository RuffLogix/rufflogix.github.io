import type { CardProps } from "../const";

export default function SlideShow({ cards }: { cards: CardProps[] }) {
  return (
    <div className="w-full gap-3 py-3 flex overflow-x-auto">
      {cards &&
        cards.map((card) => (
          <div className="p-3 rounded-md bg-orange-50 shadow-md min-w-[400px] max-w-[400px] h-[160px] flex flex-col gap-1">
            <h1 className="text-base font-bold">{card.name}</h1>
            <div className="flex gap-1">
              {card.tags.map((tag: string) => (
                <span className="px-3 py-1 font-normal bg-orange-200 hover:bg-orange-400 hover:cursor-default duration-300 rounded-full text-xs">
                  # {tag}
                </span>
              ))}
            </div>
            <p className="text-sm">{card.description}</p>
            <a
              href={card.link}
              className="font-medium hover:text-orange-500 underline"
            >
              Read more
            </a>
          </div>
        ))}
    </div>
  );
}
