import axios from 'axios'

const baseURL = 'http://localhost:8080/'

const client = axios.create({
  baseURL,
});

export const setClientId = (id: string) => {
  client.defaults.headers = {
    authorization: id,
  };
}

export default client;