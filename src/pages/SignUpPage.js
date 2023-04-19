import axios from "axios";
import { useState } from "react";
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

  function handleSubmit(e) {
    console.log(process.env.REACT_APP_API_URL);
    e.preventDefault();
    if (form.password !== form.repeat_password) {
      return alert("Os campos 'Senha' e 'Confirme a senha' devem ser iguais!");
    }
    axios
      .post(`${url}/sign-up`, form)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        alert(`Erro ${err.response.status}: ${err.response.data}`);
      });
  }

  return (
    <SingUpContainer>
      <form onSubmit={handleSubmit}>
        <MyWalletLogo />
        <input
          placeholder="Nome"
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          data-test="name"
        />
        <input
          placeholder="E-mail"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          data-test="email"
        />
        <input
          placeholder="Senha"
          type="password"
          autoComplete="new-password"
          required
          minLength={3}
          value={form.password}
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
          onChange={(e) =>
            setForm({ ...form, repeat_password: e.target.value })
          }
          data-test="conf-password"
        />
        <button type="submit" data-test="sign-up-submit">
          Cadastrar
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
`;
