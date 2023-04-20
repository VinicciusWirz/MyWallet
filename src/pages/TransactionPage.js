import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import SessionContext from "../contexts/SessionContext";

export default function TransactionsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URL;
  const { session, setSession } = useContext(SessionContext);
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
    const storedToken = localStorage.getItem("session");
    if (storedToken) {
      const tokenObj = JSON.parse(storedToken);
      setSession(tokenObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const body = {
      ...form,
      value: (Number(parseFloat(form.value).toFixed(2)) * 100).toString(),
    };

    console.log(body);
    const config = {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    };
    setLoading(true);
    axios
      .post(`${url}/transactions`, body, config)
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
      </form>
    </TransactionsContainer>
  );
}

const TransactionsContainer = styled.main`
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  h1 {
    align-self: flex-start;
    margin-bottom: 40px;
  }
  button {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  input:disabled {
    background: #dadada;
  }
`;
