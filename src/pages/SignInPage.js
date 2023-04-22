import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import MyWalletLogo from "../components/MyWalletLogo";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import SessionContext from "../contexts/SessionContext";
import { ThreeDots } from "react-loader-spinner";

export default function SignInPage() {
  const url = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const { setSession } = useContext(SessionContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("session");
    if (storedToken) {
      const token = JSON.parse(storedToken);
      setSession(token);
      navigate("/home");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    axios
      .post(`${url}/sign-in`, form)
      .then((res) => {
        const user = res.data;
        setLoading(false);
        setSession(user);
        localStorage.setItem("session", JSON.stringify(user));
        navigate("/home");
      })
      .catch((err) => {
        setLoading(false);
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
          disabled={loading}
          autoComplete="email"
          data-test="email"
        />
        <input
          placeholder="Senha"
          type="password"
          autoComplete="current-password"
          required
          minLength={3}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          disabled={loading}
          data-test="password"
        />
        <button type="submit" data-test="sign-in-submit" disabled={loading}>
          {loading ? (
            <ThreeDots height="24" width="70" color="#DBDBDB" />
          ) : (
            "Entrar"
          )}
        </button>
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
  a {
    font-weight: 700;
    font-size: 15px;
    line-height: 18px;
    color: white;
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
