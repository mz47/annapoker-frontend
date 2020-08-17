import React from "react";
import {Box, Heading, Main} from "grommet/es6";

export const StartPage = () => {
  return (
    <Main pad="large" align={"center"}>
      <Box>
        <Heading>Welcome to Annapoker!</Heading>
        <img src="https://media1.giphy.com/media/xT9DPlAUKTl1GeZjC8/giphy.gif" alt="Giphy Poker"/>
      </Box>
    </Main>
  )
}