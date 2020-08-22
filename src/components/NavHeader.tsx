import React from 'react';
import {Box, Button, Header, Heading} from "grommet/es6";
import {AddCircle, Home, Login, Refresh, View} from "grommet-icons/es6";
import {Link} from "react-router-dom";

interface NavHeaderProps {
  loginHandler?: () => void,
  revealHandler?: () => void,
  resetVotingsHandler?: () => void,
  loginDisabled: boolean,
  revealDisabled: boolean,
  resetVotingsDisabled: boolean,
  resetUsersDisabled: boolean,
}

export const NavHeader = (props: NavHeaderProps) => {
  const {loginHandler, resetVotingsHandler, revealHandler, revealDisabled, loginDisabled} = props
  return (
    <Header background={"brand"} justify={"start"}>
      <Heading margin={"small"}>Annapoker</Heading>
      <Link to={"/"}><Button icon={<Home/>} hoverIndicator/></Link>
      <Link to={"/new"}><Button icon={<AddCircle/>} hoverIndicator/></Link>
      <Button icon={<Login/>} disabled={loginDisabled} onClick={loginHandler} hoverIndicator/>
      <Box direction={"row"} align={"center"}>
        <span>|</span>
        <Button icon={<View/>} disabled={revealDisabled} onClick={revealHandler}
                hoverIndicator/>
        <Button icon={<Refresh/>} disabled={revealDisabled} onClick={resetVotingsHandler} hoverIndicator/>
      </Box>
    </Header>
  )
}
