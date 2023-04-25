import apiAuth from "../services/apiAuth";
import { useContext, useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import MyWalletLogo from "../components/MyWalletLogo";
import SessionContext from "../contexts/SessionContext";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { session } = useContext(SessionContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    repeat_password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) navigate("/home");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.repeat_password) {
      return alert("Os campos 'Senha' e 'Confirme a senha' devem ser iguais!");
    }

    const body = { ...form };
    delete body.repeat_password;
    setLoading(true);
    apiAuth
      .signup(body)
      .then(() => {
        setLoading(false);
        navigate("/");
      })
      .catch((err) => {
        alert(`Erro ${err.response.status}: ${err.response.data}`);
        setLoading(false);
      });
  }

  return (
    <SingUpContainer>
      <form onSubmit={handleSubmit}>
        <MyWalletLogo />
        <input
          placeholder="Nome"
          type="text"
          autoComplete="given-name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          disabled={loading}
          data-test="name"
        />
        <input
          placeholder="E-mail"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          disabled={loading}
          data-test="email"
        />
        <input
          placeholder="Senha"
          type="password"
          autoComplete="new-password"
          required
          minLength={3}
          value={form.password}
          disabled={loading}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          data-test="password"
        />
        <input
          placeholder="Confirme a senha"
          type="password"
          autoComplete="new-password"
          required
          minLength={3}
          value={form.repeat_password}
          disabled={loading}
          onChange={(e) =>
            setForm({ ...form, repeat_password: e.target.value })
          }
          data-test="conf-password"
        />
        <button type="submit" data-test="sign-up-submit" disabled={loading}>
          {loading ? (
            <ThreeDots height="24" width="70" color="#DBDBDB" />
          ) : (
            "Cadastrar"
          )}
        </button>
      </form>

      <Link to="/">Já tem uma conta? Entre agora!</Link>
    </SingUpContainer>
  );
}

const SingUpContainer = styled.section`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: calc(100% - 5px);
    border-radius: 5px;
    gap: 15px;
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
  }
  input:disabled {
    background: #dadada;
  }
  button {
    display: flex;
    align-items: center;
    justify-content: center;
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
  a {
    font-weight: 700;
    font-size: 15px;
    line-height: 18px;
    color: white;
    text-decoration: none;
    padding-top: 30px;
  }
`;
