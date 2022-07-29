import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import { MoralisProvider } from "react-moralis";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MoralisProvider
      serverUrl="https://6yzvgcbdbkni.usemoralis.com:2053/server"
      appId="nmVqIb4QpRp8nKBomr1b7kfR5QmP1t7yeoHzYdsO"
    >
      <App />
    </MoralisProvider>
  </React.StrictMode>
);
