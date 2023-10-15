import {IUserSubs} from '../../../services/userService'
import styles from './SearchList.module.scss'
import {Link, useNavigate} from 'react-router-dom'
import sendSvg from '../../../assets/send.svg'
import {STATIC_URL} from '../../../http'

interface SearchListProps {
    users: IUserSubs[]
    isVisible: boolean
    switchSubscribe: (userId: string, isSubscribed: boolean) => void
}

function SearchList({users, isVisible, switchSubscribe}: SearchListProps) {
    const navigate = useNavigate()

    return (
        isVisible && (
            <ul className={styles.container} onMouseDown={(e) => e.preventDefault()}>
                {users.map((user) => (
                    <li key={user._id}>
                        <Link to={`/profile/${user._id || ''}`} className={styles.userInfo}>
                            <img src={`${STATIC_URL}${user.avatarImage}`} alt='avatar' />
                            <span>{user.firstName} {user.secondName}</span>
                        </Link>
                        <div className={styles.userInteract}>
                            <button onClick={() => switchSubscribe(user._id, user.isSubscribing)}>
                                {user.isSubscribing ? 'Unsubscribe' : 'Subscribe'}
                            </button>
                            <img
                                className={styles.sendMessage}
                                onClick={() => navigate(`/chat/${user._id}`)}
                                src={sendSvg}
                                alt='send'
                            />
                        </div>
                    </li>
                ))}
            </ul>
        )
    )
}

export default SearchList
