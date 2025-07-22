import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { FaBlog } from "react-icons/fa6";
import { FaCommentDots } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { GoDot } from "react-icons/go";
import logo from '@/assets/images/logo-white.png'
import { RouteBlog, RouteCategoryDetails, RouteBlogByCategory, RouteCommentDetails, RouteUser, RouteIndex } from "@/helpers/RouteName";
import { useDispatch, useSelector } from "react-redux";

export function AppSidebar() {

    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.authUser);
    const categoryData = useSelector((state) => state.category.categoryList);

    return (
        <Sidebar>
            <SidebarHeader className="bg-white">
                <img src={logo} width={120} />
            </SidebarHeader>
            <SidebarContent className="bg-white">
                <SidebarGroup >

                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton className=" mt-2 text-lg font-semibold">
                                <FaHome />
                                <Link to={RouteIndex} >Home</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>


                    {user && user?.user.id
                        ? <>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton className=" mt-2 text-lg font-semibold">
                                        <FaBlog />
                                        <Link to={RouteBlog}>Blogs</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>

                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton className=" mt-2 text-lg font-semibold">
                                        <FaCommentDots />
                                        <Link to={RouteCommentDetails}>Comments</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </>
                        : <></>
                    }

                    {user && user?.user?.id && user?.user.role === 'admin'
                        ? <>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton className=" mt-2 text-lg font-semibold">
                                        <BiSolidCategoryAlt />
                                        <Link to={RouteCategoryDetails}>Categories</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>


                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton className="mt-2 text-lg font-semibold">
                                        <FaUser />
                                        <Link to={RouteUser}>Users</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </>
                        : <></>}


                </SidebarGroup >

                <SidebarGroup>
                    <SidebarGroupLabel className=" mb-2 text-lg font-semibold">
                        Categories
                    </SidebarGroupLabel>

                    <SidebarMenu>
                        {categoryData && categoryData.length > 0
                            && categoryData.map(category => <SidebarMenuItem key={category._id}>
                                <SidebarMenuButton>
                                    <GoDot />
                                    <Link to={RouteBlogByCategory(category.slug)}>{category.name}</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>)
                        }

                    </SidebarMenu>

                </SidebarGroup>

            </SidebarContent>

        </Sidebar>
    )
}