import BlogCard from '@/components/BlogCard'
import Loading from '@/components/Loading'
import { getAllBlogs, ShowAllBlogs } from '@/store/blog-slice/blogSice'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Index = () => {

  const dispatch = useDispatch()

  const isLoading = useSelector((state) => state.blog.isLoading)
  const blogData = useSelector((state) => state.blog.publicBlogs)

  useEffect(() => {
    dispatch(ShowAllBlogs())
  }, [])

  if (isLoading) return <Loading />
  return (
    <div className='grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10'>
      {blogData && blogData.length > 0
        ?
        blogData.map(blog => <BlogCard key={blog._id} props={blog} />)
        :
        <div>Data Not Found.</div>
      }
    </div>
  )
}

export default Index