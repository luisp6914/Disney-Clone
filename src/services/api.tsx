import axios from "axios";
import type { container } from "../types";

const ENDPOINT = "https://cd-static.bamgrid.com/dp-7068675309/home.json" //import.meta.env.VITE_ENDPOINT;

const api = async (): Promise<container[]> => {
    try {
        const response = await axios.get(ENDPOINT);
        //console.log(response.data.data.StandardCollection.containers);
        return response.data.data.StandardCollection.containers;
    } catch (error) {
        console.error("Failed to fetch data", error);
        throw error;
    }
}

export default api;