import React, { useState, useEffect } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import slugify from 'slugify'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux'
import { getSingleCategory, updateCategory } from '@/store/category-slice/categorySlice'
import { unwrapResult } from '@reduxjs/toolkit';
import { RouteCategoryDetails } from '@/helpers/RouteName'

const EditCategory = () => {
  const { category_id } = useParams()


  const dispatch = useDispatch()
  const navigate = useNavigate()

  const categoryData = useSelector((state) => state.category.selectedCategory);
  const isLoading = useSelector((state) => state.category.isUpdateCategory);

  useEffect(() => {
    dispatch(getSingleCategory(category_id))
  }, [])

  const formSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 character long.'),
    slug: z.string().min(3, 'Slug must be at least 3 character long.'),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  })


  const categoryName = form.watch('name')

  useEffect(() => {
    if (categoryName) {
      const slug = slugify(categoryName, { lower: true })
      form.setValue('slug', slug)
    }
  }, [categoryName])


  useEffect(() => {
    if (categoryData) {
      form.setValue('name', categoryData.name)
      form.setValue('slug', categoryData.slug)
    }
  }, [categoryData])

  async function onSubmit(values) {
    try {
      const resultAction = await dispatch(updateCategory({ id: category_id, data: values }));
      unwrapResult(resultAction);
      form.reset()
      navigate(RouteCategoryDetails);
    } catch (error) {
      console.error("edit category failed:", error);
    }
  }

  return (
    <div>
      <Card className="pt-5 max-w-screen-md mx-auto">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}  >
              <div className='mb-3'>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
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
                        <Input placeholder="Slug" {...field} disabled={true} className="font-semibold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full cursor-pointer">
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

export default EditCategory