import React, { useState } from 'react'
import { FaComments } from "react-icons/fa";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useDispatch, useSelector } from 'react-redux';
import { RouteSignIn } from '@/helpers/RouteName';
import CommentList from './CommentList';
import { Link } from 'react-router-dom';
import { Loader2 } from "lucide-react";
import { addComment } from '@/store/comment-slice/commentSlice';

const Comment = ({ props }) => {

    const user = useSelector((state) => state.auth.authUser);
    const isLoading = useSelector((state) => state.comment.isLoading);

    const dispatch = useDispatch()
    const formSchema = z.object({
        comment: z.string().min(3, 'Comment must be at least 3 character long.'),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            comment: '',
        },
    })

    async function onSubmit(values) {
        form.reset();
        await dispatch(addComment({
            values,
            blogid: props.blogid,
            user: user.user._id,
        })).unwrap();  
    }

    return (
        <div>
            <h4 className='flex items-center gap-2 text-2xl font-bold'> <FaComments className='text-violet-500' /> Comment</h4>

            {user
                ?
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}  >
                        <div className='mb-3'>
                            <FormField
                                control={form.control}
                                name="comment"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Comment</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Type your comment..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" className="cursor-pointer" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </form>
                </Form>
                :
                <Button asChild className="cursor-pointer">
                    <Link to={RouteSignIn}>Sign In </Link>
                </Button>
            }

            <div className='mt-5'>
                <CommentList props={{ blogid: props.blogid }} />
            </div>

        </div>
    )
}

export default Comment