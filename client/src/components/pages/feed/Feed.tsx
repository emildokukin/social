import styles from './Feed.module.scss'
import PostService from '../../../services/postService'
import {FormEvent, useEffect, useRef, useState} from 'react'
import attachImg from '../../../assets/attachImg.svg'
import {FeedResponse} from '../../../models/response/FeedResponse.ts'
import {useAppSelector} from '../../../store/store.ts'
import Post from '../../post/Post.tsx'

function Feed() {
    const [images, setImages] = useState<string[]>([])
    const [postText, setPostText] = useState('')
    const [posts, setPosts] = useState<FeedResponse[]>([])
    const formPost = useRef<HTMLFormElement>(null)
    const filesSelector = useRef<HTMLInputElement>(null)
    const textField = useRef<HTMLTextAreaElement>(null)
    const curUser = useAppSelector((state) => state.auth.user)

    useEffect(() => void getPosts(), [])

    const createPost = (e: FormEvent) => {
        e.preventDefault()

        if (!formPost.current) return

        const form = new FormData(formPost.current)

        void PostService.createPost(form).then((post) => {
            setPosts((posts) => [
                {
                    _id: curUser._id,
                    firstName: curUser.firstName,
                    secondName: curUser.secondName,
                    avatarImage: curUser.avatarImage,
                    isLiked: false,
                    post: post.data
                },
                ...posts
            ])
        })

        setPostText('')
        setImages([])
    }

    const getPosts = async () => {
        const posts = await PostService.getPostsOfUserFollowings()
        setPosts(posts.data)
    }

    const handleSelectImages = () => {
        filesSelector.current?.click()
    }

    const handleImagesUploaded = () => {
        if (!filesSelector.current || !filesSelector.current?.files) return

        for (const file of filesSelector.current.files) {
            setImages((images) => [...images, URL.createObjectURL(file)])
        }
    }

    const handleTextEdit = (e: FormEvent<HTMLTextAreaElement>) => {
        setPostText(e.currentTarget.value)

        if (!textField.current) return

        textField.current.style.height = ''
        textField.current.style.height = `${textField.current.scrollHeight}px`
    }

    const switchLikePost = (isLiked: boolean, postId: string) => {
        if (isLiked) {
            void PostService.unlikePost(postId)
        } else {
            void PostService.likePost(postId)
        }

        setPosts((posts) => {
            const updatedPost = posts.find((feedPost) => feedPost.post._id === postId)

            if (!updatedPost) return posts

            if (!updatedPost.post.isLiked) {
                updatedPost.post.likes.push(curUser._id)
            } else {
                updatedPost.post.likes = updatedPost.post.likes.filter((userId) => userId !== curUser._id)
            }

            updatedPost.post.isLiked = !updatedPost.post.isLiked

            return [...posts]
        })
    }

    return (
        <div className={styles.container}>
            <form className={styles.createPostForm} ref={formPost} onSubmit={createPost}>
                <textarea
                    name='postText'
                    placeholder='Type something...'
                    value={postText}
                    ref={textField}
                    onChange={handleTextEdit}
                />
                <input
                    onChange={handleImagesUploaded}
                    ref={filesSelector}
                    className={styles.filesInput}
                    name='images'
                    type='file'
                    multiple
                    accept='.png,.jpg,.gif,.webp'
                />
                <div className={styles.bottomForm}>
                    <img src={attachImg} alt='attachImg' onClick={handleSelectImages} />
                    <button type='submit'>Post</button>
                </div>
                {images.length > 0 && (
                    <div className={styles.uploadedImages}>
                        {images.map((image) => (
                            <div key={image} className={styles.uploadedImageContainer}>
                                <span onClick={() => setImages((imgs) => imgs.filter((img) => img !== image))}></span>
                                <img src={image} alt='uploadedImage' />
                            </div>
                        ))}
                    </div>
                )}
            </form>

            <ul className={styles.postsList}>
                {posts.map((feedPost) => (
                    <Post
                        key={feedPost.post._id}
                        isLikable={true}
                        post={feedPost.post}
                        onLike={switchLikePost}
                        owner={{_id: feedPost._id, firstName: feedPost.firstName, avatarImage: feedPost.avatarImage}}
                    />
                ))}
            </ul>
        </div>
    )
}

export default Feed
