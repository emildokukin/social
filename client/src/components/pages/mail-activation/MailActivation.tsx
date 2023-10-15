import type {} from 'redux-thunk/extend-redux'
import {FormEvent, useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {activateAuth} from '../../../store/features/auth'
import {AxiosError} from 'axios'
import {useParams} from 'react-router-dom'

function MailActivation() {
    const [activationCode, setActivationCode] = useState<string>('')
    const dispatch = useDispatch()
    const {error} = useParams()

    useEffect(() => {
        if (error === 'error') alert('Invalid activation link. Try to use code to activate your account.')
    }, [error])

    function activate(e: FormEvent) {
        e.preventDefault()

        void dispatch(activateAuth({activationCode}))
            .unwrap()
            .catch((err: AxiosError) => {
                alert(err.message)
            })
    }

    return (
        <div>
            <h1>Follow the link in the letter to the specified mail or enter the code from the letter</h1>

            <input
                type='text'
                placeholder='Activation code'
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value)}
            />
            <button onClick={(e: FormEvent) => activate(e)}>Activate account</button>
        </div>
    )
}

export default MailActivation
