/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

export const getAllProducts = async (query?: Record<string, any>) => {
    const token = (await cookies()).get("accessToken")?.value;
    const params = new URLSearchParams(query);
    const queryString = params.toString() ? `?${params.toString()}` : "";

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/products${queryString}`,
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

export const createProduct = async (productData: FieldValues) => {
    const token = (await cookies()).get("accessToken")?.value;
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/products`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify(productData),
            }
        );
        return res.json();
    } catch (error: any) {
        return error;
    }
};

export const updateProduct = async (id: string, productData: FieldValues) => {
    const token = (await cookies()).get("accessToken")?.value;
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/products/${id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify(productData),
            }
        );
        return res.json();
    } catch (error: any) {
        return error;
    }
};

export const deleteProduct = async (id: string) => {
    const token = (await cookies()).get("accessToken")?.value;
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/products/${id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify({ isDeleted: true }),
            }
        );
        console.log(res)
        return res.json();
    } catch (error: any) {
        return error;
    }
};
export const getRestockQueue = async () => {
    const token = (await cookies()).get("accessToken")?.value;
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/products/restock-queue`,
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

export const restockProduct = async (id: string, amount: number) => {
    const token = (await cookies()).get("accessToken")?.value;
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/products/${id}/restock`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify({ quantityToAdd: amount }),
            }
        );
        return res.json();
    } catch (error: any) {
        return error;
    }
};
