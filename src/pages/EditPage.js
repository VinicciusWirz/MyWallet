import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import SessionContext from "../contexts/SessionContext";

export default function EditPage(props) {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
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
    setLoading(true);
    if (storedToken) {
      const tokenObj = JSON.parse(storedToken);
      setSession(tokenObj);

      getTransactionData(tokenObj.token);
    } else {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getTransactionData(token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get(`${url}/transactions/${id}`, config)
      .then((res) => {
        setLoading(false);
        setForm({
          description: res.data.description,
          value: (Number(res.data.value) / 100).toFixed(2),
          type: res.data.type,
        });
      })
      .catch((err) => {
        setLoading(false);
        alert(`Erro ${err.response.status}: ${err.response.data}`);
        navigate(-1);
      });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const body = {
      ...form,
      value: (Number(parseFloat(form.value).toFixed(2)) * 100).toString(),
    };
    const config = {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    };

    setLoading(true);
    axios
      .put(`${url}/transactions/${id}`, body, config)
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
      <h1>Editar {params.tipo}</h1>
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
            `Atualizar ${params.tipo}`
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
