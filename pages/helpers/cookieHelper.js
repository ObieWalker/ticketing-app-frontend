export function getCookieValue(cookies, key){
  const cookieValue = cookies
  .split('; ')
  .find(row => row.startsWith(key))
  .split('=')[1];

  return cookieValue;
}