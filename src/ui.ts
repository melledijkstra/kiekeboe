function getBrowserLocale(): string {
  if (navigator.languages !== undefined)
    return navigator.languages[0];
  return navigator.language;
}

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
  const locale = getBrowserLocale();
  const date = new Date();
  return date.toLocaleTimeString(locale, {
    hour: '2-digit', minute: '2-digit'
  });
}
