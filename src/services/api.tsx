import axios from "axios";
import type { set } from "../types";

const ENDPOINT = "https://cd-static.bamgrid.com/dp-7068675309/home.json" //import.meta.env.VITE_ENDPOINT;

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