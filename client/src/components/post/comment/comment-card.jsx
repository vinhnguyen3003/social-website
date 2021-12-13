import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import UserAvatarImg from '../../../assets/images/user-avatar.png';
import LikeImg from '../../../assets/images/like.png';
import moment from 'moment'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likeComment, unLikeComment } from '../../../redux/actions/commentAction';

function CommentCard({levelKey, handleReply, comment, post}) {
    const [isLike, setIsLike] = useState(false);
    const authState = useSelector(state => state.authReducer);
    const dispatch = useDispatch();

    const handleLike = async() => {
        setIsLike(true);
        await dispatch(likeComment({comment, post, auth: authState}))
    }
    const handleUnLike = async () => {
        setIsLike(false);
        await dispatch(unLikeComment({comment, post, auth: authState}))
    }

    useEffect(()=>{
        if(comment.likes.find(like => like._id === authState.user._id)){
            setIsLike(true);
        }
    },[authState.user._id, comment.likes])
    return (
        <div 
            className={`comment-box-item--style comment-box-item__lv${levelKey}`}
        >
            {
                levelKey === 3 ? 
                    <div className="comment-box-curve"></div> :
                    <div className="comment-box-line"></div>
            }
            <Link 
                to={`/profile/${comment.user._id}/post`} className="comment-box-avatar"
            >
                <img src={comment.user.avatar || UserAvatarImg} alt="" />
            </Link>
            <div className="comment-box-body">
                <div className="comment-box-body__content">
                    <Link 
                        to={`/profile/${comment.user._id}/post`} className="comment-content-name"
                    >
                        {comment.user.username}
                    </Link>
                    <span className="comment-content-text">
                        {
                            comment.tag ?
                                <Link
                                    to={`/profile/${comment.tag._id}/post`} 
                                >
                                    @{comment.tag.username}
                                </Link> : null
                        }
                        {comment.content}
                    </span>
                    {
                        comment.likes.length > 0 ?
                            <span className="comment-content-like-count">
                                <span>
                                    <img src={LikeImg} alt="" />
                                </span>
                                <span>{comment.likes.length}</span>
                            </span> : null
                    }
                </div>
                <div className="comment-box-body__tool">
                    {
                        isLike ?
                            <span 
                                className="comment-tool comment-tool-like --active"
                                onClick={handleUnLike}
                            >
                                Like
                            </span> :
                            <span 
                                className="comment-tool comment-tool-like"
                                onClick={handleLike}
                            >
                                Like
                            </span>
                    }
                    <span 
                        className="comment-tool comment-tool-reply"
                        onClick={()=>handleReply(comment)}
                    >
                        Reply
                    </span>
                    <span className="comment-tool comment-tool-time">
                        {moment(comment.createdAt).fromNow()}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default CommentCard;