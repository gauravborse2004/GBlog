import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { RouteIndex, RouteSignUp } from '@/helpers/RouteName'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import logo from '@/assets/images/logo-white.png'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react";
import GoogleLogin from '@/components/GoogleLogin'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit';
import { login } from '@/store/auth-slice/authSlice'

const SignIn = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoggingIn } = useSelector((state) => state.auth);

  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, 'Password field must be 8 character long.')
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values) {
    try {
      const resultAction = await dispatch(login(values));
      unwrapResult(resultAction);
      navigate(RouteIndex);
    } catch (error) {
      console.error("Signup failed:", error);
    }
  }

  return (
    <div className='flex justify-center items-center h-screen w-screen'>
      <Card className="w-[400px] p-5">
        <div className='flex justify-center items-center mb-2'>

          <Link to={RouteIndex}>
            <img src={logo} />
          </Link>
        </div>
        <h1 className='text-2xl font-bold text-center mb-5'>Login Into Account</h1>
        <div className=''>
          <GoogleLogin />
          <div className='border my-5 flex justify-center items-center'>
            <span className='absolute bg-white text-sm'>Or</span>
          </div>

        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}  >
            <div className='mb-3'>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='mb-3'>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='mt-5'>
              <Button type="submit" className="w-full cursor-pointer" disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              <div className='mt-5 text-sm flex justify-center items-center gap-2'>
                <p>Don&apos;t have account?</p>
                <Link className='text-blue-500 hover:underline' to={RouteSignUp}>Sign Up</Link>
              </div>
            </div>
          </form>
        </Form>
      </Card>

    </div>
  )
}

export default SignIn

