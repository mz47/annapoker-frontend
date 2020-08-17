import React, {useState} from "react";
import {Box, Button, Heading, Main, TextInput} from "grommet/es6";
import {Login, User} from "grommet-icons/es6";

export const LoginPage = () => {

  const [username, setUsername] = useState("")

  const login = () => {
    sessionStorage.setItem("username", username)
    window.location.href = "/poker"
  }

  return (
    <Main pad="large" align={"center"}>
      <Box>
        <Heading>"Hi"</Heading>
        <TextInput icon={<User/>} placeholder="Username" autoFocus={true} disabled={false}
                   onChange={e => setUsername(e.target.value)}/>
        <Button onClick={login} disabled={false} margin={"xsmall"} primary={true} icon={<Login/>} label={"Login"}/>
      </Box>
    </Main>
  )
}