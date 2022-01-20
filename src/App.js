import { Provider } from "react-redux";
import { combineReducers, createStore } from "redux";
import { useEffect, useState, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router";
import "./assets/default/default.css";

import Main from "./controller/Main/Main";

function App() {
  const [loginUser, setLoginUser] = useState({ name: "성민", age: 28 });

  const loginUserReducer = (state = loginUser, action) => {
    const param = action.payload;

    switch (action.type) {
      case "doLogin":
        const loginUser = param.data;

        return loginUser;

      default:
        return state;
    }
  };

  const store = createStore(
    combineReducers({
      loginUserReducer,
    })
  );

  return (
    <Provider store={store}>
      <Routes>
        <Route exact path="/" element={<Main />} />
      </Routes>
    </Provider>
  );
}

export default App;
