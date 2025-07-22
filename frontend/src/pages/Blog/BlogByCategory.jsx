import BlogCard from '@/components/BlogCard'
import Loading from '@/components/Loading'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BiCategory } from "react-icons/bi";
import { axiosInstance } from '@/lib/axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogByCategory } from '@/store/blog-slice/blogSice';

const BlogByCategory = () => {
    const { category } = useParams()

    const dispatch = useDispatch()

    const blogData = useSelector((state) => state.blog.blogByCategory);
    const isLoading = useSelector((state) => state.blog.isLoading);
    const categoryData = useSelector((state) => state.blog.categoryData);

    useEffect(() => {
        dispatch(fetchBlogByCategory(category))
    }, [category])

    if (isLoading) return <Loading />

    return (
        <>
            <div className='flex items-center gap-3 text-2xl font-bold text-violet-500 border-b pb-3 mb-5'>
                <BiCategory />
                <h4>{categoryData?.name || "Unknown Category"}</h4>
            </div>
            <div className='grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10'>
                {blogData.length > 0
                    ?
                    blogData.map(blog => <BlogCard key={blog._id} props={blog} />)
                    :
                    <div>Data Not Found.</div>
                }
            </div>
        </>
    )
}

export default BlogByCategory