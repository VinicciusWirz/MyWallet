import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import SessionContext from "./contexts/SessionContext";
import EditPage from "./pages/EditPage";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import TransactionsPage from "./pages/TransactionPage";

export default function App() {
  const [session, setSession] = useState({ name: "", token: "" });
  return (
    <PagesContainer>
      <SessionContext.Provider value={{ session, setSession }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SignInPage />} />
            <Route path="/cadastro" element={<SignUpPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route
              path="/nova-transacao/:tipo"
              element={<TransactionsPage />}
            />
            <Route path="/editar-registro/:tipo" element={<EditPage />} />
          </Routes>
        </BrowserRouter>
      </SessionContext.Provider>
    </PagesContainer>
  );
}

const PagesContainer = styled.main`
  background-color: #8c11be;
  width: 100vw;
  padding: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  max-height: 100vh;
`;