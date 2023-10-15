import {FormEvent, useEffect, useRef, useState} from 'react'
import {STATIC_URL} from '../../../http'
import {useAppSelector} from '../../../store/store'
import styles from './Profile.module.scss'
import {useDispatch} from 'react-redux'
import {updateProfile} from '../../../store/features/auth'
import PostService from '../../../services/postService'
import Post from '../../post/Post'
import {FeedResponse} from '../../../models/response/FeedResponse'
import {useParams} from 'react-router-dom'
import UserService from '../../../services/userService'
import {IUser} from '../../../models/response/IUser'

function Profile() {
    const profileForm = useRef<HTMLFormElement>(null)
    const avatarInput = useRef<HTMLInputElement>(null)
    const {userId} = useParams()
    const curUser = useAppSelector((state) => state.auth.user)
    const [user, setUser] = useState<IUser>(curUser)
    const [posts, setPosts] = useState<FeedResponse[]>([])

    useEffect(() => {
        const id = userId ? userId : curUser._id

        if (userId) {
            void UserService.getUserById(userId).then((user) => setUser(user.data))
        } else {
            setUser(curUser)
        }

        void PostService.getUserPosts(id).then((posts) => setPosts(posts.data))
    }, [userId])

    const dispatch = useDispatch()

    const update = (e: FormEvent) => {
        e.preventDefault()

        if (!profileForm.current) return

        const form = new FormData(profileForm.current)

        void dispatch(updateProfile(form))
    }

    const handleImagesUploaded = () => {
        const input = avatarInput.current

        if (!input || !input.files) return

        setUser((user) => {
            const newUser = {...user}

            if (input.files && input.files[0]) newUser.avatarImage = URL.createObjectURL(input.files[0])

            return newUser
        })
    }

    const switchLikePost = (isLiked: boolean, postId: string) => {
        if (isLiked) {
            void PostService.unlikePost(postId)
        } else {
            void PostService.likePost(postId)
        }

        setPosts(() => {
            const updatedPost = posts.find((post) => post.post._id === postId)

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
            <form ref={profileForm} onSubmit={update}>
                <img
                    onClick={() => {
                        if (curUser._id === user._id) avatarInput.current?.click()
                    }}
                    className={styles.avatarImage}
                    src={
                        user.avatarImage.slice(0, 5) === 'blob:' ? user.avatarImage : `${STATIC_URL}${user.avatarImage}`
                    }
                    alt='avatar'
                />
                <input
                    onChange={handleImagesUploaded}
                    ref={avatarInput}
                    accept='.png,.jpg,.gif,.webp'
                    name='avatarImage'
                    className={styles.avatarFile}
                    type='file'
                />
                <div className={styles.userInfo}>
                    {curUser._id === user._id ? (
                        <>
                            <div className={styles.userFields}>
                                <input
                                    name='firstName'
                                    minLength={3}
                                    maxLength={30}
                                    type='text'
                                    value={user.firstName}
                                    onChange={(e) =>
                                        setUser({
                                            ...user,
                                            firstName: e.currentTarget.value
                                        })
                                    }
                                />
                                <input
                                    name='secondName'
                                    minLength={3}
                                    maxLength={30}
                                    type='text'
                                    value={user.secondName}
                                    onChange={(e) =>
                                        setUser({
                                            ...user,
                                            secondName: e.currentTarget.value
                                        })
                                    }
                                />
                                <input
                                    name='email'
                                    minLength={3}
                                    maxLength={30}
                                    type='text'
                                    value={user.email}
                                    onChange={(e) =>
                                        setUser({
                                            ...user,
                                            email: e.currentTarget.value
                                        })
                                    }
                                />
                            </div>
                            <button type='submit'>Save changes</button>
                        </>
                    ) : (
                        <div className={styles.anotherUserFields}>
                            <span>
                                {user.firstName} {user.secondName}
                            </span>
                            <span>{user.email}</span>
                        </div>
                    )}
                </div>
            </form>

            <div className={styles.postsContainer}>
                <ul className={styles.postsList}>
                    {posts.map((post) => (
                        <Post
                            key={post.post._id}
                            isLikable={true}
                            post={post.post}
                            onLike={switchLikePost}
                            owner={user}
                        />
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Profile
