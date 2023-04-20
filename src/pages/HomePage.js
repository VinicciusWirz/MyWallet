import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import axios from "axios";
import { BiExit } from "react-icons/bi";
import styled from "styled-components";
import SessionContext from "../contexts/SessionContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const url = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { session, setSession } = useContext(SessionContext);
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState({ value: 0, order: "" });
  useEffect(() => {
    const storedToken = localStorage.getItem("session");
    if (storedToken) {
      const tokenObj = JSON.parse(storedToken);
      setSession(tokenObj);
      const config = {
        headers: {
          Authorization: `Bearer ${tokenObj.token}`,
        },
      };
      axios
        .get(`${url}/transactions`, config)
        .then((res) => {
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
        .catch((err) => console.log(err));
    } else {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function logout() {
    localStorage.clear();
    window.location.reload();
  }
  return (
    <HomeContainer>
      <Header>
        <h1 data-test="user-name">Olá, {session.name}</h1>
        <BiExit data-test="logout" onClick={logout} />
      </Header>

      <TransactionsContainer>
        <ul>
          {transactions.map((t, index) => (
            <ListItemContainer key={index}>
              <div>
                <span>{t.date.slice(0, 5)}</span>
                <strong data-test="registry-name">{t.description}</strong>
              </div>
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
        >
          <AiOutlinePlusCircle />
          <p>
            Nova <br /> entrada
          </p>
        </button>
        <button
          onClick={() => navigate("/nova-transacao/saida")}
          data-test="new-expense"
        >
          <AiOutlineMinusCircle />
          <p>
            Nova <br />
            saída
          </p>
        </button>
      </ButtonsContainer>
    </HomeContainer>
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
`;
