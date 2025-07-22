import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Loading from '@/components/Loading'
import { FaRegTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux'
import { deleteComments, fetchAllComments } from '@/store/comment-slice/commentSlice'

const Comments = () => {

    const dispatch = useDispatch()
    const isLoading = useSelector((state) => state.comment.isAllcommentLoading);
    const data = useSelector((state) => state.comment.allComments);

    const handleDelete = async (id) => {
        dispatch(deleteComments(id))
    }

    useEffect(() => {
        dispatch(fetchAllComments())
    }, [])



    if (isLoading) return <Loading />
    return (
        <div>
            <Card>

                <CardContent>
                    <Table>


                        <TableHeader>
                            <TableRow>
                                <TableHead>Blog </TableHead>
                                <TableHead>Comented By</TableHead>
                                <TableHead>Comment</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data && data.length > 0 ?
                                data.map(comment =>
                                    <TableRow key={comment._id}>
                                        <TableCell>{comment?.blogid?.title}</TableCell>
                                        <TableCell>{comment?.user?.name}</TableCell>
                                        <TableCell>{comment?.comment}</TableCell>
                                        <TableCell className="flex gap-3">
                                            <Button onClick={(e) => handleDelete(comment._id)} variant="outline" className="hover:bg-violet-500 hover:text-white cursor-pointer" >
                                                <FaRegTrashAlt />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                                :
                                <TableRow>
                                    <TableCell colSpan="4">
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

export default Comments