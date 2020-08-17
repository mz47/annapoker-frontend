import React from 'react';
import './App.css';
import {Box, Button, Header, Heading} from "grommet/es6";
import {Link, Route} from "react-router-dom";
import {AddCircle, Home, Refresh, Trash, View} from "grommet-icons/es6";
import {LoginPage} from "./LoginPage";
import PokerPage from "./PokerPage";
import {StartPage} from "./StartPage";

const App = () => (
  <Box>
    <Route path={"/"} exact component={StartPage}/>
    <Route path={"/poker"} component={PokerPage}/>
  </Box>
)

export default App;
