import { Step } from 'prosemirror-transform'
import { Transaction } from 'prosemirror-state'

declare module '@quick-prose/shared' {
  // SocketAction
  export type SocketAction = CollabAction
  export type SocketActionType = ECollabActionType

  // Collab API
  export interface ISaveCollabStepsParams {
    version: number
    steps: Step[]
    clientID: number
    origins: Transaction[]
  }
  export interface INewStepsResponse {
    version: number
    steps: { [key: string]: any }[]
    clientIDs: number[]
    usersCount: number
  }

  // Collab actions
  export enum ECollabActionType {
    COLLAB_JOIN = 'COLLAB:JOIN',
    COLLAB_LEAVE = 'COLLAB:LEAVE',
    COLLAB_EDIT = 'COLLAB:EDIT',
  }
  export type CollabAction = ICollabJoinAction | ICollabLeaveAction | ICollabEditAction
  export interface ICollabJoinAction {
    type: ECollabActionType.COLLAB_JOIN
    payload: {
      documentId: string
      userId: string
    }
  }
  export interface ICollabLeaveAction {
    type: ECollabActionType.COLLAB_LEAVE
    payload: {
      documentId: string
      userId: string
    }
  }
  export interface ICollabEditAction {
    type: ECollabActionType.COLLAB_EDIT
    payload: {
      version: number
      steps: Step[]
      clientID: number
      origins: Transaction[]
    }
  }
}