import { getDailyImage } from './unsplash.js';
import { getTime, getWelcomeMessage } from './ui.js';
import { getAuthToken } from './auth.js';
import { fetchPhotos } from './photos.js';
import { fetchTasks } from './tasks.js';

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('time').innerText = getTime();
  document.getElementById('welcome').innerText = await getWelcomeMessage();

  document.getElementById('photos').addEventListener('click', async () => {
    const token = await getAuthToken();
    fetchPhotos(token);
  });
  document.getElementById('tasks').addEventListener('click', async () => {
    const token = await getAuthToken();
    fetchTasks(token);
  });

  const url = await getDailyImage();
  if (url) {
    const image = new Image();
    image.onload = () => {
      document.body.style.backgroundImage = `url(${url})`;
      // fade out the curtain
      document.getElementById('curtain').style.opacity = 0.1;
      image.remove();
    };
    image.src = url;
  }
});