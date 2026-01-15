import { Link } from "@tanstack/react-router";
import { useProducts, useDeleteProduct } from "../../queries/products.queries";
import { useProductUIStore } from "../../store/productUI.store";
import { useState } from "react";
import type { ProductFilters } from "../../types/product.types";
import { EditIcon, TrashIcon,DownloadIcon } from "../../components/icons";
import { exportCSV } from "../../utils/csv";

export default function ProductsListPage() {
    const { filters, setFilters, resetFilters } = useProductUIStore();
    const { data, isLoading, error, isError } = useProducts(filters);

    const [currentPage, setCurrentPage] = useState(1);

    const del = useDeleteProduct();

    const itemsPerPage = 12; // 4 columnas x 3 filas
    const items = data?.data ?? [];

    // Paginación
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = items.slice(startIndex, endIndex);

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((p) => p + 1);
    };

    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage((p) => p - 1);
    };

    // Reset page when filters change
    const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const onDelete = async (id: string) => {
        const ok = window.confirm("¿Seguro que deseas eliminar este producto?");
        if (!ok) return;
        await del.mutateAsync(id);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 truncate">
                            Productos
                        </h1>
                        <p className="text-slate-600 mt-1 text-sm md:text-base">
                            Gestiona tu inventario de productos
                        </p>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
                        <button
                            type="button"
                            onClick={() =>
                                exportCSV(items, {
                                    delimiter: "|",
                                    filename: "productos_exportados",
                                    includeExcelSepHint: true,
                                })
                            }
                            className="
                                inline-flex items-center justify-center gap-2
                                w-full sm:w-auto
                                px-4 py-2.5
                                rounded-lg
                                border border-emerald-300
                                text-sm font-medium
                                text-emerald-700
                                hover:bg-emerald-50
                                transition-colors
                              "
                        >
                            <DownloadIcon className="w-4 h-4" />
                            Descargar CSV
                        </button>

                        <Link
                            to="/products/new"
                            className="
                                inline-flex items-center justify-center
                                w-full sm:w-auto
                                px-4 py-2.5
                                rounded-lg
                                bg-indigo-600 hover:bg-indigo-700
                                text-white text-sm font-medium
                                transition-colors
                                shadow-sm
                              "
                        >
                            + Nuevo producto
                        </Link>
                    </div>
                </div>


                {/* Filters Section */}
                <section className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-slate-900">Filtros</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Buscar
                            </label>
                            <input
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                                placeholder="Nombre o SKU"
                                value={filters.q}
                                onChange={(e) => handleFilterChange({ q: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Categoría
                            </label>
                            <input
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                                placeholder="Ej: Electrónica"
                                value={filters.category}
                                onChange={(e) => handleFilterChange({ category: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Estado
                            </label>
                            <select
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow bg-white"
                                value={filters.isActive}
                                onChange={(e) =>
                                    handleFilterChange({ isActive: e.target.value as ProductFilters["isActive"] })
                                }
                            >
                                <option value="all">Todos</option>
                                <option value="true">Activos</option>
                                <option value="false">Inactivos</option>
                            </select>
                        </div>
                    </div>

                    <button
                        className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => {
                            resetFilters();
                            setCurrentPage(1);
                        }}
                    >
                        Limpiar filtros
                    </button>
                </section>

                {/* Cards Section */}
                <section className="space-y-4">
                    {isLoading ? (
                        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-12 text-center">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
                            <p className="mt-4 text-slate-600">Cargando productos...</p>
                        </div>
                    ) : isError ? (
                        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-8">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-800 font-medium">Error al cargar productos</p>
                                <p className="text-red-600 text-sm mt-1">{error.message}</p>
                            </div>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-12 text-center">
                            <svg
                                className="w-16 h-16 text-slate-300 mb-4 mx-auto"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                />
                            </svg>
                            <p className="font-medium text-slate-700 text-lg">No se encontraron productos</p>
                            <p className="text-sm text-slate-500 mt-2">Intenta ajustar los filtros de búsqueda</p>
                        </div>
                    ) : (
                        <>
                            {/* Grid de tarjetas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {currentItems.map((p) => (
                                    <div
                                        key={p.id}
                                        className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                                    >
                                        {/* Header de la tarjeta */}
                                        <div className="bg-gradient-to-br from-indigo-50 to-slate-50 p-4 border-b border-slate-200">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-semibold text-slate-900 text-lg line-clamp-2">
                                                    {p.name}
                                                </h3>
                                                <span
                                                    className={`ml-2 flex-shrink-0 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                        p.isActive
                                                            ? "bg-emerald-100 text-emerald-800"
                                                            : "bg-slate-100 text-slate-800"
                                                    }`}
                                                >
                          {p.isActive ? "Activo" : "Inactivo"}
                        </span>
                                            </div>
                                            <p className="text-sm text-slate-600 font-mono">{p.sku}</p>
                                        </div>

                                        {/* Cuerpo de la tarjeta */}
                                        <div className="p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-slate-600">Categoría</span>
                                                <span className="text-sm font-medium text-slate-900">{p.category}</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-slate-600">Precio</span>
                                                <span className="text-lg font-bold text-indigo-600">
                          ${p.price.toFixed(2)}
                        </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-slate-600">Stock</span>
                                                <span
                                                    className={`text-sm font-semibold ${
                                                        p.stock > 10
                                                            ? "text-emerald-600"
                                                            : p.stock > 0
                                                                ? "text-amber-600"
                                                                : "text-red-600"
                                                    }`}
                                                >
                          {p.stock} unidades
                        </span>
                                            </div>
                                        </div>

                                        {/* Footer de la tarjeta */}
                                        <div className="p-4 pt-0 flex items-center justify-end gap-2">
                                            {/* Editar */}
                                            <Link
                                                to="/products/$productId/edit"
                                                params={{ productId: p.id }}
                                                className="inline-flex items-center justify-center w-9 h-9 rounded-lg
                                                   border border-slate-200 text-slate-600
                                                   hover:bg-indigo-50 hover:text-indigo-600
                                                   transition-colors"
                                                title="Editar producto"
                                            >
                                                <EditIcon className="w-4 h-4" />
                                            </Link>

                                            {/* Eliminar */}
                                            <button
                                                type="button"
                                                onClick={() => onDelete(p.id)}
                                                disabled={del.isPending}
                                                className="inline-flex items-center justify-center w-9 h-9 rounded-lg
                                                               border border-slate-200 text-slate-600
                                                               hover:bg-red-50 hover:text-red-600
                                                               transition-colors
                                                               disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Eliminar producto"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>

                                    </div>
                                ))}
                            </div>

                            {/* Paginación */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-4">
                                    <div className="text-sm text-slate-600">
                                        Mostrando <span className="font-medium text-slate-900">{startIndex + 1}</span> a{" "}
                                        <span className="font-medium text-slate-900">
                      {Math.min(endIndex, items.length)}
                    </span>{" "}
                                        de <span className="font-medium text-slate-900">{items.length}</span> productos
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={goToPrevPage}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Anterior
                                        </button>

                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                                                        currentPage === page
                                                            ? "bg-indigo-600 text-white"
                                                            : "text-slate-700 hover:bg-slate-100"
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={goToNextPage}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Siguiente
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}
