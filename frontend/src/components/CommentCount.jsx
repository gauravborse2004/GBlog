import React from 'react'
import { FaRegComment } from "react-icons/fa";
import { useSelector } from 'react-redux';
const CommentCount = () => {

    const data = useSelector((state) => state.comment.count);

    return (
        <button type='button' className='flex justify-between items-center gap-1'>
            <FaRegComment />
            {data && data}
        </button>
    )
}

export default CommentCount