import React, {useEffect, useReducer, useState} from 'react';
import {Box, Heading} from "grommet/es6";
import {Client} from '@stomp/stompjs';
import {v4 as uuid} from 'uuid';
import {ResultList} from "../components/ResultList";
import {GoBroadcast, GoCommand, User} from "../models/models";
import {LoginLayer} from "../components/LoginLayer";
import {useParams} from 'react-router-dom'
import {NavHeader} from "../components/NavHeader";
import {PokerCard} from "../components/PokerCard";

const client = new Client({
  brokerURL: process.env["REACT_APP_WEBSOCKET_HOST"],
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

const topicCommand = "/topic/go_stomp_command"
const topicBroadcast = "/topic/go_stomp_broadcast"
const pokerCards = [1, 2, 3, 5, 8, 13, 20, 40, 100]
let userUuid = uuid()

export const PokerPage = () => {
  const {sessionId} = useParams()
  const [welcomeMessage, setWelcomeMessage] = useState("Hi")
  const [loginLayerVisible, setLoginLayerVisible] = useState(true)
  const [loginDisabled, setLoginDisabled] = useState(false)
  const [revealDisabled, setRevealDisabled] = useState(true)
  const [resetVotingsDisabled, setResetVotingsDisabled] = useState(true)
  const [votingDisabled, setVotingDisabled] = useState(true)
  const [username, setUsername] = useState("")
  const [users, dispatchUsers] = useReducer((current: User[], broadcast: GoBroadcast) => {
    if (broadcast.type === "GET_USERS") {
      return broadcast.data
    }
    if (broadcast.type === "UPDATE_USERS") {
      return broadcast.data
    }
    return current
  }, [])
  const [forceReveal, setForceReveal] = useState(false)

  useEffect(() => {
    checkIfUserIsAlreadyLoggedIn()
    client.onConnect = () => {
      client.subscribe(topicBroadcast + "." + sessionId, message => {
        let broadcast: GoBroadcast = JSON.parse(message.body)
        console.log("received broadcast:", broadcast)
        dispatchUsers(broadcast)
        if (broadcast.type === "REVEAL_VOTINGS") {
          setForceReveal(true)
        }
        if (broadcast.type === "UPDATE_USERS") {
          setVotingDisabled(false)
          setForceReveal(false)
        }
      })
      client.publish({
        destination: topicCommand,
        body: JSON.stringify({cmd: "GET_USERS", user: username, sessionId: sessionId})
      })
    }
    client.activate()
  }, [])

  const checkIfUserIsAlreadyLoggedIn = () => {
    const lastSession = sessionStorage.getItem("sessionId")
    const lastUsername = sessionStorage.getItem("username")
    const lastUserUuid = sessionStorage.getItem("userUuid")
    if (lastSession === sessionId && lastUsername !== null && lastUserUuid !== null) {
      console.log("revisiting session as", lastUsername)
      setUsername(lastUsername)
      userUuid = lastUserUuid
      setWelcomeMessage("Welcome back")
      setLoginLayerVisible(false)
      setRevealDisabled(false)
      setResetVotingsDisabled(false)
      setLoginDisabled(true)
      setVotingDisabled(false)
    }
  }

  const vote = (value: number) => {
    let updateVoteCmd: GoCommand = {
      cmd: "UPDATE_VOTING",
      user: username,
      data: {uuid: userUuid, username: username, voting: value},
      sessionId: sessionId
    }
    client.publish({destination: topicCommand, body: JSON.stringify(updateVoteCmd)})
    console.log("sent command:", updateVoteCmd)
    setVotingDisabled(true)
  }

  const resetVotings = () => {
    let resetCmd: GoCommand = {cmd: "RESET_VOTINGS", user: username, sessionId: sessionId}
    client.publish({destination: topicCommand, body: JSON.stringify(resetCmd)})
  }

  const onJoinToVote = (username: string) => {
    sessionStorage.setItem("sessionId", sessionId)
    sessionStorage.setItem("username", username)
    sessionStorage.setItem("userUuid", userUuid)
    setUsername(username)
    setLoginLayerVisible(false)
    setRevealDisabled(false)
    setResetVotingsDisabled(false)
    setLoginDisabled(true)
    setVotingDisabled(false)
    let saveUserCmd: GoCommand = {
      cmd: "SAVE_USER",
      user: username,
      data: {uuid: userUuid, username: username, voting: 0},
      sessionId: sessionId
    }
    client.publish({destination: topicCommand, body: JSON.stringify(saveUserCmd)})
    console.log("sent command:", saveUserCmd)
  }

  const onJoinToWatch = (username: string) => {
    sessionStorage.setItem("sessionId", sessionId)
    sessionStorage.setItem("username", username)
    sessionStorage.setItem("userUuid", userUuid)
    setUsername(username)
    setLoginLayerVisible(false)
    setVotingDisabled(true)
    setRevealDisabled(false)
    setResetVotingsDisabled(false)
    setForceReveal(true)
    setLoginDisabled(true)
  }

  return (
    <Box>
      <NavHeader
        loginDisabled={loginDisabled}
        revealDisabled={revealDisabled}
        resetVotingsDisabled={resetVotingsDisabled}
        resetUsersDisabled={true}
        loginHandler={() => setLoginLayerVisible(true)}
        revealHandler={() => setForceReveal(true)}
        resetVotingsHandler={resetVotings}
      />
      {loginLayerVisible ? <LoginLayer
        onVoteHandler={onJoinToVote}
        onWatchHandler={onJoinToWatch}
        onEscHandler={() => setLoginLayerVisible(false)}
        onOutsideClickHandler={() => setLoginLayerVisible(false)}
      /> : ""}
      <Box align={"center"} pad={"small"}>
        <Heading>{`${welcomeMessage} ${username || "..."}!`}</Heading>
        <Box align={"center"} direction={"row"}>
          {pokerCards.map(c => <PokerCard key={c} onClickHandler={() => vote(c)} value={c} disabled={votingDisabled}/>)}
        </Box>
      </Box>
      <Box align={"center"} pad={"small"}>
        <Heading>Users</Heading>
        <Box align={"center"} direction={"row"}>
          <ResultList userUuid={userUuid} data={users} reveal={forceReveal}/>
        </Box>
      </Box>
    </Box>
  );
}

export default PokerPage;