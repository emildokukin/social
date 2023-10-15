import styles from './SignInUp.module.scss'
import type {} from 'redux-thunk/extend-redux'
import {FormEvent, useState} from 'react'
import {Link} from 'react-router-dom'
import {signUpUser} from '../../../store/features/auth/index.ts'
import {useAppDispatch} from '../../../store/store.ts'
import {AxiosError} from 'axios'

function SignUp() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [firstName, setFirstName] = useState<string>('')
    const [secondName, setSecondName] = useState<string>('')

    const dispatch = useAppDispatch()

    function signUp(e: FormEvent) {
        e.preventDefault()
        void dispatch(signUpUser({email, password, firstName, secondName}))
            .unwrap()
            .catch((err: AxiosError) => {
                console.log(err)
                alert(err.message)
            })
    }

    return (
        <div className={styles.signInContainer}>
            <div className={styles.signInInnerContainer}>
                <form>
                    <h1>Sign up</h1>

                    <input type='text' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder='First Name'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder='Second name'
                        value={secondName}
                        onChange={(e) => setSecondName(e.target.value)}
                    />

                    <div className={styles.signInUpContainer}>
                        <button onClick={(e: FormEvent) => signUp(e)}>Sign up</button>
                        <Link to={'/signIn'}>Sign In</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignUp
