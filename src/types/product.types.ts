export type Product = {
    id: string;
    name: string;
    sku: string;
    description?: string;
    price: number;
    category: string;
    stock: number;
    isActive: boolean;
};

export type ProductFormValues = Omit<Product, "id">;

export type ProductFilters = {
    q: string;
    category: string;
    isActive: "all" | "true" | "false";
};
