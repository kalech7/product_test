import { useNavigate } from "@tanstack/react-router";
import ProductForm from "../../components/ProductForm";
import { useCreateProduct } from "../../queries/products.queries";
import type { ProductFormValues } from "../../schemas/product.schema";

export default function ProductCreatePage() {
    const navigate = useNavigate();
    const create = useCreateProduct();

    const onSubmit = async (values: ProductFormValues) => {
        await create.mutateAsync(values);
        navigate({ to: "/products" });
    };

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold">Nuevo producto</h1>
            <div className="rounded border bg-white p-4">
                <ProductForm
                    submitLabel="Crear"
                    onSubmit={onSubmit}
                    isSubmitting={create.isPending}
                />
            </div>
        </div>
    );
}
