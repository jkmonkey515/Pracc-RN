import {ReplaySubject, Subject} from "rxjs";

class WebsocketManager {
    reconnect = true
    connected = null
    pendingMessages = []
    socket = null
    emitter = new Subject()
    connectionStatus = new ReplaySubject(1)

    constructor(endpoint) {
        this.endpoint = endpoint
        this.setConnected(false)
    }

    connect() {
        this.reconnect = true
        this.updateSocket()
    }

    disconnect() {
        this.reconnect = false
        if (this.socket) {
            this.socket.close()
        }
    }

    subscribeConnectionStatus(cb) {
        return this.connectionStatus.subscribe(cb)
    }

    subscribe(cb) {
        return this.emitter.subscribe(cb)
    }

    sendRaw(message) {
        if (!this.connected || !this.socket) {
            this.pendingMessages.push(message)
        } else {
            this.socket.send(message)
        }
    }

    send(type, payload) {
        const message = JSON.stringify({
            Type: type,
            Payload: payload,
        })
        this.sendRaw(message)
    }

    setConnected(newValue) {
        if (this.connected === newValue) {
            return
        }

        this.connected = newValue
        this.connectionStatus.next(newValue)
    }

    updateSocket() {
        if (this.socket !== null) {
            return
        }

        this.socket = new WebSocket(this.endpoint)
        this.setConnected(false)

        this.socket.onopen = () => {
            this.setConnected(true)

            for (const data of this.pendingMessages) {
                this.socket.send(data)
            }
            this.pendingMessages = []
        }
        this.socket.onclose = (e) => {
            this.setConnected(false)

            if (e.code === 401 || !this.reconnect) {
                this.socket = null

                return;
            }

            setTimeout(() => {
                this.socket = null
                this.updateSocket()
            }, 5000)
        }
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data)
            this.emitter.next(data)
        }
    }
}

export default WebsocketManager
