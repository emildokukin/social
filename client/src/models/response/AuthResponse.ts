import {IUser} from './IUser'

export interface AuthResponse {
    accessToken: string
    refreshToken: string
    user: IUser
}

export interface registerAuthResponse extends AuthResponse {
    activationCode: string
}
