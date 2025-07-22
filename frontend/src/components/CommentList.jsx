import React, { useEffect, useState } from 'react'
import { Avatar } from './ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import usericon from '@/assets/images/user.png'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCommentCount, fetchComments } from '@/store/comment-slice/commentSlice'

const CommentList = ({ props }) => {

    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.authUser);
    const data = useSelector((state) => state.comment.comments);
    const isLoading = useSelector((state) => state.comment.isLoading);
    const commentCount = useSelector((state) => state.comment.count);

    useEffect(() => {
        dispatch(fetchComments(props.blogid))
        dispatch(fetchCommentCount(props.blogid))
    }, [props.blogid])


    if (isLoading) return <div>Loading...</div>
    const comments = data.comments || [];

    return (
        <div>
            <h4 className='text-2xl font-bold'>
                {commentCount}
                Comments</h4>
            <div className='mt-5'>

                {comments.length > 0 &&
                    comments.map(comment => {
                        return (
                            <div key={comment._id} className='flex gap-2 mb-3'>
                                <Avatar>
                                    <AvatarImage src={comment?.user.avatar || usericon} />
                                </Avatar>

                                <div>
                                    <p className='font-bold'>{comment?.user.name}</p>
                                    <p>{moment(comment?.createdAt).format('DD-MM-YYYY')}</p>
                                    <div className='pt-3'>
                                        {comment?.comment}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        </div>
    )
}

export default CommentList