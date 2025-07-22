import React, { use, useEffect, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import slugify from 'slugify'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Dropzone from 'react-dropzone'
import Editor from '@/components/Editor'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { RouteBlog } from '@/helpers/RouteName'
import { decode } from 'entities'
import { Loader2 } from "lucide-react";
import { toast } from 'react-toastify'
import { fetchCategories } from '@/store/category-slice/categorySlice'
import { editBlog, getSingleBlog } from '@/store/blog-slice/blogSice'
import { unwrapResult } from '@reduxjs/toolkit';

const EditBlog = () => {

    const { blogid } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const isLoading = useSelector((state) => state.blog.isEditBlog)
    const user = useSelector((state) => state.auth.authUser);
    const categoryData = useSelector((state) => state.category.categoryList);

    const blogData = useSelector((state) => state.blog.singleBlog)


    const [filePreview, setPreview] = useState()
    const [file, setFile] = useState()

    const formSchema = z.object({
        category: z.string().min(3, 'Category must be at least 3 character long.'),
        title: z.string().min(3, 'Title must be at least 3 character long.'),
        slug: z.string().min(3, 'Slug must be at least 3 character long.'),
        blogContent: z.string().min(3, 'Blog content must be at least 3 character long.'),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category: '',
            title: '',
            slug: '',
            blogContent: '',
        },
    })

    useEffect(() => {
        if (blogData && blogData.blogContent) {
            setPreview(blogData.featuredImage);
            form.setValue('category', blogData.category?._id || '');
            form.setValue('title', blogData.title || '');
            form.setValue('slug', blogData.slug || '');
            form.setValue('blogContent', decode(blogData.blogContent));
        }
    }, [blogData])



    const handleEditorData = (event, editor) => {
        const data = editor.getData()
        form.setValue('blogContent', data)
    }


    const blogTitle = form.watch('title')

    useEffect(() => {
        if (blogTitle) {
            const slug = slugify(blogTitle, { lower: true })
            form.setValue('slug', slug)
        }
    }, [blogTitle])



    async function onSubmit(values) {
        try {

            if (!file && !filePreview) {
                return toast.error("Feature image is required.");

            }

            if (!user?.user._id) {
                return toast.error("Login required.")
            }

            const updatedValues = {
                ...values,
                author: user?.user?._id,
            };

            const data = {
                id: blogid,
                values: updatedValues,
                file,
            };

            const resultAction = await dispatch(editBlog(data));
            unwrapResult(resultAction);
            form.reset();
            setFile();
            setPreview();
            navigate(RouteBlog);
        } catch (error) {
            console.error("Error Editting blog:", error);
        }
    }


    useEffect(() => {
        dispatch(getSingleBlog(blogid))
    }, [])

    const handleFileSelection = (files) => {
        const file = files[0]
        const preview = URL.createObjectURL(file)
        setFile(file)
        setPreview(preview)
    }

    return (
        <div>
            <Card className="pt-5">
                <CardContent>
                    <h1 className='text-2xl font-bold mb-4'>Edit Blog</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}  >
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (

                                        <FormItem>

                                            <FormLabel>Category</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger  >
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categoryData && categoryData.length > 0 &&
                                                            categoryData.map(category => <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>)
                                                        }



                                                    </SelectContent>
                                                </Select>

                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter blog title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Slug" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='mb-3'>
                                <span className='mb-2 block'>Featured Image</span>
                                <Dropzone onDrop={acceptedFiles => handleFileSelection(acceptedFiles)}>
                                    {({ getRootProps, getInputProps }) => (
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            <div className='flex justify-center items-center w-36 h-28 border-2 border-dashed rounded'>
                                                <img src={filePreview} />
                                            </div>
                                        </div>
                                    )}
                                </Dropzone>
                            </div>
                            <div className='mb-3'>

                                <FormField
                                    control={form.control}
                                    name="blogContent"
                                    render={({ field }) => (

                                        <FormItem>
                                            {console.log(field.value)}
                                            <FormLabel>Blog Content</FormLabel>
                                            <FormControl>
                                                <Editor props={{ initialData: field.value, onChange: handleEditorData }} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>



                            <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
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

                </CardContent>
            </Card>

        </div>
    )
}

export default EditBlog