import axios from "axios";

export const http = axios.create({
    baseURL: "/api", // backend
    timeout: 10_000,
});
