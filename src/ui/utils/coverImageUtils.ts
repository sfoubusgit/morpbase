const COVER_MAX_BYTES = 200 * 1024;
const COVER_MAX_DIM = 1200;

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === 'string'
        ? resolve(reader.result)
        : reject(new Error('Failed to read the selected image.'));
    reader.onerror = () => reject(new Error('Failed to read the selected image.'));
    reader.readAsDataURL(file);
  });

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load the selected image.'));
    img.src = src;
  });

const estimateBytes = (dataUrl: string): number => {
  const i = dataUrl.indexOf('base64,');
  const b64 = i === -1 ? dataUrl : dataUrl.slice(i + 7);
  return Math.ceil((b64.length * 3) / 4);
};

export const processCoverImage = async (file: File): Promise<string> => {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    throw new Error('Please choose a PNG, JPEG, or WebP image.');
  }

  const dataUrl = await readFileAsDataUrl(file);
  const img = await loadImage(dataUrl);
  const ratio = Math.min(1, COVER_MAX_DIM / img.width, COVER_MAX_DIM / img.height);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * ratio);
  canvas.height = Math.round(img.height * ratio);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Image processing is not available in this browser.');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const attempts: Array<[string, number]> = [
    ['image/webp', 0.85],
    ['image/webp', 0.70],
    ['image/jpeg', 0.88],
    ['image/jpeg', 0.72],
    ['image/jpeg', 0.58],
  ];

  for (const [mime, q] of attempts) {
    const result = canvas.toDataURL(mime, q);
    if (result.startsWith(`data:${mime};base64,`) && estimateBytes(result) <= COVER_MAX_BYTES) {
      return result;
    }
  }

  throw new Error('Cover image is still too large after compression. Please use a smaller image.');
};
