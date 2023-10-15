import {IPost} from './IPost.ts'

export interface FeedResponse {
    _id: string
    firstName: string
    secondName: string
    avatarImage: string
    post: IPost
}
