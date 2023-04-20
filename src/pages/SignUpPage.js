import axios from "axios";
import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import MyWalletLogo from "../components/MyWalletLogo";

export default function SignUpPage() {
  const url = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    repeat_password: "",
  });
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.repeat_password) {
      return alert("Os campos 'Senha' e 'Confirme a senha' devem ser iguais!");
    }
    setLoading(true);
    axios
      .post(`${url}/sign-up`, form)
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
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  a {
    font-weight: 700;
    font-size: 15px;
    line-height: 18px;
    color: white;
    -webkit-text-decoration: none;
    text-decoration: none;
    padding-top: 30px;
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
