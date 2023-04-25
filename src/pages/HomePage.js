import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import axios from "axios";
import { BiExit } from "react-icons/bi";
import styled from "styled-components";
import SessionContext from "../contexts/SessionContext";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";

export default function HomePage() {
  const url = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { session } = useContext(SessionContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState({ value: 0, order: "positivo" });
  const convertToCurrency = 100;

  useEffect(() => {
    if (!session) {
      navigate("/");
    } else {
      updateTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateTransactions() {
    const token = session.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    setLoading(true);
    axios
      .get(`${url}/transactions`, config)
      .then((res) => {
        setLoading(false);
        setTransactions(res.data.transactions.reverse());
        let sum = 0;
        res.data.transactions.forEach((t) => {
          if (t.type === "withdraw") {
            sum -= Number(t.value);
          }
          if (t.type === "deposit") {
            sum += Number(t.value);
          }
        });
        const sumIsNegative = sum < 0;
        const sumResult = {
          value: sumIsNegative ? -sum : sum,
          order: sumIsNegative ? "negativo" : "positivo",
        };
        setTotal(sumResult);
      })
      .catch((err) => {
        const noAuthStatus = 401;
        setLoading(false);
        alert(
          `Erro ao atualizar lista ${err.response.status}: ${err.response.data}`
        );
        if (err.response.status === noAuthStatus) logout();
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
          <h1 data-test="user-name">Olá, {session?.name}</h1>
          <div>
            <BiExit data-test="logout" onClick={logout} />
          </div>
        </Header>

        <TransactionsContainer>
          <ul>
            {transactions.length === 0 ? (
              <NoListMsg>
                <p>Não há registros de entrada ou saída</p>
              </NoListMsg>
            ) : (
              transactions.map((t) => (
                <ListItemContainer key={t.id}>
                  <ItemDescription>
                    <span>{t.date.slice(0, 5)}</span>
                    <Link
                      to={`/editar-registro/${
                        t.type === "withdraw"
                          ? "saida"
                          : t.type === "deposit" && "entrada"
                      }?id=${t.id}`}
                    >
                      <strong data-test="registry-name">{t.description}</strong>
                    </Link>
                  </ItemDescription>
                  <div>
                    <Value
                      color={t.type === "withdraw" ? "negativo" : "positivo"}
                      data-test="registry-amount"
                    >
                      {(t.value / convertToCurrency).toLocaleString("pt-BR", {
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
              ))
            )}
          </ul>

          <article>
            <strong>Saldo</strong>
            <Value color={total.order} data-test="total-amount">
              {(Number(total.value) / convertToCurrency).toLocaleString(
                "pt-BR",
                {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
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
  height: 100%;
  max-height: 100%;
  width: 100%;
`;
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 5px 2px;
  margin-bottom: 15px;
  font-size: 26px;
  font-weight: 400;
  font-family: "Raleway", sans-serif;
  color: white;
  width: 100%;
  h1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: auto;
    line-height: 31px;
  }
  div {
    height: 100%;
    display: flex;
    align-items: center;
  }
`;
const TransactionsContainer = styled.article`
  flex-grow: 1;
  background-color: #fff;
  height: calc(100% - 170px);
  color: #000;
  border-radius: 5px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  ul {
    height: 100%;
    max-height: 100%;
    margin-bottom: 13px;
    overflow-y: scroll;
    padding-bottom: 10px;
    width: 100%;
    ::-webkit-scrollbar {
      display: none;
    }
    ::-webkit-scrollbar-thumb {
      background-color: #ccc;
    }
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  article {
    width: 100%;
    display: flex;
    justify-content: space-between;
    strong {
      font-weight: 700;
      text-transform: uppercase;
    }
  }
  a {
    text-decoration: none;
    color: inherit;
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
    outline: none;
    border: none;
    border-radius: 5px;
    background-color: #a328d6;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 22px;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    padding: 12px;
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
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #000000;
  margin-right: 10px;
  line-height: 20px;
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
      outline: none;
      border: none;
    }
  }
`;
const ItemDescription = styled.div`
  width: auto;
  max-width: auto;
  margin-right: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  span {
    padding-left: 10px;
    color: #c6c6c6;
    margin-right: 10px;
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
const NoListMsg = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: calc(100% - 50px);
  align-self: center;
  justify-self: center;
  p {
    font-family: "Raleway", sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 23px;
    text-align: center;
    color: #868686;
  }
`;
