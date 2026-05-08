type ClarityCommand = unknown[];

type ClarityWindow = Window &
  typeof globalThis & {
    clarity?: {
      (..._args: ClarityCommand): void;
      q?: ClarityCommand[];
    };
  };

export function initClarity() {
  const clarityId = import.meta.env.VITE_CLARITY_ID?.trim();

  if (!import.meta.env.PROD || !clarityId || typeof window === "undefined") {
    return;
  }

  const clarityWindow = window as ClarityWindow;

  if (clarityWindow.clarity) {
    return;
  }

  const clarityQueue: ClarityCommand[] = [];
  const clarity = (...args: ClarityCommand) => {
    clarityQueue.push(args);
  };
  clarity.q = clarityQueue;
  clarityWindow.clarity = clarity;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${encodeURIComponent(clarityId)}`;
  document.head.appendChild(script);
}
