import React from 'react';
import {Box} from "grommet/es6";
import {Route} from "react-router-dom";
import PokerPage from "./PokerPage";
import {StartPage} from "./StartPage";
import {NewSessionPage} from "./NewSessionPage";

const App = () => (
  <Box>
    <Route path={"/"} exact component={StartPage}/>
    <Route path={"/new"} component={NewSessionPage}/>
    <Route path={"/poker/:sessionId"} component={PokerPage}/>
  </Box>
)

export default App;
