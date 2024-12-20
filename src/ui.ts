export async function getWelcomeMessage(): Promise<string> {
  const hours = new Date().getHours();
  let { name } = await chrome.storage.local.get('name');

  while (!name) {
    const givenName = prompt('What is your name?');
    await chrome.storage.local.set({ name: givenName });
    name = givenName;
  }

  if (hours < 12) {
    return `Good morning, ${name}`;
  } else if (hours < 18) {
    return `Good afternoon, ${name}`;
  } else {
    return `Good evening, ${name}`;
  }
}

export function getTime(): string {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
}
