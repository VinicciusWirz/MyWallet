import axios from "axios";

const url = `${process.env.REACT_APP_API_URL}/transactions`;

function createConfig(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

function getTransactionsReq(token, id) {
  const promise = axios.get(id ? `${url}/${id}` : url, createConfig(token));
  return promise;
}

function newTransactionReq(token, body) {
  const promise = axios.post(url, body, createConfig(token));
  return promise;
}

function deleteTransactionReq(token, id) {
  const promise = axios.delete(`${url}/${id}`, createConfig(token));
  return promise;
}

function editTransactionReq(token, body, id) {
  const promise = axios.put(`${url}/${id}`, body, createConfig(token));
  return promise;
}

const apiTransactions = {
  getTransactionsReq,
  newTransactionReq,
  deleteTransactionReq,
  editTransactionReq,
};

export default apiTransactions;
