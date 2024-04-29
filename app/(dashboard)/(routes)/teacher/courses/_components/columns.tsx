"use client";

import { Button } from "@/components/ui/button";
import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { formatprice } from "@/lib/format";
import Image from "next/image";

export const columns: ColumnDef<Course>[] = [
  {
    id: "imageUrl",
    cell: ({ row }) => {
      const { imageUrl } = row.original;

      return (
        <div>
          {imageUrl === null ? (
            "No Image"
          ) : (
            <Image src={imageUrl} alt="image" width={100} height="100" />
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price") || "0");
      const isFree = row.original.isFree;

      return (
        <div className="text-right font-medium flex justify-start">
          {isFree === null || (isFree === false && amount === 0)
            ? "No Price"
            : formatprice(amount) === "$0.00"
            ? "Free"
            : formatprice(amount)}
        </div>
      );
    },
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Publish
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished") || false;
      if (isPublished) {
        return <Badge className="bg-sky-700">Published</Badge>;
      } else {
        return <Badge className="bg-slate-500">Draft</Badge>;
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MoreHorizontal className="h-4 w-4 mr-2 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/teacher/courses/${id}`}>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>

            <DropdownMenuItem
              onClick={async () => {
                await axios.delete(`/api/courses/${id}`);

                toast.success("Course deleted");
                window.location.replace(window.location.pathname);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
