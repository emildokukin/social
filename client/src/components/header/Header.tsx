import styles from './Header.module.scss'
import {Link, useNavigate} from 'react-router-dom'
import {useAppDispatch, useAppSelector} from '../../store/store'
import {ChangeEvent, FormEvent, useState} from 'react'
import {logout} from '../../store/features/auth'
import SearchList from './people-search/SearchList'
import UserService, {IUserSubs} from '../../services/userService'
import {STATIC_URL} from '../../http'

function Header() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [searchText, setSearchText] = useState('')
    const [searchListVisible, setSearchListVisible] = useState(false)
    const [usersInSearch, setUsersInSearch] = useState<IUserSubs[]>([])

    const curUser = useAppSelector((state) => state.auth.user)

    const logoutUser = (e: FormEvent) => {
        e.preventDefault()
        dispatch(logout()).catch(() => {
            console.log('Logout error')
        })

        navigate('/signIn')
    }

    //заюзать хук мега крутого чела с ютуба
    const onSearchInputType = async (e: ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value)

        if (e.target.value) {
            const users = await UserService.getUsersWithSubsCheck(e.target.value)

            setUsersInSearch(users.data)
        }
    }

    const switchSubscribe = async (userId: string, isSubscribed: boolean) => {
        if (isSubscribed) {
            await UserService.unsubscribe(userId)
        } else {
            await UserService.subscribe(userId)
        }

        setUsersInSearch((usersPrev) => {
            const user = usersPrev.find((user) => user._id === userId)

            if (user) user.isSubscribing = !user.isSubscribing

            return [...usersPrev]
        })
    }

    return (
        <header>
            <div className={styles.container}>
                <Link to={'/feed'} className={styles.logo}>
                    Pyankoff
                </Link>
                <div className={styles.searchField}>
                    <input
                        value={searchText}
                        onFocus={() => setSearchListVisible(true)}
                        onBlur={() => setSearchListVisible(false)}
                        onChange={(e) => onSearchInputType(e)}
                        type='text'
                        placeholder='Search'
                    />
                    {usersInSearch.length > 0 && searchText && (
                        <SearchList
                            users={usersInSearch}
                            isVisible={searchListVisible}
                            switchSubscribe={switchSubscribe}
                        />
                    )}
                </div>
                <div className={styles.profile}>
                    <Link className={styles.userInfo} to={'/profile'}>
                        <span>Hi, {curUser.firstName}!</span>
                        <img src={`${STATIC_URL}${curUser.avatarImage}`} alt='human' />
                    </Link>

                    <span className={styles.logout} onClick={logoutUser}>
                        Logout
                    </span>
                </div>
            </div>
        </header>
    )
}

export default Header
