// import { Socket } from 'socket.io-client'
import { SocketAction, SocketActionType } from '@quick-prose/shared'

interface APIProps {
  API_URL: string
  getAuthorization?: () => string
  socket: SocketIOClient.Socket
}

export class APIProvider {

  API_URL: string = ''
  socket: SocketIOClient.Socket | null = null

  getAuthorization: () => string = () => ''

  constructor(props?: APIProps) {
    this.API_URL = props?.API_URL ?? ''
    this.socket = props?.socket ?? null
    this.getAuthorization = props?.getAuthorization ?? (() => '')
  }

  // setURL(url: string) {
  //   this.API_URL = url
  // }

  // setAuthorization(fn: () => string) {
  //   this.getAuthorization = fn
  // }

  // setSocket(socket: SocketIOClient.Socket) {
  //   this.socket = socket
  // }

  async get<T>(path: string, defaultError = 'Request failed'): Promise<T> {
    const resp = await fetch(`${this.API_URL}/${path}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.getAuthorization()
      },
    })
    const data = await resp.json()
    if (!resp.ok) {
      throw Error(data?.message || defaultError)
    }
    return data
  }
  
  async post<T>(path: string, payload: any, defaultError = 'Request failed'): Promise<T> {
    const resp = await fetch(`${this.API_URL}/${path}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.getAuthorization()
      },
      body: JSON.stringify(payload)
    })
    const data = await resp.json()
    if (!resp.ok) {
      throw Error(data?.message || defaultError)
    }
    return data
  }
  
  async put<T>(path: string, payload: any, defaultError = 'Request failed'): Promise<T> {
    const resp = await fetch(`${this.API_URL}/${path}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.getAuthorization()
      },
      body: JSON.stringify(payload)
    })
    const data = await resp.json()
    if (!resp.ok) {
      throw Error(data?.message || defaultError)
    }
    return data
  }

  async del<T>(path: string, defaultError = 'Request failed'): Promise<T> {
    const resp = await fetch(`${this.API_URL}/${path}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.getAuthorization()
      },
    })
    const data = await resp.json()
    if (!resp.ok) {
      throw Error(data?.message || defaultError)
    }
    return data
  }

  emit(path: string, action: SocketAction) {
    return new Promise((resolve, reject) => {
      this.socket?.emit(action.type, action, (data: any) => {
        resolve(data)
      })
    })
  }

  on(actionType: SocketActionType, fn: (data: any) => void) {
    this.socket?.on(actionType, fn)
  }

  off(actionType: SocketActionType, fn: (data: any) => void) {
    this.socket?.off(actionType, fn)
  }
}
