import React, { useEffect, useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import slugify from 'slugify';
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { RouteCategoryDetails } from '@/helpers/RouteName';
import { addCategory } from '@/store/category-slice/categorySlice';
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.category.isAddCategory);

  const formSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 character long.'),
    slug: z.string().min(3, 'Slug must be at least 3 character long.'),
  })

  // slugify convert: some string to some-string
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

  async function onSubmit(values) {
    try {
      const resultAction = await dispatch(addCategory(values));
      unwrapResult(resultAction);
      form.reset()
      navigate(RouteCategoryDetails);
    } catch (error) {
      console.error("add category failed:", error);
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

export default AddCategory