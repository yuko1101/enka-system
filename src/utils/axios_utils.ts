import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { JsonObject } from "config_file.js";
import EnkaSystem from "../client/EnkaSystem";

/**
 * @param url
 * @param enableTimeout
 */
export async function fetchJson(url: string, enableTimeout = false): Promise<AxiosResponse> {
    const headers: JsonObject = { "User-Agent": EnkaSystem.options.userAgent };

    const options: AxiosRequestConfig = { headers } as AxiosRequestConfig;
    if (enableTimeout) options.timeout = EnkaSystem.options.requestTimeout;

    const res = await axios.get(url, options);

    try {
        res.data = JSON.parse(res.data);
    } catch (e) {
        // do not parse if it is not json due to some error
    }

    return res;
}
