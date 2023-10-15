import $api from "../http"
import {AxiosResponse} from "axios"
import {IPost} from "../models/response/IPost.ts";
import {FeedResponse} from "../models/response/FeedResponse.ts";

export default class PostService {
    static createPost(formData: FormData): Promise<AxiosResponse<IPost>>{
        return $api.post<IPost>('/createpost', formData, {withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' }})
    }

    static deletePost(postId: string): Promise<AxiosResponse<IPost>>{
        return $api.delete<IPost>(`/deletepost/${postId}`, {withCredentials: true})
    }

    static getPostsOfUserFollowings(): Promise<AxiosResponse<FeedResponse[]>>{
        return $api.get<FeedResponse[]>(`/getposts`, {withCredentials: true})
    }

    static getUserPosts(userId: string): Promise<AxiosResponse<FeedResponse[]>>{
        return $api.get<FeedResponse[]>(`/getuserposts/${userId}`, {withCredentials: true})
    }

    static likePost(postId: string): Promise<AxiosResponse<IPost>>{
        return $api.put<IPost>(`/likepost/${postId}`, {withCredentials: true})
    }

    static unlikePost(postId: string): Promise<AxiosResponse<IPost>>{
        return $api.delete<IPost>(`/unlikepost/${postId}`, {withCredentials: true})
    }
}