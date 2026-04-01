"use server";

import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

export const getAllCategories = async () => {
    const token = (await cookies()).get("accessToken")?.value;
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/categories`,
            {
                method: "GET",
                headers: {
                    Authorization: `${token}`,
                },
            }
        );
        return res.json();
    } catch (error: any) {
        return error;
    }
};

export const createCategory = async (categoryData: FieldValues) => {
    const token = (await cookies()).get("accessToken")?.value;
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/categories`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify(categoryData),
            }
        );
        return res.json();
    } catch (error: any) {
        return error;
    }
};

export const updateCategory = async (id: string, categoryData: FieldValues) => {
    const token = (await cookies()).get("accessToken")?.value;
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/categories/${id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify(categoryData),
            }
        );
        return res.json();
    } catch (error: any) {
        return error;
    }
};

export const deleteCategory = async (id: string) => {
    const token = (await cookies()).get("accessToken")?.value;
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/categories/${id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify({ isDeleted: true }),
            }
        );
        return res.json();
    } catch (error: any) {
        return error;
    }
};
