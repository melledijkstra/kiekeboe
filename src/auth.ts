export async function getAuthToken() {
  const oauth2 = await chrome.identity.getAuthToken({ interactive: true });

  if (chrome.runtime.lastError) {
    console.error('Error during authentication:', chrome.runtime.lastError);
    return;
  }

  return oauth2.token;
}