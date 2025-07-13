import axios from "axios";
import type { set } from "../types";

const ENDPOINT = import.meta.env.VITE_ENDPOINT;

const api = async (): Promise<set> => {
    try {
        const response = await axios.get(ENDPOINT);
        return response.data.data.StandardCollection.containers[0].set;
    } catch (error) {
        console.error("Failed to fetch data", error);
        throw error;
    }
}

export default api;