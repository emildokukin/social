import {useEffect, useState} from 'react'
import styles from './Chat.module.scss'
import type {} from 'redux-thunk/extend-redux'
import Messages from './messages/Messages'
import UsersList from './users-list/UsersList.tsx'
import UserService from '../../../services/userService.ts'
import {useNavigate, useParams} from 'react-router-dom'
import {IUser} from '../../../models/response/IUser.ts'
import {useSocket} from '../../../hooks/useSocket.ts'
import { IMessage } from '../../../models/IMessage.ts'

function Chat() {
    const navigate = useNavigate()
    const {userId} = useParams()
    const [usersList, setUsersList] = useState<IUser[]>([])
    const [messagesList, setMessagesList] = useState<IMessage[]>([])

    const receivedMessageHandler = (event: MessageEvent<string>) => {
        const data = JSON.parse(event.data) as IMessage

        setMessagesList((prevState) => [
            ...prevState,
            {
                senderId: data.senderId,
                receiverId: data.receiverId,
                text: data.text,
                createdAt: new Date().toString()
            }
        ])

        if (!usersList.find((user) => user._id === data.senderId)) {
            void UserService.getUserById(data.senderId).then((user) => {
                setUsersList([user.data, ...usersList])
            })
        }
    }

    const errorHandler = (err: Event) => {
        console.log(err)
    }

    const socket = useSocket(receivedMessageHandler, errorHandler)

    useEffect(() => {
        if (userId) {
            void UserService.getMessages(userId)
                .then((res) => {
                    setMessagesList(res.data)
                })
                .catch(() => {
                    navigate('/chat')
                })
        }

        UserService.getChatUsers()
            .then((chatUsers) => {
                setUsersList(chatUsers.data)

                if (!userId) return

                if (chatUsers.data.find((user) => user._id === userId)) return

                void UserService.getUserById(userId).then((user) => {
                    setUsersList((curList) => [user.data, ...curList])
                })
            })
            .catch(() => {
                navigate('/chat')
            })
    }, [userId])

    const onSendMessage = (message: IMessage) => {
        socket.current?.send(JSON.stringify(message))
    }

    return (
        <div className={styles.container}>
            <UsersList users={usersList} />
            {userId ? (
                <Messages messages={messagesList} onSendMessage={onSendMessage} />
            ) : usersList.length > 0 ? (
                <div>Please, select the chat</div>
            ) : (
                <div>You haven't started any dialogs yet</div>
            )}
        </div>
    )
}

export default Chat
