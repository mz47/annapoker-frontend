import React, {useEffect, useState} from "react";
import {v4 as uuid} from "uuid";
import {Box, Button, Text} from "grommet/es6";
import {Client} from "@stomp/stompjs";
import {NavHeader} from "../components/NavHeader";
import {AddCircle} from "grommet-icons/es6";

export const NewSessionPage = () => {
  const [link, setLink] = useState("")

  const topicCommand = "/topic/go_stomp_command"
  const client = new Client({
    brokerURL: process.env["REACT_APP_WEBSOCKET_HOST"],
    connectHeaders: {
      login: "guest",
      passcode: "guest"
    },
    debug: function (str) {
      //console.log(str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  })

  useEffect(() => {
    client.activate()
  }, [])

  const newSession = () => {
    const sessionId = uuid()
    client.publish({
      destination: topicCommand,
      body: JSON.stringify({cmd: "CREATE_SESSION", sessionId: sessionId, user: ""})
    })
    console.log("send command NEW_SESSION with sessionId", sessionId)
    setLink(`/poker/${sessionId}`)
  }

  return (
    <Box>
      <NavHeader
        loginDisabled={true}
        resetVotingsDisabled={true}
        revealDisabled={true}
        resetUsersDisabled={true}/>
      <Box align={"center"} pad={"medium"}>
        <Text size={"medium"}>Click Create to generate a new Annapoker Session</Text>
        <Button size={"medium"} icon={<AddCircle/>} label={"New Session"} onClick={newSession} margin={"medium"}/>
        <Box direction={"row"} pad={"small"} width={"large"}>
          <a href={link}>{link}</a>
        </Box>
      </Box>
    </Box>
  )
}