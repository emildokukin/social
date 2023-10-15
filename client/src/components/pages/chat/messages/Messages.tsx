import styles from './Messages.module.scss'
import sendSvg from '../../../../assets/send.svg'
import {FormEvent, useEffect, useRef, useState} from 'react'
import {useAppSelector} from '../../../../store/store'
import Message from '../message/Message'
import {useParams} from 'react-router-dom'
import { IMessage } from '../../../../models/IMessage'

interface MessagesProps {
    onSendMessage: (message: IMessage) => void
    messages: IMessage[]
}

function Messages({onSendMessage, messages}: MessagesProps) {
    const [message, setMessage] = useState<string>('')
    const messagesList = useRef<HTMLUListElement>(null)
    const {userId} = useParams()

    const curUser = useAppSelector((state) => state.auth.user)

    useEffect(() => {
        const lastMessage = messagesList.current?.querySelector(`li:last-child`)

        if (!lastMessage) return

        lastMessage.scrollIntoView()
    }, [messages])

    const sendMessage = (e: FormEvent) => {
        e.preventDefault()
        if (!message || !userId) return

        const curMessage = {
            senderId: curUser._id,
            receiverId: userId,
            text: message,
            createdAt: new Date().toString()
        }

        messages.push(curMessage)

        onSendMessage(curMessage)

        setMessage('')
    }

    return (
        <div className={styles.chat}>
            <div className={styles.messagesContainer}>
                {
                    <ul ref={messagesList} className={styles.messagesList}>
                        {messages.length > 0 ? (
                            messages.map((message, index) => {
                                return (
                                    <Message
                                        key={message._id || index}
                                        message={message}
                                        isReceivedMessage={curUser._id !== message.senderId}
                                    />
                                )
                            })
                        ) : (
                            <div>There are no messages yet</div>
                        )}
                    </ul>
                }
            </div>

            <form className={styles.sendMessage} onSubmit={(e) => sendMessage(e)}>
                <input placeholder='Type message...' value={message} onChange={(e) => setMessage(e.target.value)} />
                <button type='submit'>
                    <img src={sendSvg} alt='send' />
                </button>
            </form>
        </div>
    )
}

export default Messages
