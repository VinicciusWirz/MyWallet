import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import axios from "axios";
import { BiExit } from "react-icons/bi";
import styled from "styled-components";
import SessionContext from "../contexts/SessionContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";

export default function HomePage() {
  const url = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { session, setSession } = useContext(SessionContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState({ value: 0, order: "" });
  useEffect(() => {
    const storedToken = localStorage.getItem("session");
    if (storedToken) {
      const tokenObj = JSON.parse(storedToken);
      setSession(tokenObj);
      updateTransactions(tokenObj);
    } else {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateTransactions(token) {
    const config = {
      headers: {
        Authorization: `Bearer ${session.token ? session.token : token.token}`,
      },
    };
    setLoading(true);
    axios
      .get(`${url}/transactions`, config)
      .then((res) => {
        setLoading(false);
        setTransactions(res.data.transactions);
        let sum = 0;
        res.data.transactions.forEach((t) => {
          if (t.type === "withdraw") {
            sum -= Number(t.value);
          }
          if (t.type === "deposit") {
            sum += Number(t.value);
          }
        });
        if (sum < 0) {
          setTotal({ value: -sum, order: "negativo" });
        } else {
          setTotal({ value: sum, order: "positivo" });
        }
      })
      .catch((err) => {
        setLoading(false);
        alert(
          `Erro ao atualizar lista ${err.response.status}: ${err.response.data}`
        );
      });
  }

  function logout() {
    localStorage.clear();
    window.location.reload();
  }

  function deleteTransaction(id, desc) {
    const question = `Tem certeza que quer deletar essa transação? Titulo: ${desc}`;

    if (window.confirm(question)) {
      const config = {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      };
      setLoading(true);
      axios
        .delete(`${url}/transactions/${id}`, config)
        .then(() => {
          updateTransactions();
        })
        .catch((err) => {
          alert(
            `Erro ao enviar requisição ${err.response.status}: ${err.response.data}`
          );
          setLoading(false);
        });
    }
  }

  return (
    <>
      {loading && (
        <LoadingModal>
          <TailSpin
            height="150"
            width="150"
            ariaLabel="tail-spin-loading"
            color="purple"
          />
        </LoadingModal>
      )}

      <HomeContainer>
        <Header>
          <h1 data-test="user-name">Olá, {session.name}</h1>
          <BiExit data-test="logout" onClick={logout} />
        </Header>

        <TransactionsContainer>
          <ul>
            {transactions.map((t) => (
              <ListItemContainer key={t.id}>
                <div>
                  <span>{t.date.slice(0, 5)}</span>
                  <strong data-test="registry-name">{t.description}</strong>
                </div>
                <div>
                  <Value
                    color={t.type === "withdraw" ? "negativo" : "positivo"}
                    data-test="registry-amount"
                  >
                    {(t.value / 100).toLocaleString("pt-BR", {
                      style: "decimal",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Value>
                  <button
                    onClick={() => deleteTransaction(t.id, t.description)}
                  >
                    x
                  </button>
                </div>
              </ListItemContainer>
            ))}
          </ul>

          <article>
            <strong>Saldo</strong>
            <Value color={total.order} data-test="total-amount">
              {(Number(total.value) / 100).toLocaleString("pt-BR", {
                style: "decimal",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Value>
          </article>
        </TransactionsContainer>

        <ButtonsContainer>
          <button
            onClick={() => navigate("/nova-transacao/entrada")}
            data-test="new-income"
            disabled={loading}
          >
            <AiOutlinePlusCircle />
            <p>
              Nova <br /> entrada
            </p>
          </button>
          <button
            onClick={() => navigate("/nova-transacao/saida")}
            data-test="new-expense"
            disabled={loading}
          >
            <AiOutlineMinusCircle />
            <p>
              Nova <br />
              saída
            </p>
          </button>
        </ButtonsContainer>
      </HomeContainer>
    </>
  );
}

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
  max-height: calc(100vh - 50px);
`;
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 5px 2px;
  margin-bottom: 15px;
  font-size: 26px;
  color: white;
`;
const TransactionsContainer = styled.article`
  flex-grow: 1;
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-height: 73%;
  ul {
    overflow-y: scroll;
    padding-bottom: 10px;
    ::-webkit-scrollbar {
      display: none;
    }
    ::-webkit-scrollbar-thumb {
      background-color: #ccc;
    }
  }
  article {
    display: flex;
    justify-content: space-between;
    strong {
      font-weight: 700;
      text-transform: uppercase;
    }
  }
`;
const ButtonsContainer = styled.section`
  margin-top: 15px;
  margin-bottom: 0;
  display: flex;
  gap: 15px;

  button {
    width: 50%;
    height: 115px;
    font-size: 22px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    p {
      font-size: 18px;
    }
  }
`;
const Value = styled.div`
  font-size: 16px;
  text-align: right;
  color: ${(props) => (props.color === "positivo" ? "green" : "red")};
`;
const ListItemContainer = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #000000;
  margin-right: 10px;
  div span {
    color: #c6c6c6;
    margin-right: 10px;
  }
  div:nth-child(2) {
    display: flex;
    align-items: center;
    button {
      font-size: 16px;
      padding: 0px;
      margin-left: 11px;
      color: #c6c6c6;
      background: none;
    }
  }
`;
const LoadingModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 25;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
`;
