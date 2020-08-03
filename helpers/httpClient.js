import axios from 'axios';

const config = {
  baseURL:`${process.env.BACKEND_SERVER_URL}`
};
const axiosClient = axios.create(config);

function setAuthorizationToken(token) {

  if (token) {
    axiosClient.defaults.headers.common['token'] = token;
  } else {
    delete axiosClient.defaults.headers.common.token;
  }
}

const httpClient = Object.assign(axiosClient, {
  setAuthorizationToken
});

export default httpClient;
