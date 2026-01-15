import { Outlet, useMatches } from "@tanstack/react-router";

const ROUTE_TITLES: Record<string, string> = {
    "/products": "Productos",
    "/products/new": "Agregar producto",
    "/products/$productId/edit": "Editar producto",
};

export default function RootLayout() {
    const matches = useMatches();
    const current = matches[matches.length - 1];
    const title = ROUTE_TITLES[current?.routeId ?? ""] ?? "Productos";

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <header className="border-b bg-white">
                <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
                    <div className="font-semibold">Products store</div>

                    <nav className="text-sm flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{title}</span>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 py-6">
                <Outlet />
            </main>
        </div>
    );
}
