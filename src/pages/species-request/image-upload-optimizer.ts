const MAX_IMAGE_SIDE = 1920;
const TARGET_MAX_BYTES = 4_800_000;
const MIN_QUALITY = 0.55;
const QUALITY_STEPS = [0.82, 0.76, 0.7, 0.64, 0.58, MIN_QUALITY] as const;

const OPTIMIZABLE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function optimizeImageForUpload(file: File): Promise<File> {
  if (!OPTIMIZABLE_MIME_TYPES.has(file.type)) {
    return file;
  }

  if (file.size <= 1_000_000) {
    return file;
  }

  const image = await loadImage(file);
  const { width, height } = fitWithinBounds(image.width, image.height, MAX_IMAGE_SIDE);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return file;
  }

  ctx.drawImage(image, 0, 0, width, height);

  const targetMime = file.type === "image/jpeg" ? "image/jpeg" : "image/webp";

  let smallestBlob: Blob | null = null;

  for (const quality of QUALITY_STEPS) {
    const blob = await canvasToBlob(canvas, targetMime, quality);

    if (!smallestBlob || blob.size < smallestBlob.size) {
      smallestBlob = blob;
    }

    if (blob.size <= TARGET_MAX_BYTES) {
      smallestBlob = blob;
      break;
    }
  }

  if (!smallestBlob) {
    return file;
  }

  if (smallestBlob.size >= file.size) {
    return file;
  }

  return new File([smallestBlob], normalizeFileName(file.name, targetMime), {
    type: targetMime,
    lastModified: file.lastModified,
  });
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image_load_failed"));
    };

    image.src = url;
  });
}

function fitWithinBounds(width: number, height: number, maxSide: number) {
  const longestSide = Math.max(width, height);

  if (longestSide <= maxSide) {
    return { width, height };
  }

  const scale = maxSide / longestSide;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("image_encode_failed"));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality
    );
  });
}

function normalizeFileName(originalName: string, mimeType: string) {
  const extension = mimeType === "image/jpeg" ? "jpg" : "webp";
  const baseName = originalName.replace(/\.[^/.]+$/, "");
  return `${baseName}.${extension}`;
}
