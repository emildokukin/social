import $api from "../http"
import {AxiosResponse} from "axios"
import {AuthResponse, registerAuthResponse} from "../models/response/AuthResponse";

export default class AuthService {

    static login(email: string, password: string): Promise<AxiosResponse<AuthResponse>>{
        return $api.post<AuthResponse>('/login', { email, password })
    }

    static register(email: string, password: string, firstName: string, secondName: string): Promise<AxiosResponse<registerAuthResponse>>{
        return $api.post<registerAuthResponse>('/registration', { email, password, firstName, secondName }, {withCredentials: true})
    }

    static logout(): Promise<void>{
        return $api.post('/logout')
    }

}