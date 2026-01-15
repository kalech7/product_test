const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

export type ProductListParams = {
    q?: string;              // búsqueda por nombre/sku
    category?: string;       // filtro categoría
    isActive?: "all" | "true" | "false";
};

let mockProducts: Product[] = [
    {
        id: "1",
        name: "Auriculares Bluetooth",
        sku: "PROD-004",
        description: "Auriculares inalámbricos con cancelación de ruido",
        price: 59.99,
        category: "Electrónica",
        stock: 35,
        isActive: true,
    },
    {
        id: "2",
        name: "Mouse Inalámbrico",
        sku: "PROD-005",
        description: "Mouse ergonómico con batería recargable",
        price: 24.9,
        category: "Electrónica",
        stock: 80,
        isActive: true,
    },
    {
        id: "6",
        name: "Teclado Mecánico",
        sku: "PROD-006",
        description: "Teclado mecánico RGB con switches azules",
        price: 89.0,
        category: "Electrónica",
        stock: 25,
        isActive: true,
    },
    {
        id: "7",
        name: "Laptop Stand",
        sku: "PROD-007",
        description: "Soporte ajustable de aluminio para laptop",
        price: 32.5,
        category: "Oficina",
        stock: 60,
        isActive: true,
    },
    {
        id: "8",
        name: "Botella Térmica",
        sku: "PROD-008",
        description: "Botella térmica de acero inoxidable 750ml",
        price: 18.99,
        category: "Hogar",
        stock: 120,
        isActive: true,
    },
    {
        id: "9",
        name: "Lámpara LED Escritorio",
        sku: "PROD-009",
        description: "Lámpara LED regulable con puerto USB",
        price: 27.75,
        category: "Hogar",
        stock: 40,
        isActive: true,
    },
    {
        id: "10",
        name: "Mochila Antirrobo",
        sku: "PROD-010",
        description: "Mochila con puerto USB y cierre oculto",
        price: 64.0,
        category: "Accesorios",
        stock: 22,
        isActive: true,
    },
    {
        id: "11",
        name: "Cuaderno A5",
        sku: "PROD-011",
        description: "Cuaderno de tapa dura, 120 hojas",
        price: 6.5,
        category: "Oficina",
        stock: 200,
        isActive: true,
    },
    {
        id: "12",
        name: "Silla Ergonómica",
        sku: "PROD-012",
        description: "Silla de oficina con soporte lumbar",
        price: 189.99,
        category: "Oficina",
        stock: 12,
        isActive: true,
    },
    {
        id: "13",
        name: "Monitor 24 pulgadas",
        sku: "PROD-013",
        description: "Monitor Full HD IPS 75Hz",
        price: 159.0,
        category: "Electrónica",
        stock: 18,
        isActive: true,
    },
    {
        id: "14",
        name: "Cargador USB-C 65W",
        sku: "PROD-014",
        description: "Cargador rápido compatible con laptops",
        price: 34.99,
        category: "Electrónica",
        stock: 55,
        isActive: true,
    },
    {
        id: "15",
        name: "Cable HDMI 2m",
        sku: "PROD-015",
        description: "Cable HDMI 2.0 alta velocidad",
        price: 9.99,
        category: "Electrónica",
        stock: 150,
        isActive: true,
    },
    {
        id: "16",
        name: "Power Bank 10000mAh",
        sku: "PROD-016",
        description: "Batería externa compacta",
        price: 22.0,
        category: "Electrónica",
        stock: 70,
        isActive: true,
    },
    {
        id: "17",
        name: "Smartwatch Deportivo",
        sku: "PROD-017",
        description: "Reloj inteligente con monitor de ritmo cardíaco",
        price: 79.99,
        category: "Electrónica",
        stock: 30,
        isActive: true,
    },
    {
        id: "18",
        name: "Alfombrilla Mouse XL",
        sku: "PROD-018",
        description: "Alfombrilla extendida antideslizante",
        price: 14.5,
        category: "Accesorios",
        stock: 90,
        isActive: true,
    },
    {
        id: "19",
        name: "Cafetera Eléctrica",
        sku: "PROD-019",
        description: "Cafetera programable 12 tazas",
        price: 99.0,
        category: "Hogar",
        stock: 14,
        isActive: true,
    },
    {
        id: "20",
        name: "Termómetro Digital",
        sku: "PROD-020",
        description: "Termómetro digital de lectura rápida",
        price: 11.99,
        category: "Hogar",
        stock: 75,
        isActive: true,
    },
    {
        id: "21",
        name: "Router WiFi",
        sku: "PROD-021",
        description: "Router WiFi doble banda",
        price: 49.99,
        category: "Electrónica",
        stock: 28,
        isActive: true,
    },
    {
        id: "22",
        name: "Disco SSD 1TB",
        sku: "PROD-022",
        description: "Disco sólido 1TB SATA",
        price: 119.99,
        category: "Electrónica",
        stock: 16,
        isActive: false,
    },
    {
        id: "23",
        name: "Webcam Full HD",
        sku: "PROD-023",
        description: "Cámara web 1080p con micrófono",
        price: 39.99,
        category: "Electrónica",
        stock: 45,
        isActive: true,
    }

];

function applyFilters(items: Product[], params?: ProductListParams) {
    const q = (params?.q ?? "").trim().toLowerCase();
    const category = (params?.category ?? "").trim().toLowerCase();
    const isActive = params?.isActive ?? "all";

    return items.filter((p) => {
        const matchQ =
            !q ||
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q);

        const matchCategory = !category || p.category.toLowerCase() === category;

        const matchActive =
            isActive === "all" ||
            (isActive === "true" ? p.isActive : !p.isActive);

        return matchQ && matchCategory && matchActive;
    });
}

// Simula GET /products
export const getProducts = async (params?: ProductListParams) => {
    await delay(500);
    const filtered = applyFilters(mockProducts, params);
    return { data: filtered, total: filtered.length };
};

// Simula GET /products/:id
export const getProduct = async (id: string) => {
    await delay(300);
    const product = mockProducts.find((p) => p.id === id);
    if (!product) throw new Error("Producto no encontrado");
    return { data: product };
};

// Simula POST /products
export const createProduct = async (product: Omit<Product, "id">) => {
    await delay(800);
    const newProduct: Product = { ...product, id: Date.now().toString() };
    mockProducts = [newProduct, ...mockProducts];
    return { data: newProduct };
};

// Simula PUT /products/:id
export const updateProduct = async (id: string, patch: Omit<Product, "id">) => {
    await delay(700);
    const idx = mockProducts.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Producto no encontrado");
    const updated: Product = { ...patch, id };
    mockProducts[idx] = updated;
    return { data: updated };
};
export const deleteProduct = async (id: string) => {
    await delay(600);
    const exists = mockProducts.some((p) => p.id === id);
    if (!exists) throw new Error("Producto no encontrado");

    mockProducts = mockProducts.filter((p) => p.id !== id);
    return { data: { id } };
};