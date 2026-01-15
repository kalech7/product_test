import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(2, "Nombre muy corto"),
    sku: z
        .string()
        .min(3, "SKU muy corto")
        .regex(/^[A-Z0-9-]+$/i, "SKU inválido (usa letras, números y guiones)"),
    description: z.string().optional(),

    // coerciones (inputs llegan como string desde inputs HTML)
    price: z.coerce.number().min(0, "Precio debe ser >= 0"),
    category: z.string().min(2, "Categoría requerida"),
    stock: z.coerce.number().int("Stock debe ser entero").min(0, "Stock debe ser >= 0"),
    isActive: z.coerce.boolean(),
});

// Tipo de SALIDA (después de parse/coerce) → el más común para onSubmit
export type ProductFormValues = z.output<typeof productSchema>;

// Tipo de ENTRADA (antes de coerce) → útil si usas z.coerce mucho
export type ProductFormInput = z.input<typeof productSchema>;
