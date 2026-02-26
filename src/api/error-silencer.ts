let silenceCounter = 0;

export async function runWithSilencedApiErrors<T>(fn: () => Promise<T>): Promise<T> {
  silenceCounter += 1;
  try {
    return await fn();
  } finally {
    silenceCounter = Math.max(0, silenceCounter - 1);
  }
}

export function shouldSilenceApiErrors() {
  return silenceCounter > 0;
}
