import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import loadable from "@loadable/component";
import React from "react";
import GlobalProvider from "./context";
import style from "./styles/main.css";

const Queue = loadable(() => import("./screens/queue"));
const History = loadable(() => import("./screens/history"));
const Search = loadable(() => import("./screens/search"));

export default function App() {
  return (
    <GlobalProvider>
      <Router>
        <div>
          <div className={style.titlebar}>
            <div className={style.title}>YouTube MP3 Downloader</div>
            <div className={style.buttons}>
              <div id="minimize" className={style.minimize}></div>
              <div id="maximize" className={style.maximize}></div>
              <div id="close" className={style.close}></div>
            </div>
          </div>
          <div className={style.main}>
            <div className={style.menu}>
              <Link to="/queue">
                <div className={style.queue}></div>
              </Link>
              <Link to="/">
                <div className={style.search}></div>
              </Link>
              <Link to="/history">
                <div className={style.history}></div>
              </Link>
            </div>
            <div className={style.content}>
              <div className={style.background}></div>
              <div className={style.pageContent}>
                <Switch>
                  <Route exact path="/">
                    <Search />
                  </Route>
                  <Route path="/queue">
                    <Queue />
                  </Route>
                  <Route path="/history">
                    <History />
                  </Route>
                </Switch>
              </div>
            </div>
          </div>
        </div>
      </Router>
    </GlobalProvider>
  );
}
