import { IMAGE_KEY, UNSPLASH_PROXY_URL } from "./constants";

export async function getDailyImage(): Promise<string | null> {
  const { [IMAGE_KEY]: storageImage } = await chrome.storage.local.get([IMAGE_KEY]);
  
  const today = new Date().getDate();
  
  if (storageImage && storageImage.date === today) {
    console.log('retrieved image from cache');
    return storageImage.url;
  }

  try {
    const response = await fetch(UNSPLASH_PROXY_URL, {
      headers: {
        'X-Extension-ID': chrome.runtime.id
      }
    });
    const data = await response.json();
    const imageUrl = data.urls.full;

    console.log('retrieved response, storing in cache', imageUrl);

    await chrome.storage.local.set({ [IMAGE_KEY]: { date: today, url: imageUrl } });

    return imageUrl;
  } catch(error) {
    console.error('Error fetching image:', error);
    return null;
  }
}