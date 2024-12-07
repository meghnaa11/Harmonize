import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

import fbConfig from "./firebase/FirebaseConfig";
console.log(fbConfig);
import { initializeApp } from "firebase/app";

const app = initializeApp(fbConfig);

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
