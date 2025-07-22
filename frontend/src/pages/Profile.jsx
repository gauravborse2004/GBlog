import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Textarea } from "@/components/ui/textarea"
import { IoCameraOutline } from "react-icons/io5"
import { Loader2 } from "lucide-react";
import usericon from '@/assets/images/user.png'
import { updateProfile } from '@/store/auth-slice/authSlice'

const Profile = () => {

    const [filePreview, setPreview] = useState()
    const [file, setFile] = useState()

    const user = useSelector((state) => state.auth.authUser);
    const isUpdatingProfile = useSelector((state) => state.auth.isUpdatingProfile);
    const dispatch = useDispatch()

    const formSchema = z.object({
        name: z.string().min(3, 'Name must be at least 3 character long.'),
        email: z.string().email(),
        bio: z.string().min(3, 'Bio must be at least 3 character long.'),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user.user?.name || '',
            email: user.user?.email || '',
            bio: user.user?.bio || '',
        },
    })

    useEffect(() => {
        if (user.user) {
            form.reset({
                name: user.user.name,
                email: user.user.email,
                bio: user.user.bio,
                password: '',
            })
            setPreview(user.user.avatar)
        }
    }, [user.user])

    const handleFileSelection = (files) => {
        const file = files[0]
        const preview = URL.createObjectURL(file)
        setFile(file)
        setPreview(preview)
    }

    async function onSubmit(values) {

        let formData = new FormData()
        formData.append('userId', user.user.id)
        formData.append('name', values.name)
        formData.append('bio', values.bio)

        if (file) formData.append('avatar', file)
        dispatch(updateProfile(formData))
    }

    return (
        <Card className="max-w-screen-md mx-auto ">
            <CardContent>
                <div className='flex justify-center items-center mt-10'>
                    {/* Avatar upload */}
                    <label className="relative group cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => handleFileSelection(e.target.files)}
                        />
                        <Avatar className="w-28 h-28 relative group">
                            <AvatarImage src={filePreview || user.user?.avatar || usericon} />
                            <div className='absolute z-50 w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-center items-center bg-black bg-opacity-20 border-2 border-violet-500 rounded-full group-hover:flex hidden cursor-pointer'>
                                <IoCameraOutline color='#7c3aed' size={32} />
                            </div>
                        </Avatar>
                    </label>
                </div>
                <div>
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
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your email address" {...field} disabled={true} className="font-bold text-black" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bio</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter bio" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>


                            <Button type="submit" className="w-full cursor-pointer" disabled={isUpdatingProfile}>
                                {isUpdatingProfile ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Updating Profile...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}

                            </Button>
                        </form>
                    </Form>
                </div>
            </CardContent>
        </Card>
    )
}

export default Profile