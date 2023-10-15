import $api from '../http'
import {AxiosResponse} from 'axios'
import {IUser} from '../models/response/IUser.ts'
import { IMessage } from '../models/IMessage.ts'

export interface IUserSubs extends IUser {
    isSubscribing: boolean
}

export default class UserService {
    static getUsers(): Promise<AxiosResponse<IUser[]>> {
        return $api.get<IUser[]>('/users', {withCredentials: true})
    }

    static updateProfile(formData: FormData): Promise<AxiosResponse<IUser>>{
        return $api.patch<IUser>('/updateProfile', formData, {withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' }})
    }

    static getUsersWithSubsCheck(searchString: string): Promise<AxiosResponse<IUserSubs[]>> {
        return $api.get<IUserSubs[]>(`/getusersubs/${searchString}`, {withCredentials: true})
    }

    static getChatUsers(): Promise<AxiosResponse<IUser[]>> {
        return $api.get<IUser[]>(`/chatUsers`, {withCredentials: true})
    }

    static getMessages(receiverId: string): Promise<AxiosResponse<IMessage[]>> {
        return $api.get<IMessage[]>(`/messages/${receiverId}`, {withCredentials: true})
    }

    static getUserById(userId: string): Promise<AxiosResponse<IUser>> {
        return $api.get<IUser>(`/getuser/${userId}`, {withCredentials: true})
    }

    static subscribe(userId: string): Promise<AxiosResponse> {
        return $api.put(`/subscribe/${userId}`, {withCredentials: true})
    }

    static unsubscribe(userId: string): Promise<AxiosResponse> {
        return $api.delete(`/unsubscribe/${userId}`, {withCredentials: true})
    }
}
