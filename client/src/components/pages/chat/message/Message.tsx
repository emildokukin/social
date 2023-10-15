import { IMessage } from '../../../../models/IMessage'
import styles from './Message.module.scss'

interface MessageProps {
    message: IMessage
    isReceivedMessage: boolean
}

function Message({message, isReceivedMessage}: MessageProps) {
    const textMessage = message.text ? message.text : ''
    const timeFromDate = (date: Date) => `${date.getHours()}:${date.getMinutes()}`

    return (
        <li
            className={[
                styles.message,
                textMessage.length >= 54 ? (isReceivedMessage ? styles.multiLinedReceived : styles.multiLinedSent) : '',
                isReceivedMessage ? styles.receivedMessage : styles.sentMessage
            ].join(' ')}
        >
            {isReceivedMessage ? (
                <>
                    <p>{message.text}</p>
                    <span>{timeFromDate(new Date(message.createdAt))}</span>
                </>
            ) : (
                <>
                    <span>{timeFromDate(new Date(message.createdAt))}</span>
                    <p>{message.text}</p>
                </>
            )}
        </li>
    )
}

export default Message
