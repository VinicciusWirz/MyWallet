import axios from "axios";

const url = process.env.REACT_APP_API_URL;

function signin(body) {
  const promise = axios.post(`${url}/sign-in`, body);
  return promise;
}

function signup(body) {
  const promise = axios.post(`${url}/sign-up`, body);
  return promise;
}

const apiAuth = { signin, signup };

export default apiAuth;
