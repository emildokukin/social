import {useEffect, useRef} from 'react'

interface onMessage {
    (event: MessageEvent): unknown
}

interface onError {
    (event: Event): unknown
}

export function useSocket(onReceivedMessage: onMessage, onError: onError) {
    const socket = useRef<WebSocket>()

    useEffect(() => {
        socket.current = new WebSocket('ws://localhost:5002', localStorage.getItem('token') || '')
        socket.current.onmessage = onReceivedMessage

        socket.current.onerror = onError

        return () => socket.current?.close()
    }, [onReceivedMessage, onError])

    return socket
}
