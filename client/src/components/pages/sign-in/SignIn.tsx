import styles from './SignInUp.module.scss'
import {signInUser} from '../../../store/features/auth'
import {useAppDispatch} from '../../../store/store'
import {FormEvent, useState} from 'react'
import type {} from 'redux-thunk/extend-redux'
import {Link} from 'react-router-dom'
import {AxiosError} from 'axios'

function SignIn() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const dispatch = useAppDispatch()
    const signIn = (e: FormEvent) => {
        e.preventDefault()

        void dispatch(signInUser({email, password}))
            .unwrap()
            .catch((err: AxiosError) => {
                alert(err.message)
            })
    }

    return (
        <div className={styles.signInContainer}>
            <div className={styles.signInInnerContainer}>
                <form>
                    <h1>Sign in</h1>

                    <input type='text' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className={styles.signInUpContainer}>
                        <button onClick={(e: FormEvent) => signIn(e)}>Sign In</button>
                        <Link to={'/signUp'}>Sign Up</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignIn
