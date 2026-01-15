import { create } from "zustand";
import type { ProductFilters } from "../types/product.types";

type ProductUIState = {
    filters: ProductFilters;
    setFilters: (patch: Partial<ProductFilters>) => void;
    resetFilters: () => void;
};

const initial: ProductFilters = { q: "", category: "", isActive: "all" };

export const useProductUIStore = create<ProductUIState>((set) => ({
    filters: initial,
    setFilters: (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),
    resetFilters: () => set({ filters: initial }),
}));
