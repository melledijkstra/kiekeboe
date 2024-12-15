const TOKEN_STORAGE_KEY = 'auth_token';

let token = null;

export async function getAuthToken () {
  if (token) {
    console.log('token from in-memory');
    return token;
  }

  const {[TOKEN_STORAGE_KEY]: storageToken} = await chrome.storage.local.get([TOKEN_STORAGE_KEY]);

  if (storageToken) {
    console.log('token from storage');
    token = storageToken;
    return token;
  }

  const oauth2 = await chrome.identity.getAuthToken({ interactive: true });

  if (chrome.runtime.lastError) {
    console.error('Error during authentication:', chrome.runtime.lastError);
    return;
  }

  console.log('fresh OAuth token:', oauth2.token);
  chrome.storage.local.set({ [TOKEN_STORAGE_KEY]: oauth2.token });
  token = oauth2.token;
  return oauth2.token;
}