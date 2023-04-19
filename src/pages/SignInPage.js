import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import MyWalletLogo from "../components/MyWalletLogo";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import TokenContext from "../contexts/TokenContext";

export default function SignInPage() {
  const url = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const { setToken } = useContext(TokenContext);

  useEffect(() => {
    const storedToken = localStorage.getItem("sessionToken");
    if (storedToken) {
      const token = JSON.parse(storedToken);
      setToken(token);
      navigate("/home");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .post(`${url}/sign-in`, form)
      .then((res) => {
        const token = res.data;
        setToken(token);
        localStorage.setItem("sessionToken", JSON.stringify(token));
        navigate("/home");
      })
      .catch((err) => {
        alert(`Erro ${err.response.status}: ${err.response.data}`);
      });
  }
  return (
    <SingInContainer>
      <form onSubmit={handleSubmit}>
        <MyWalletLogo />
        <input
          placeholder="E-mail"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Senha"
          type="password"
          autoComplete="new-password"
          required
          minLength={3}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">Entrar</button>
      </form>

      <Link to="/cadastro">Primeira vez? Cadastre-se!</Link>
    </SingInContainer>
  );
}

const SingInContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
