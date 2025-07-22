import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RouteBlogAdd, RouteBlogEdit } from '@/helpers/RouteName'
import { useEffect, useState } from 'react'
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { getAllBlogs, removeBlog } from '@/store/blog-slice/blogSice'
import Loading from '@/components/Loading'

const BlogDetails = () => {

  const dispatch = useDispatch()

  const isLoading = useSelector((state) => state.blog.isLoading)
  const blogData = useSelector((state) => state.blog.blogs)

  async function handleDelete(id) {
    dispatch(removeBlog(id))
  }

  useEffect(() => {
    dispatch(getAllBlogs())
  }, [])


  if (isLoading) return <Loading />
  return (
    <div>
      <Card>
        <CardHeader>
          <div>
            <Button asChild>
              <Link to={RouteBlogAdd}>
                Add Blog
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>

            <TableHeader>
              <TableRow>
                <TableHead>Author </TableHead>
                <TableHead>Category </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Dated</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogData && blogData.length > 0 ?

                blogData.map(blog =>
                  <TableRow key={blog._id}>
                    <TableCell>{blog?.author?.name}</TableCell>
                    <TableCell>{blog?.category?.name}</TableCell>
                    <TableCell>{blog?.title}</TableCell>
                    <TableCell>{blog?.slug}</TableCell>
                    <TableCell>{moment(blog?.createdAt).format('DD-MM-YYYY')}</TableCell>

                    <TableCell className="flex gap-3">
                      <Button variant="outline" className="hover:bg-violet-500 hover:text-white cursor-pointer" asChild>
                        <Link to={RouteBlogEdit(blog._id)}>
                          <FiEdit />
                        </Link>
                      </Button>
                      <Button onClick={() => handleDelete(blog._id)} variant="outline" className="hover:bg-violet-500 hover:text-white cursor-pointer" >
                        <FaRegTrashAlt />
                      </Button>
                    </TableCell>
                  </TableRow>

                )

                :

                <TableRow>
                  <TableCell colSpan="3">
                    Data not found.
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>

        </CardContent>
      </Card>
    </div>
  )
}

export default BlogDetails



