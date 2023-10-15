import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {IUser} from '../../../models/response/IUser'
import AuthService from '../../../services/authService'
import axios, {AxiosError} from 'axios'
import {AuthResponse, registerAuthResponse} from '../../../models/response/AuthResponse'
import {API_URL} from '../../../http'
import UserService from '../../../services/userService'

interface authState {
    user: IUser
    isAuth: boolean
    isLoading: boolean
}

interface loginThunkArgs {
    email: string
    password: string
}

interface registerThunkArgs {
    email: string
    password: string
    firstName: string
    secondName: string
}

interface AxiosSignInErrorDataType {
    error: string
}

interface AxiosSignUpErrorDataType {
    error: [{location: string; msg: string; path: string; type: string; value: string}]
}

interface activateThunkArgs {
    activationCode: string
}

const initialState: authState = {
    user: {} as IUser,
    isAuth: false,
    isLoading: !!localStorage.getItem('token')
}

export const signInUser = createAsyncThunk<AuthResponse, loginThunkArgs>('signInUser', async ({email, password}) => {
    try {
        const response = await AuthService.login(email, password)
        return response.data
    } catch (e: unknown) {
        if (axios.isAxiosError<AxiosSignInErrorDataType>(e)) {
            throw new AxiosError(e.response?.data.error || 'Sign in error')
        }

        throw new AxiosError('Sign in error')
    }
})

export const signUpUser = createAsyncThunk<registerAuthResponse, registerThunkArgs>(
    'signUpUser',
    async ({email, password, firstName, secondName}) => {
        try {
            const response = await AuthService.register(email, password, firstName, secondName)
            return response.data
        } catch (e: unknown) {
            if (axios.isAxiosError<AxiosSignUpErrorDataType>(e)) {
                throw new AxiosError(e.response?.data.error[0].msg || 'Sign up error')
            }

            throw new AxiosError('Sign up error')
        }
    }
)

export const checkAuth = createAsyncThunk<AuthResponse>('checkAuth', async () => {
    if (localStorage.getItem('token')) {
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true})
            return response.data
        } catch (e: unknown) {
            if (axios.isAxiosError<AxiosSignInErrorDataType>(e)) {
                throw new AxiosError(e.response?.data.error || 'Auth check error')
            }

            throw new AxiosError('Auth check error')
        }
    } else {
        throw new AxiosError('No access token found in local storage')
    }
})

export const activateAuth = createAsyncThunk<registerAuthResponse, activateThunkArgs>(
    'activateAuth',
    async ({activationCode}) => {
        try {
            const response = await axios.get<registerAuthResponse>(`${API_URL}/activate/${activationCode}`)
            return response.data
        } catch (e: unknown) {
            if (axios.isAxiosError<AxiosSignInErrorDataType>(e)) {
                throw new AxiosError(e.response?.data.error || 'Code activation error')
            }

            throw new AxiosError('Code activation error')
        }
    }
)

export const updateProfile = createAsyncThunk<IUser, FormData>('updateProfile', async (form) => {
    try {
        const response = await UserService.updateProfile(form)
        return response.data
    } catch (e: unknown) {
        if (axios.isAxiosError<AxiosSignInErrorDataType>(e)) {
            throw new AxiosError(e.response?.data.error || 'Updating profile error')
        }

        throw new AxiosError('Updating profile error')
    }
})

export const logout = createAsyncThunk('logout', async () => {
    try {
        await AuthService.logout()
    } catch (e) {
        console.log(e)
    }
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<boolean>) => {
            state.isAuth = action.payload
        },
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        }
    },
    extraReducers: (builder) => {
        builder

            //SignUp
            .addCase(signUpUser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(signUpUser.fulfilled, (state, action) => {
                localStorage.setItem('token', action.payload.accessToken)
                state.isAuth = true
                state.isLoading = false
                state.user = action.payload.user
            })
            .addCase(signUpUser.rejected, (state) => {
                state.isLoading = false
            })

            //SignIn
            .addCase(signInUser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(signInUser.fulfilled, (state, action) => {
                localStorage.setItem('token', action.payload.accessToken)
                state.isAuth = true
                state.isLoading = false
                state.user = action.payload.user
            })
            .addCase(signInUser.rejected, (state) => {
                state.isLoading = false
            })

            //logout
            .addCase(logout.pending, (state) => {
                state.isLoading = true
            })
            .addCase(logout.fulfilled, (state) => {
                localStorage.removeItem('token')
                state.isLoading = false
                state.isAuth = false
                state.user = initialState.user
            })

            //checkAuth
            .addCase(checkAuth.pending, (state) => {
                if (localStorage.getItem('token')) state.isLoading = true
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                localStorage.setItem('token', action.payload.accessToken)
                state.user = action.payload.user
                state.isLoading = false
                state.isAuth = true
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isLoading = false
            })

            //activate
            .addCase(activateAuth.pending, (state) => {
                state.isLoading = true
            })
            .addCase(activateAuth.fulfilled, (state) => {
                state.isLoading = false

                if (state.user) state.user.isActivated = true
            })
            .addCase(activateAuth.rejected, (state) => {
                state.isLoading = false
            })

            //update profile
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = action.payload
            })
    }
})

export const authReducer = authSlice.reducer
export const authActions = authSlice.actions
