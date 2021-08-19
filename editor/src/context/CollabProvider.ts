import { getVersion, sendableSteps } from 'prosemirror-collab'
import { APIProvider } from './APIProvider'
import { EditorViewProvider } from './EditorViewProvider'

import {
  ISaveCollabStepsParams, INewStepsResponse,
  ECollabActionType, ICollabJoinAction, ICollabLeaveAction, ICollabEditAction
} from '@quick-prose/shared'

interface Config {
  documentId: string
  userId: string
}

export class CollabProvider {

  config?: Config
  debounceTimeoutId: number | null = null
  apiProvider: APIProvider
  editorViewProvider: EditorViewProvider
  
  constructor(apiProvider: APIProvider, editorViewProvider: EditorViewProvider) {
    this.apiProvider = apiProvider
    this.editorViewProvider = editorViewProvider
  }

  get documentId() {
    return this.config?.documentId || ''
  }

  get userId() {
    return this.config?.userId || ''
  }

  get URL() {
    return `document/${this.documentId}/steps`
  }

  setConfig(config: Config) {
    this.config = config
  }

  debounceSendSteps(fn: () => void) {
    if (this.debounceTimeoutId) {
      clearTimeout(this.debounceTimeoutId)
    }
    this.debounceTimeoutId = window.setTimeout(() => {
      fn()
      this.debounceTimeoutId = null
    }, 250)
  }

  async joinCollabSession() {
    const action: ICollabJoinAction = {
      type: ECollabActionType.COLLAB_JOIN,
      payload: {
        documentId: this.documentId,
        userId: this.userId,
      }
    }
    const initialData = await this.apiProvider.emit(this.URL, action)
    // TODO should include the initial doc, version and current users
    console.log(initialData)
    this.apiProvider.on(ECollabActionType.COLLAB_EDIT, this.onReceiveSteps)
  }

  async leaveCollabSession() {
    const action: ICollabLeaveAction = {
      type: ECollabActionType.COLLAB_LEAVE,
      payload: {
        documentId: this.documentId,
        userId: this.userId,
      }
    }
    await this.apiProvider.emit(this.URL, action)
    this.apiProvider.off(ECollabActionType.COLLAB_EDIT, this.onReceiveSteps)
  }

  //  send(tr: Transaction, _oldState: EditorState, newState: EditorState) {
  //   // Ignore transactions without steps
  //   if (!tr.steps || !tr.steps.length) {
  //     return;
  //   }
  //   this.channel.sendSteps(newState, this.getState);
  // }

  sendSteps(params: ISaveCollabStepsParams) {
    // const sendable = sendableSteps(newState)
    // if (sendable) {
    //   // TODO hackz
    //   const clientID = sendable.clientID as number
    //   const { version } = await sendSteps({
    //     ...sendable,
    //     clientID,
    //     version: collabVersion
    //   })
    //   if (version) collabVersion = version
    // }
    this.debounceSendSteps(() => {
      const action: ICollabEditAction = {
        type: ECollabActionType.COLLAB_EDIT,
        payload: { ...params }
      }
      this.apiProvider.emit(this.URL, action)
    })
  }

  async sendSteps(state: any, getState: () => any, localSteps?: Array<Step>) {
    if (this.isSending) {
      this.debounceSendSteps(getState);
      return;
    }

    const version = getVersion(state);

    // Don't send any steps before we're ready.
    if (typeof version === undefined) {
      return;
    }

    const { steps }: { steps: Array<Step> } = localSteps ||
      (sendableSteps(state) as any) || { steps: [] }; // sendableSteps can return null..

    if (steps.length === 0) {
      logger(`No steps to send. Aborting.`);
      return;
    }

    this.isSending = true;
  }

  sendCursorSelection() {

  }

  onReceiveSteps(data: INewStepsResponse) {
    const state = this.editorViewProvider.editorView.state
    const currentVersion = getVersion(state)
    const expectedVersion = currentVersion + data.steps.length

    // const { editorView } = viewProvider
    // let tr = receiveTransaction(
    //   editorView.state,
    //   data.steps.map(j => Step.fromJSON(editorView.state.schema, j)),
    //   data.clientIDs
    // )
    // editorView.dispatch(tr)
    // collabVersion = data.version
  }

  destroy() {
    
  }
}