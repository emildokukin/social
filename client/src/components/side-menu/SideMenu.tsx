import styles from './SideMenu.module.scss'
import {NavLink} from 'react-router-dom'

function SideMenu() {
    return (
        <nav className={styles.container}>
            <NavLink to='/feed' className={({isActive}) => (isActive ? styles.active : '')}>
                Feed
            </NavLink>
            <NavLink to='/chat' className={({isActive}) => (isActive ? styles.active : '')}>
                Messages
            </NavLink>
        </nav>
    )
}

export default SideMenu
