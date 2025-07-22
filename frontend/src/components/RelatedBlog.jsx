import { RouteBlogDetails } from '@/helpers/RouteName'
import { axiosInstance } from '@/lib/axios'
import { getRelatedBlog } from '@/store/blog-slice/blogSice'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const RelatedBlog = ({ props }) => {

  const dispatch = useDispatch();
  const data = useSelector((state) => state.blog.relatedBlog)
  const isLoading = useSelector((state) => state.blog.isRelatedBlogLoading)


  useEffect(() => {
    dispatch(getRelatedBlog({ category: props.category, currentBlog: props.currentBlog }))
  }, [props.category, props.currentBlog])

  if (isLoading) return <div>Loading....</div>
  return (
    <div>
      <h2 className='text-2xl font-bold mb-5'>Related Blogs</h2>
      <div>
        {data && data.length > 0
          ?
          data.map(blog => {
            return (
              <Link key={blog._id} to={RouteBlogDetails(props.category, blog.slug)}>
                <div className='flex items-center gap-2 mb-3'>
                  <img className='w-[100px] h-[70px] object-cover rounded-md' src={blog.featuredImage} />
                  <h4 className='line-clamp-2 text-lg font-semibold'>{blog.title}</h4>
                </div>
              </Link>
            )
          })

          :
          <div>
            No Related Blog
          </div>
        }

      </div>
    </div>
  )
}

export default RelatedBlog