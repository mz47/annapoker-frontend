export interface GoCommand {
  cmd: string,
  user: string,
  data?: User,
  sessionId: string,
}

export interface GoBroadcast {
  type: string,
  data: User[],
  timestamp?: string
}

export interface User {
  uuid: string,
  username: string,
  voting?: number,
}