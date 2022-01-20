import logo from "./logo.svg";
import { Provider } from "react-redux";
import { combineReducers, createStore } from "redux";
import { useEffect, useState, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router";
import Main from "./view/Main/Main";
import "./assets/default/default.css";

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
