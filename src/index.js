import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import store from "./store";
import { Provider } from "react-redux";
import "./index.css";

import App from "./App";

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <Suspense fallback={null}>
      <App />
    </Suspense>
  </Provider>,
  // </React.StrictMode>
  document.getElementById("root")
);
