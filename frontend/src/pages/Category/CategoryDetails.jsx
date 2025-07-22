import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RouteAddCategory, RouteEditCategory } from '@/helpers/RouteName'
import React from 'react'
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
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux'
import { deleteCategory, fetchCategories } from '@/store/category-slice/categorySlice'

const CategoryDetails = () => {

  const dispatch = useDispatch()

  const categoryData = useSelector((state) => state.category.categoryList);


  async function handleDelete(id) {
    dispatch(deleteCategory(id))
  }



  return (
    <div>
      <Card>
        <CardHeader>
          <div>
            <Button asChild>
              <Link to={RouteAddCategory}>
                Add Category
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>

            <TableHeader>
              <TableRow>
                <TableHead>Category </TableHead>
                <TableHead>Slug </TableHead>

                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryData ?
                categoryData.map(category =>

                  <TableRow key={category._id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell className="flex gap-3">
                      <Button variant="outline" className="hover:bg-violet-500 hover:text-white cursor-pointer" asChild>
                        <Link to={RouteEditCategory(category._id)}>
                          <FiEdit />
                        </Link>
                      </Button>
                      <Button onClick={() => handleDelete(category._id)} variant="outline" className="hover:bg-violet-500 hover:text-white cursor-pointer" >
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

export default CategoryDetails

