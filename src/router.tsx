import {
    createRootRoute,
    createRoute,
    createRouter,
} from "@tanstack/react-router";

import RootLayout from "./components/header";

import ProductsListPage from "./pages/products/ProductsListPage";
import ProductCreatePage from "./pages/products/ProductCreatePage";
import ProductEditPage from "./pages/products/ProductEditPage";

export const rootRoute = createRootRoute({
    component: RootLayout,
});

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

const routeTree = rootRoute.addChildren([productsRoute, productNewRoute, productEditRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
