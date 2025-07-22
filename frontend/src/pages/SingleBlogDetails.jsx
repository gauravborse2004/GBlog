import Comment from '@/components/Comment'
import CommentCount from '@/components/CommentCount'
import LikeCount from '@/components/LikeCount'
import Loading from '@/components/Loading'
import RelatedBlog from '@/components/RelatedBlog'
import { Avatar } from '@/components/ui/avatar'
import { getSingleBlogDetails } from '@/store/blog-slice/blogSice'
import { AvatarImage } from '@radix-ui/react-avatar'
import { decode } from 'entities'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const SingleBlogDetails = () => {

  const { blog, category } = useParams()
  const dispatch = useDispatch()

  const blogData = useSelector((state) => state.blog.singleBlogDetails)
  const isLoading = useSelector((state) => state.blog.isEditBlog)

  useEffect(() => {
    dispatch(getSingleBlogDetails(blog))
  }, [blog,category])



  if (isLoading) return <Loading />
  return (

    <div className='md:flex-nowrap flex-wrap flex justify-between gap-20'>
      {blogData && blogData.title &&

        <>
          <div className='border rounded md:w-[70%] w-full p-5'>
            <h1 className='text-2xl font-bold mb-5'>{blogData.title}</h1>
            <div className='flex justify-between items-center'>
              <div className='flex justify-between items-center gap-5'>
                <Avatar>
                  <AvatarImage src={blogData.author.avatar} />
                </Avatar>
                <div>
                  <p className='font-bold'>{blogData.author.name}</p>
                  <p>Date: {moment(blogData.createdAt).format('DD-MM-YYYY')}</p>
                </div>
              </div>
              <div className='flex justify-between items-center gap-5'>
                <LikeCount props={{ blogid: blogData._id }} />
                <CommentCount props={{ blogid: blogData._id }} />
              </div>
            </div>
            <div className='my-5'>
              <img src={blogData.featuredImage} className='rounded' />
            </div>
            <div dangerouslySetInnerHTML={{ __html: decode(blogData.blogContent) || '' }}>

            </div>

            <div className='border-t mt-5 pt-5'>
              <Comment props={{ blogid: blogData._id }} />
            </div>


          </div>
        </>

      }
      <div className='border rounded md:w-[30%] w-full p-5'>
        <RelatedBlog props={{ category: category, currentBlog: blog }} />
      </div>
    </div>
  )
}

export default SingleBlogDetails