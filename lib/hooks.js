import useSWR from 'swr';
import {getToken} from '../pages/helpers/customMethods'


const fetcher = (...args) => {
  fetch(url, {
  headers: {
    "Content-Type": "application/json",
    "token": args[0].substr(args[0].length -32)
  }
}).then(res => {
  res.json()})
}

export function useCurrentUser(token) {
  const { data, mutate } = useSWR(`http://localhost:3001/users/${token}`, fetcher);
  const user = data?.user;
  return [user, { mutate }];
}

export function getUser(id) {
  const { data } = useSWR(`localhost:3001/users/${id}`,  fetcher, { revalidateOnFocus: false });
  return data?.user;
}