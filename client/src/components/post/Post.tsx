import {STATIC_URL} from '../../http'
import {IPost} from '../../models/response/IPost'
import styles from './Post.module.scss'
import likedSvg from '../../assets/liked.svg'
import unlikedSvg from '../../assets/unliked.svg'
import { Link } from 'react-router-dom'

export interface PostUser {
	_id: string
    firstName: string
    avatarImage: string
}

interface PostProps {
    isLikable: boolean
    owner: PostUser
    post: IPost
    onLike: (isLiked: boolean, postId: string) => void
}

function Post({owner, post, isLikable, onLike}: PostProps) {

    return (
        <li key={post._id} className={styles.postContainer}>
            <Link to={`/profile/${owner._id || ''}`} className={styles.ownerInfo}>
                <img src={owner.avatarImage.slice(0, 5) === 'blob:' ? owner.avatarImage : `${STATIC_URL}${owner.avatarImage}`} alt='avatar' />
                <span>{owner.firstName}</span>
            </Link>

            <div className={styles.postInfo}>
                <p>{post.postText}</p>
                {post.images && post.images.length > 0 && (
                    <div className={styles.imgContainer}>
                        {post.images?.map((image) => <img key={image} src={`${STATIC_URL}${image}`} alt='postImage' />)}
                    </div>
                )}

                <div className={styles.reactionsContainer}>
                    {isLikable && (
                        <img
                            onClick={() => onLike(post.isLiked, post._id)}
                            className={styles.like}
                            src={post.isLiked ? likedSvg : unlikedSvg}
                            alt='like'
                        />
                    )}
                    <span>{post.likes.length}</span>
                </div>
            </div>
        </li>
    )
}

export default Post
