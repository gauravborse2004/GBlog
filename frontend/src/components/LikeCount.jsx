import React, { useEffect, useState } from 'react'
import { FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { FaHeart } from "react-icons/fa";
import { toast } from 'react-toastify';
import { fetchLikeStatus, toggleLike } from '@/store/like-slice/likeSlice';

const LikeCount = ({ props }) => {

    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.authUser);
    const likeCount = useSelector((state) => state.like.likeCount);
    const hasLiked = useSelector((state) => state.like.hasLiked);

    const handleLike = async () => {
        if (!user) {
            return toast.error('Please login into your account.')
        }
        dispatch(toggleLike({ blogid: props.blogid, userid: user.user._id }))
    }
    useEffect(() => {
        dispatch(fetchLikeStatus({ blogid: props.blogid, userid: user?.user._id }))
    }, [props.blogid])


    return (
        <button onClick={handleLike} type='button' className='flex justify-between items-center gap-1 cursor-pointer'>
            {!hasLiked ?
                <FaRegHeart />
                :
                <FaHeart fill='red' />
            }
            {likeCount}
        </button>
    )
}

export default LikeCount