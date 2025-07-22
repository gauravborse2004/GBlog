import BlogCard from '@/components/BlogCard'
import Loading from '@/components/Loading'
import { blogSearch } from '@/store/blog-slice/blogSice'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

const SearchResult = () => {

    const [searchParams] = useSearchParams()
    const q = searchParams.get('q')
    const dispatch = useDispatch()

    const blogData = useSelector((state) => state.blog.search);
    const isSearch = useSelector((state) => state.blog.isSearch);

    useEffect(() => {
        dispatch(blogSearch(q))
    }, [q])

    if (isSearch) return <Loading />

    return (
        <>
            <div className='flex items-center gap-3 text-2xl font-bold text-violet-500 border-b pb-3 mb-5'>
                <h4>Search Result For: {q}</h4>
            </div>
            <div className='grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10'>
                {blogData && blogData.length > 0
                    ? blogData.map(blog => <BlogCard key={blog._id} props={blog} />)
                    : <div>Data Not Found.</div>
                }
            </div>
        </>
    )
}

export default SearchResult