interface AlphabetNavigationProps {
  onLetterClick?: (letter: string) => void;
}

export default function AlphabetNavigation({ onLetterClick }: AlphabetNavigationProps) {
  const alphabet: string[] = [
    "#",
    ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-16 mb-12">
      {alphabet.map((letter: string) => (
        <button
          key={letter}
          onClick={() => onLetterClick && onLetterClick(letter)}
          className="text-2xl font-bold text-[#00c000] hover:text-white transition-colors"
        >
          {letter}
        </button>
      ))}
    </div>
  );
}
