import cookie from 'js-cookie';

const getCookieFromBrowser = key => cookie.get(key);

export const getCookie = (key) => {
  if (process.browser) {
    return getCookieFromBrowser(key);
  }
};