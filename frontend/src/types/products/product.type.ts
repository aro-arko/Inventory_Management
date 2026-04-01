export type TProduct = {
    _id: string;
    name: string;
    category: string | { _id: string, name: string };
    price: number;
    stockQuantity: number;
    minimumStockThreshold: number;
    status: 'Active' | 'Out of Stock';
    isDeleted?: boolean;
};
