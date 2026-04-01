"use server";

import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

export const createOrder = async (orderData: FieldValues) => {
    const token = (await cookies()).get("accessToken")?.value;
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/orders`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify(orderData),
            }
        );
        return res.json();
    } catch (error: any) {
        return error;
    }
};

export const getAllOrders = async (query?: Record<string, any>) => {
    const token = (await cookies()).get("accessToken")?.value;
    const params = new URLSearchParams(query);
    const queryString = params.toString() ? `?${params.toString()}` : "";

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/orders${queryString}`,
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

export const updateOrderStatus = async (id: string, status: string) => {
    const token = (await cookies()).get("accessToken")?.value;
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/orders/${id}/status`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify({ status }),
            }
        );
        return res.json();
    } catch (error: any) {
        return error;
    }
};

export const cancelOrder = async (id: string) => {
    const token = (await cookies()).get("accessToken")?.value;
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/orders/${id}/cancel`,
            {
                method: "PATCH",
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
