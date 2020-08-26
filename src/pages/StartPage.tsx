import React from "react";
import {Box, Heading, Image, Main} from "grommet/es6";
import {NavHeader} from "../components/NavHeader";

export const StartPage = () => {
  return (
    <Box>
      <NavHeader loginDisabled={true} revealDisabled={true} resetVotingsDisabled={true} resetUsersDisabled={true}/>
      <Main pad="large" align={"center"}>
        <Box>
          <Heading>Welcome to Annapoker!</Heading>
          <Image fit={"contain"} src={"https://media.giphy.com/media/fat0moDHhsjO8/source.gif"} alt={"Terence Hill Poker Giphy"}/>
        </Box>
      </Main>
    </Box>
  )
}