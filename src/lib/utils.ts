import imageCompression from 'browser-image-compression';
import { type ClassValue, clsx } from 'clsx';
import { nanoid } from 'nanoid';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateID = (
  ids: string[] = [],
  size = 5,
  options: { prefix?: string } = {}
): string => {
  const id = `${options?.prefix ?? ''}${nanoid(size)}`;
  if (ids.includes(id)) return generateID(ids, size);
  return id;
};

export const objectId2Date = (objectId: string): number =>
  parseInt(objectId.substring(0, 8), 16) * 1000;

export const convertImgaesToBase64 = async (file: File): Promise<string> => {
  const compressFile = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 300,
    useWebWorker: true,
    initialQuality: 0.5,
  });

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(compressFile);
  });
};
