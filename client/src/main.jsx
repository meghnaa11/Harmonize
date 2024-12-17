import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

import { initializeApp } from "firebase/app";

import fbConfig from "./firebase/FirebaseConfig";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://localhost:4000/graphql",
  }),
});

// console.log(fbConfig);
// const app = initializeApp(fbConfig);

const RootComponent = () => {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const [firebaseError, setFirebaseError] = useState(null)

  useEffect(() => {
    try {
      if (!fbConfig.apiKey){
        throw "Api key not provided!"
      }
      const app = initializeApp(fbConfig)
      setFirebaseInitialized(true)
      console.log(app)
    } catch (error) {
      console.error("Firebase initialization error!");
      setFirebaseError("Firebase is not available at the moment. Please try again later.")
    }
  }, [])

  if (!firebaseInitialized) {
    return <div>Provide Firebase API Key</div>
  }

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        {firebaseError ? (
          <div className="config-error" style={{color: 'white'}}>{firebaseError}</div>
        ) : (
          <App />
        )}
      </BrowserRouter>
    </ApolloProvider>
  );
};

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <ApolloProvider client={client}>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </ApolloProvider>
// );

ReactDOM.createRoot(document.getElementById("root")).render(<RootComponent />);
