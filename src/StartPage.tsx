import React from "react";
import {Box, Heading, Image, Main} from "grommet/es6";
import {NavHeader} from "./components/NavHeader";

export const StartPage = () => {
  return (
    <Box>
      <NavHeader loginDisabled={true} revealDisabled={true} resetVotingsDisabled={true} resetUsersDisabled={true}/>
      <Main pad="large" align={"center"}>
        <Box>
          <Heading>Welcome to Annapoker!</Heading>
          <Image fit={"contain"} src={"https://media1.giphy.com/media/xT9DPlAUKTl1GeZjC8/giphy.gif"} alt={"Mel Gibson Poker Giphy"}/>
        </Box>
      </Main>
    </Box>
  )
}