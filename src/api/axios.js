import axios from "axios";
import axiosRetry from "axios-retry";
import { BEARER_TOKEN } from '@/config'

axiosRetry(axios, { retries: 5 });

axios.defaults.timeout = 30000;

export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        console.log("network err", err);
        if (err.response) {
          reject(err.response.status);
          return;
        } else {
          reject(500);
        }
      }).then(resolve);
  });
}

export function getTwitterApi(url, params) {
  return new Promise((resolve, reject) => {
    console.log(64, BEARER_TOKEN);
    axios({
      method: 'get',
      url,
      headers: {
        'Authorization': 'Bearer ' + BEARER_TOKEN 
      }
    }).then(res => {
      resolve(res.data)
    })
  })
}

export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        if (err.response) {
          reject(err.response.status);
          return;
        }
        reject(500);
      });
  });
}

export function put(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .put(url, params)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        if (err.response) {
          reject(err.response.status);
          return;
        }
        reject(500);
      });
  });
}
