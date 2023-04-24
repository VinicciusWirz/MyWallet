import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import MyWalletLogo from "../components/MyWalletLogo";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import SessionContext from "../contexts/SessionContext";
import { ThreeDots } from "react-loader-spinner";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function SignInPage() {
  const url = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const { session, setSession } = useContext(SessionContext);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const iconStyles = {
    cursor: "pointer",
    position: "absolute",
    right: "10",
    top: "50%",
    transform: "translateY(-50%)",
    width: "20px",
    height: "20px",
    opacity: "0.8"
  };

  useEffect(() => {
    if (session) navigate("/home");
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
        <div>
          <input
            placeholder="Senha"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            minLength={3}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            disabled={loading}
            data-test="password"
          />
          {showPassword ? (
            <AiFillEyeInvisible
              style={iconStyles}
              onClick={() => setShowPassword(!showPassword)}
            />
          ) : (
            <AiFillEye
              style={iconStyles}
              onClick={() => setShowPassword(!showPassword)}
            />
          )}
        </div>
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
    div {
      width: 100%;
      position: relative;
    }
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
