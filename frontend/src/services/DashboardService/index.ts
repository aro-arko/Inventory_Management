"use server";

import { cookies } from "next/headers";

export const getDashboardStats = async () => {
    const token = (await cookies()).get("accessToken")?.value;
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/dashboard`,
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
