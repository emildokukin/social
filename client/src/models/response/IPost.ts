export interface IPost {
    _id: string
    userId: string
    postText: string
    images?: string[]
    likes: string[]
    isLiked: boolean
}
