import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { ProductFilters, ProductFormValues } from "../types/product.types";
import * as api from "../api/mockProductsApi";

export const productKeys = {
    all: ["products"] as const,
    list: (filters: ProductFilters) => [...productKeys.all, "list", filters] as const,
    detail: (id: string) => [...productKeys.all, "detail", id] as const,
};

export function useProducts(filters: ProductFilters) {
    return useQuery({
        queryKey: productKeys.list(filters),
        queryFn: () => api.getProducts(filters),
        staleTime: 15_000,
    });
}

export function useProduct(id: string) {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn: () => api.getProduct(id),
        enabled: !!id,
    });
}

export function useCreateProduct() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: ProductFormValues) => api.createProduct(payload),
        onSuccess: async () => {
            toast.success("Producto creado");
            await qc.invalidateQueries({ queryKey: productKeys.all });
        },
        onError: (e: any) => toast.error(e?.message ?? "Error al crear producto"),
    });
}

export function useUpdateProduct(id: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: ProductFormValues) => api.updateProduct(id, payload),
        onSuccess: async () => {
            toast.success("Producto actualizado");
            await qc.invalidateQueries({ queryKey: productKeys.all });
            await qc.invalidateQueries({ queryKey: productKeys.detail(id) });
        },
        onError: (e: any) => toast.error(e?.message ?? "Error al actualizar producto"),
    });
}
export function useDeleteProduct() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => api.deleteProduct(id),
        onSuccess: async () => {
            toast.success("Producto eliminado");
            await qc.invalidateQueries({ queryKey: productKeys.all });
        },
        onError: (e: Error) => toast.error(e.message),
    });
}
