// src/router.ts
import {
    createRootRoute,
    createRoute,
    createRouter,
    redirect,
} from "@tanstack/react-router";

import RootLayout from "./components/header";

import ProductsListPage from "./pages/products/ProductsListPage";
import ProductCreatePage from "./pages/products/ProductCreatePage";
import ProductEditPage from "./pages/products/ProductEditPage";

// 1) Root route (layout)
export const rootRoute = createRootRoute({
    component: RootLayout,
});

// 2) redirect to "/products dejamos el / para tener una landing page de bienvenida o darse a conocer"
export const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    beforeLoad: () => {
        throw redirect({
            to: "/products",
            replace: true, // evita dejar "/" en el historial
        });
    },
});

// 3) Products routes
export const productsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/products",
    component: ProductsListPage,
});

export const productNewRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/products/new",
    component: ProductCreatePage,
});

export const productEditRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/products/$productId/edit",
    component: ProductEditPage,
});

// 4) Route tree + router
const routeTree = rootRoute.addChildren([
    indexRoute,
    productsRoute,
    productNewRoute,
    productEditRoute,
]);

export const router = createRouter({ routeTree });

