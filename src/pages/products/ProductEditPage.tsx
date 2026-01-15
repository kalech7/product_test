import { useNavigate } from "@tanstack/react-router";
import ProductForm from "../../components/ProductForm";
import { useProduct, useUpdateProduct } from "../../queries/products.queries";
import type { ProductFormValues } from "../../schemas/product.schema";
import { productEditRoute } from "../../router";

export default function ProductEditPage() {
    const { productId } = productEditRoute.useParams();
    const navigate = useNavigate();

    const detail = useProduct(productId);
    const update = useUpdateProduct(productId);

    if (detail.isLoading) return <div>Cargando...</div>;

    if (detail.isError) {
        return <div className="text-red-600">Error: {detail.error.message}</div>;
    }

    // ✅ Garantiza data definida
    if (!detail.isSuccess) {
        return <div>No se pudo cargar el producto.</div>;
    }

    const p = detail.data.data;

    const onSubmit = async (values: ProductFormValues) => {
        await update.mutateAsync(values);
        navigate({ to: "/products" });
    };

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold">Editar producto</h1>

            <div className="rounded border bg-white p-4">
                <ProductForm
                    submitLabel="Guardar"
                    onSubmit={onSubmit}
                    isSubmitting={update.isPending}
                    defaultValues={p}
                />
            </div>
        </div>
    );
}
