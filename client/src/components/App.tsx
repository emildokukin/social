import './App.scss'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import SignIn from './pages/sign-in/SignIn'
import {useAppSelector, useAppDispatch} from '../store/store.ts'
import Feed from './pages/feed/Feed.tsx'
import {ReactNode, useEffect} from 'react'
import {checkAuth} from '../store/features/auth'
import SignUp from './pages/sign-in/SignUp.tsx'
import MailActivation from './pages/mail-activation/MailActivation.tsx'
import MainTemplate from './template/MainTemplate'
import Chat from './pages/chat/Chat'
import Profile from './pages/profile/Profile.tsx'

interface AuthProtectedProps {
    isAuth: boolean
    isActivated: boolean
    children: ReactNode
}

function AuthProtected({isAuth, isActivated, children}: AuthProtectedProps) {
    if (!isAuth) {
        return <Navigate to='/signIn' replace />
    }

    if (isAuth && !isActivated) {
        return <Navigate to='/activate' replace />
    }

    return <MainTemplate>{children}</MainTemplate>
}

function App() {
    const dispatch = useAppDispatch()

    const {isAuth, isLoading} = useAppSelector((state) => state.auth)

    const isActivated = useAppSelector((state) => state.auth.user.isActivated)

    useEffect(() => {
        if (localStorage.getItem('token')) {
            try {
                void dispatch(checkAuth())
            } catch (e) {
                console.log(e)
            }
        }
    }, [])

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <Router>
            <Routes>
                <Route path='/signIn' element={isAuth ? <Navigate to={'-1'} /> : <SignIn />} />
                <Route path='/signUp' element={isAuth ? <Navigate to={'-1'} /> : <SignUp />} />

                <Route path={'/activate'}>
                    <Route index element={isAuth && !isActivated ? <MailActivation /> : <Navigate to={'-1'} />} />
                    <Route
                        path=':error'
                        element={isAuth && !isActivated ? <MailActivation /> : <Navigate to={'-1'} />}
                    />
                </Route>

                <Route
                    path='/feed'
                    element={
                        <AuthProtected isAuth={isAuth} isActivated={isActivated}>
                            <Feed />
                        </AuthProtected>
                    }
                />
                <Route
                    path='/chat/:userId?'
                    element={
                        <AuthProtected isAuth={isAuth} isActivated={isActivated}>
                            <Chat />
                        </AuthProtected>
                    }
                />
                <Route
                    path='/profile/:userId?'
                    element={
                        <AuthProtected isAuth={isAuth} isActivated={isActivated}>
                            <Profile />
                        </AuthProtected>
                    }
                />

                <Route path='*' element={<Navigate to='/feed' replace />} />
            </Routes>
        </Router>
    )
}

export default App
