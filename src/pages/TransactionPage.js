import apiTransactions from "../services/apiTransactions";
import dayjs from "dayjs";
import { ThreeDots } from "react-loader-spinner";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import SessionContext from "../contexts/SessionContext";

export default function TransactionsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { session } = useContext(SessionContext);
  const [form, setForm] = useState({
    description: "",
    value: "",
    type:
      params.tipo === "entrada"
        ? "deposit"
        : params.tipo === "saida" && "withdraw",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (isNaN(form.value) || form.value < 0) {
      return alert("O valor deve ser um número positivo flutuante");
    }

    const date = dayjs().format("DD/MM/YYYY");
    const body = {
      ...form,
      value: parseFloat(form.value).toFixed(2),
      date,
    };
    setLoading(true);
    apiTransactions
      .newTransactionReq(session.token, body)
      .then(() => {
        setLoading(false);
        navigate("/home");
      })
      .catch((err) => {
        setLoading(false);
        alert(`Erro ${err.response.status}: ${err.response.data}`);
      });
  }

  return (
    <TransactionsContainer>
      <h1>Nova {params.tipo}</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Valor"
          type="number"
          required
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
          disabled={loading}
          step="0.01"
          min="0.01"
          data-test="registry-amount-input"
        />
        <input
          placeholder="Descrição"
          type="text"
          required
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          disabled={loading}
          data-test="registry-name-input"
        />
        <button type="submit" data-test="registry-save" disabled={loading}>
          {loading ? (
            <ThreeDots height="24" width="70" color="#DBDBDB" />
          ) : (
            `Salvar ${params.tipo}`
          )}
        </button>
        <button type="reset" disabled={loading} onClick={() => navigate(-1)}>
          {loading ? (
            <ThreeDots height="24" width="70" color="#DBDBDB" />
          ) : (
            `Cancelar`
          )}
        </button>
      </form>
    </TransactionsContainer>
  );
}

const TransactionsContainer = styled.main`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 15px;
    width: 100%;
    border-radius: 5px;
  }
  h1 {
    font-family: "Raleway", sans-serif;
    font-weight: 700;
    font-size: 26px;
    color: white;
    align-self: flex-start;
    margin-bottom: 40px;
    line-height: 31px;
  }
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    outline: none;
    border: none;
    border-radius: 5px;
    background-color: #a328d6;
    font-size: 20px;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    width: 100%;
    padding: 12px;
  }
  input {
    font-size: 20px;
    width: 100%;
    border-radius: 5px;
    outline: none;
    border: 1px solid #ccc;
    padding: 15px;
    margin: 1px;
    :focus {
      border: 2px solid #ffb6b6;
      margin: 0px;
    }
    ::placeholder {
      font-style: normal;
      font-weight: 400;
      font-size: 20px;
      line-height: 23px;
    }
  }
  input:disabled {
    background: #dadada;
  }
`;
