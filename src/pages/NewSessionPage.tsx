import React, {useEffect, useState} from "react";
import {v4 as uuid} from "uuid";
import {Box, Button, Heading, Text} from "grommet/es6";
import {Client} from "@stomp/stompjs";
import {NavHeader} from "../components/NavHeader";
import {AddCircle} from "grommet-icons/es6";

export const NewSessionPage = () => {
  const [link, setLink] = useState("Hier könnten ihre Werbung stehen")
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [successDisabled, setSuccessDisabled] = useState(true)
  const topicCommand = "/topic/go_stomp_command"
  const client = new Client({
    brokerURL: process.env["REACT_APP_WEBSOCKET_HOST"]!,
    connectHeaders: {
      login: process.env["REACT_APP_RABBITMQ_USER"]!,
      passcode: process.env["REACT_APP_RABBITMQ_PASS"]!,
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
    setButtonDisabled(true)
    const sessionId = uuid()
    client.publish({
      destination: topicCommand,
      body: JSON.stringify({cmd: "CREATE_SESSION", sessionId: sessionId, user: ""})
    })
    console.log("send command NEW_SESSION with sessionId", sessionId)
    setLink(`/poker/${sessionId}`)
    setSuccessDisabled(false)
  }

  return (
    <Box>
      <NavHeader
        loginDisabled={true}
        resetVotingsDisabled={true}
        revealDisabled={true}
        resetUsersDisabled={true}/>
      <Box align={"center"} pad={"large"}>
        <Heading>Click Create to generate a new Annapoker Session</Heading>
        <Button primary
                className={"newsession-button"}
                size={"medium"}
                icon={<AddCircle/>}
                label={"Create"}
                onClick={newSession}
                margin={"large"}
                disabled={buttonDisabled}/>
        <Text size={"xxlarge"} color={"status-ok"} margin={"medium"} hidden={successDisabled}>Success!</Text>
        <Text size={"xxlarge"} hidden={successDisabled}><a href={link} target={"_top"}>Open Session in new
          Tab</a></Text>
      </Box>
    </Box>
  )
}