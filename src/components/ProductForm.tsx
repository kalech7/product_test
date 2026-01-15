import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    productSchema,
    type ProductFormInput,
    type ProductFormValues,
} from "../schemas/product.schema";
import { useNavigate } from "@tanstack/react-router";

type Props = {
    defaultValues?: Partial<ProductFormValues>;
    onSubmit: (values: ProductFormValues) => Promise<void> | void;
    isSubmitting?: boolean;
    submitLabel: string; // "Crear" | "Guardar"
};

export default function ProductForm({
                                        defaultValues,
                                        onSubmit,
                                        isSubmitting,
                                        submitLabel,
                                    }: Props) {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProductFormInput, any, ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            sku: "",
            description: "",
            price: 0,
            category: "",
            stock: 0,
            isActive: true,
            ...defaultValues,
        } as any,
    });

    // Inputs: limpios, sin borde negro, con focus elegante
    const control =
        "w-full rounded-xl bg-white px-3.5 py-2.5 text-sm text-slate-900 " +
        "border border-slate-200 shadow-sm " +
        "placeholder:text-slate-400 " +
        "focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 " +
        "transition";

    const label = "text-sm font-medium text-slate-700";
    const help = "text-xs text-slate-500";
    const err = "text-xs text-red-600";

    const isCreate = submitLabel.toLowerCase().includes("crear");

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Form grid sin “caja” marcada */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-1.5">
                    <label className={label}>Nombre</label>
                    <input className={control} placeholder="Ej: Monitor 24 pulgadas" {...register("name")} />
                    {errors.name?.message ? <p className={err}>{String(errors.name.message)}</p> : <p className={help}>&nbsp;</p>}
                </div>

                <div className="space-y-1.5">
                    <label className={label}>SKU</label>
                    <input
                        className={`${control} font-mono`}
                        placeholder="Ej: PROD-024"
                        {...register("sku")}
                    />
                    {errors.sku?.message ? <p className={err}>{String(errors.sku.message)}</p> : <p className={help}>&nbsp;</p>}
                </div>

                <div className="space-y-1.5">
                    <label className={label}>Categoría</label>
                    <input className={control} placeholder="Ej: Electrónica" {...register("category")} />
                    {errors.category?.message ? <p className={err}>{String(errors.category.message)}</p> : <p className={help}>&nbsp;</p>}
                </div>

                <div className="space-y-1.5">
                    <label className={label}>Precio</label>
                    <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-400 text-sm">
              $
            </span>
                        <input
                            className={`${control} pl-7`}
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...register("price")}
                        />
                    </div>
                    {errors.price?.message ? <p className={err}>{String(errors.price.message)}</p> : <p className={help}>&nbsp;</p>}
                </div>

                <div className="space-y-1.5">
                    <label className={label}>Stock</label>
                    <input className={control} type="number" step="1" placeholder="0" {...register("stock")} />
                    {errors.stock?.message ? <p className={err}>{String(errors.stock.message)}</p> : <p className={help}>&nbsp;</p>}
                </div>

                <div className="space-y-1.5">
                    <label className={label}>Estado</label>
                    <select className={control} {...register("isActive")}>
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </select>
                    {errors.isActive?.message ? <p className={err}>{String(errors.isActive.message)}</p> : <p className={help}>&nbsp;</p>}
                </div>

                <div className="space-y-1.5 md:col-span-2">
                    <label className={label}>Descripción</label>
                    <textarea
                        className={`${control} min-h-[120px] resize-y`}
                        placeholder="Descripción breve del producto (opcional)"
                        {...register("description")}
                    />
                    {errors.description?.message ? <p className={err}>{String(errors.description.message)}</p> : <p className={help}>Opcional.</p>}
                </div>
            </div>

            {/* Acciones: botones claramente distintos */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                {/* Regresar: ghost/outline */}
                <button
                    type="button"
                    onClick={() => navigate({ to: "/products" })}
                    disabled={!!isSubmitting}
                    className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold
                     border border-slate-200 bg-white text-slate-700
                     hover:bg-slate-50 hover:border-slate-300
                     focus:outline-none focus:ring-4 focus:ring-slate-200/60
                     disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    Regresar
                </button>

                {/* Primario: claramente “Crear/Guardar” */}
                <button
                    type="submit"
                    disabled={!!isSubmitting}
                    className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold
                      text-white shadow-sm
                      focus:outline-none focus:ring-4
                      disabled:opacity-50 disabled:cursor-not-allowed transition
                      ${
                        isCreate
                            ? "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500/20"
                            : "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500/20"
                    }`}
                >
                    {isSubmitting ? "Guardando..." : submitLabel}
                </button>
            </div>
        </form>
    );
}
