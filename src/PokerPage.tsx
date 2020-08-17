import React, {useEffect, useReducer, useState} from 'react';
import './App.css';
import {Box, Button, Header, Heading} from "grommet/es6";
import {AddCircle, Login, Refresh, Trash, View} from "grommet-icons/es6";
import {Client} from '@stomp/stompjs';
import {v4 as uuid} from 'uuid';
import {ResultList} from "./ResultList";
import {GoBroadcast, GoCommand, User} from "./models/models";
import {LoginLayer} from "./components/LoginLayer";

const client = new Client({
  brokerURL: "ws://localhost:15674/ws",
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

const topicCommand = "/topic/go_stomp_command"
const topicBroadcast = "/topic/go_stomp_broadcast"
const userUuid = uuid()
const pokerCards = [1, 2, 3, 5, 8, 13, 20, 40, 100]

export const PokerPage = () => {
  const [showLogin, setShowLogin] = useState(true)
  const [isNotLoggedIn, setIsNotLoggedIn] = useState(true)
  const [loginDisabled, setLoginDisabled] = useState(false)
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
    client.onConnect = () => {
      client.subscribe(topicBroadcast + ".4711", message => {
        let broadcast: GoBroadcast = JSON.parse(message.body)
        console.log("received broadcast:", broadcast)
        dispatchUsers(broadcast)
        if (broadcast.type === "REVEAL_VOTINGS") {
          setForceReveal(true)
        }
        if (broadcast.type === "RESET_VOTINGS") {
          setForceReveal(true)
          setVotingDisabled(false)
        }
      })
      client.publish({
        destination: topicCommand,
        body: JSON.stringify({cmd: "GET_USERS", user: username, options: ""})
      })
    }
    client.activate()
  }, [])

  const toggleLogin = () => {
    setLoginDisabled(true)
    setIsNotLoggedIn(false)
    setVotingDisabled(false)
  }

  const vote = (value: number) => {
    let updateVoteCmd: GoCommand = {
      cmd: "UPDATE_VOTING",
      user: username,
      data: {uuid: userUuid, username: username, voting: value},
      sessionId: "4711"
    }
    client.publish({destination: topicCommand, body: JSON.stringify(updateVoteCmd)})
    console.log("sent command:", updateVoteCmd)
    setVotingDisabled(true)
  }

  const resetVotings = () => {
    let resetCmd: GoCommand = {cmd: "RESET_VOTINGS", user: username, sessionId: "4711"}
    client.publish({destination: topicCommand, body: JSON.stringify(resetCmd)})
  }

  const resetUsers = () => {
    let resetCmd: GoCommand = {cmd: "RESET_USERS", user: username, sessionId: "4711"}
    client.publish({destination: topicCommand, body: JSON.stringify(resetCmd)})
  }

  const showLoginLayer = () => {
    setShowLogin(true)
  }

  const onVoteHandler = (username: string) => {
    setUsername(username)
    setShowLogin(false)
    let saveUserCmd: GoCommand = {
      cmd: "SAVE_USER",
      user: username,
      data: {uuid: userUuid, username: username, voting: 0},
      sessionId: "4711"
    }
    client.publish({destination: topicCommand, body: JSON.stringify(saveUserCmd)})
    console.log("sent command:", saveUserCmd)
    toggleLogin()
  }

  const onWatchHandler = (username: string) => {
    setUsername(username)
    setShowLogin(false)
    setVotingDisabled(true)
    setIsNotLoggedIn(false)
  }

  const onEscHandler = () => {
    setShowLogin(false)
  }

  const onOutsideClickHandler = () => {
    setShowLogin(false)
  }

  return (
    <Box>
      {showLogin ? <LoginLayer
        onVoteHandler={onVoteHandler}
        onWatchHandler={onWatchHandler}
        onEscHandler={onEscHandler}
        onOutsideClickHandler={onOutsideClickHandler}
      /> : ""}

      <Header background={"brand"} justify={"start"}>
        <Heading margin={"small"}>Annapoker</Heading>
        <Button disabled icon={<AddCircle/>} hoverIndicator/>
        <Button icon={<Login/>} onClick={showLoginLayer}/>
        <span>Session Controls:</span>
        <Button icon={<View/>} disabled={isNotLoggedIn} onClick={() => setForceReveal(prevState => !prevState)}
                hoverIndicator/>
        <Button icon={<Refresh/>} disabled={isNotLoggedIn} onClick={resetVotings} hoverIndicator/>
        <Button icon={<Trash/>} disabled={isNotLoggedIn} onClick={resetUsers} hoverIndicator/>
      </Header>
      <Box align={"center"} pad={"small"}>
        <Heading>{`Hi ${username}`}</Heading>
        <Box align={"center"} direction={"row"}>
          {pokerCards.map(c => <Button size={"large"} margin={"xsmall"} className={"pokercard"} primary
                                       onClick={() => vote(c)} key={c} disabled={votingDisabled} label={c}/>)}
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
