import axios from 'axios';


const config = {
  // baseURL:`${process.env.API_URL}`,
    baseURL: "http://localhost:3001/",

};
const axiosClient = axios.create(config);

function setAuthorizationToken(token) {
  // const defaultHeaders = axiosClient.defaults.headers.common || {};

  if (token) {
    axiosClient.defaults.headers.common['token'] = token;
    // defaultHeaders['token'] = token
  } else {
    delete axiosClient.defaults.headers.common.token;
  }
}

const httpClient = Object.assign(axiosClient, {
  setAuthorizationToken
});

export default httpClient;
