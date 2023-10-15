import styles from './UsersList.module.scss'
import {IUser} from '../../../../models/response/IUser.ts'
import {Link, useParams} from 'react-router-dom'
import {STATIC_URL} from '../../../../http/index.ts'

interface UsersListProps {
    users: IUser[]
}

function UsersList({users}: UsersListProps) {
    const {userId} = useParams()

    return (
        <div className={styles.usersContainer}>
            {users.map((user) => (
                <Link
                    className={[styles.user, user._id == userId ? styles.selected : ''].join(' ')}
                    key={user._id}
                    to={`/chat/${user._id}`}
                >
                    <img src={`${STATIC_URL}${user.avatarImage}`} alt='avatar' />
                    <div>{`${user.firstName}`}</div>
                </Link>
            ))}
        </div>
    )
}

export default UsersList
