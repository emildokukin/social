import styles from './MainTemplate.module.scss'
import {ReactNode} from 'react'
import type {} from 'redux-thunk/extend-redux'
import Header from '../header/Header'
import SideMenu from '../side-menu/SideMenu'

interface MainTemplateProps {
    children: ReactNode
}

function MainTemplate({children}: MainTemplateProps) {
    return (
        <>
            <Header />
            <div className={styles.contentContainer}>
                <SideMenu />
                {children}
            </div>
        </>
    )
}

export default MainTemplate
