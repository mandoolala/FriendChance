import React, { useEffect, useLayoutEffect } from 'react';
import { BrowserRouter, Route, Switch, Redirect, RouteProps } from 'react-router-dom'
import { createStore, applyMiddleware, compose, Store, Middleware } from 'redux'
import { Provider, useSelector } from 'react-redux'
import createSagaMiddleware from 'redux-saga'

import Login from 'Pages/Login'
import Main from 'Pages/Main'
import rootReducer, { reducerType } from 'Redux/reducer'
import sagas from 'Redux/sagas'
import MyNotes from './components/pages/MyNotes';
import NewNote from './components/pages/NewNote';
import ShareNote from './components/pages/ShareNote';
import ApproveLoan from './components/pages/ApproveLoan';
import SendMoney from './components/pages/SendMoney';
import { setClientId } from './apis/client';

const sagaMiddleware = createSagaMiddleware()

const sessionStorageKey = "@redux-sessionStorage";
const save: () => Middleware = () => (store) => (next) => (action) => {
  const result = next(action);
  window.sessionStorage.setItem(sessionStorageKey, JSON.stringify(store.getState()));
  return result;
};
const load = () => JSON.parse(window.sessionStorage.getItem(sessionStorageKey) || "{}");

const store = createStore(
  rootReducer,
  load(),
  compose(
    applyMiddleware(
      sagaMiddleware,
      save()
    ),
    // @ts-ignore
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
)

sagaMiddleware.run(sagas)

const loginPath = "/";

export default () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path={loginPath} component={Login} />
          <PrivateRoute path="/my-notes">
            <MyNotes />
          </PrivateRoute>
          <PrivateRoute path="/new-note">
            <NewNote />
          </PrivateRoute>
          <PrivateRoute path="/share-note">
            <ShareNote />
          </PrivateRoute>
          <PrivateRoute path="/approval">
            <ApproveLoan />
          </PrivateRoute>
          <PrivateRoute path="/send-money">
            <SendMoney />
          </PrivateRoute>
        </Switch>
      </BrowserRouter>
    </Provider>
  )
}

const PrivateRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const user = useSelector((state: reducerType) => state.user);
  useLayoutEffect(() => {
    if (!user) { return; }
    setClientId(user.id);
  }, [user]);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: loginPath,
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}
