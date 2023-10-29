import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { JsonObject } from "config_file.js";
import EnkaSystem from "../client/EnkaSystem";

/**
 * @param url
 * @param enableTimeout
 */
export async function fetchJson(url: string, system: EnkaSystem, enableTimeout = false): Promise<AxiosResponse> {
    const headers: JsonObject = { "User-Agent": system.options.userAgent };

    const options: AxiosRequestConfig = { headers } as AxiosRequestConfig;
    if (enableTimeout) options.timeout = system.options.requestTimeout;

    const res: AxiosResponse = await (async () => {
        try {
            return await axios.get(url, options);
        } catch (e) {
            if (typeof e === "object" && e && "response" in e) return e.response as AxiosResponse;
            else throw e;
        }
    })();


    if (res.data) {
        try {
            res.data = JSON.parse(res.data);
        } catch (e) {
            // do not parse if it is not json due to some error
        }
    }

    return res;
}