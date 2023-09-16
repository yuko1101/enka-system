import EnkaNetworkError from "../errors/EnkaNetworkError";
import UserNotFoundError from "../errors/UserNotFoundError";
import EnkaProfile from "../structures/EnkaProfile";
import EnkaLibrary from "./EnkaLibrary";

import { version } from "../../package.json";
import { fetchJson } from "../utils/axios_utils";
import EnkaGameAccount from "../structures/EnkaGameAccount";
import { JsonObject } from "config_file.js";

/**
 * @typedef
 * @example
 * |hoyoType|Game Name|
 * |---|---|
 * |0|Genshin Impact|
 * |1|Honkai: Star Rail|
 */
export type HoyoType = number;

export interface EnkaSystemOptions {
    enkaApiUrl: string;
    requestTimeout: number;
    userAgent: string;
}

const getEnkaProfileUrl = (enkaUrl: string, username: string) => `${enkaUrl}/api/profile/${username}`;

export default class EnkaSystem {
    static readonly libraryMap: Map<HoyoType, EnkaLibrary> = new Map();

    static readonly enkaUrl = "https://enka.network";
    static options: EnkaSystemOptions = {
        enkaApiUrl: "https://enka.network",
        requestTimeout: 3000,
        userAgent: `enka-system@${version}`,
    };

    static registerLibrary(library: EnkaLibrary): void {
        this.libraryMap.set(library.hoyoType, library);
    }

    /**
     * @param username enka.network username, not in-game nickname
     * @returns the Enka.Network account
     */
    static async fetchEnkaProfile(username: string): Promise<EnkaProfile> {
        const url = getEnkaProfileUrl(this.enkaUrl, username) + "/";

        const response = await fetchJson(url, true);

        if (response.status !== 200) {
            switch (response.status) {
                case 404:
                    throw new UserNotFoundError(`Enka.Network Profile with username ${username} was not found.`, response.status, response.statusText);
                default:
                    throw new EnkaNetworkError(`Request to enka.network failed with unknown status code ${response.status} - ${response.statusText}\nRequest url: ${url}`, response.status, response.statusText);
            }
        }
        const data = response.data;

        return new EnkaProfile(data);
    }

    /**
     * @param username enka.network username, not in-game nickname
     * @returns the all game accounts added to the Enka.Network account
     */
    static async fetchGameAccounts(username: string, allowedHoyoTypes: HoyoType[] | undefined = undefined): Promise<EnkaGameAccount[]> {
        const url = `${getEnkaProfileUrl(this.enkaUrl, username)}/hoyos/`;

        const response = await fetchJson(url, true);

        if (response.status !== 200) {
            switch (response.status) {
                case 404:
                    throw new UserNotFoundError(`Enka.Network Profile with username ${username} was not found.`, response.status, response.statusText);
                default:
                    throw new EnkaNetworkError(`Request to enka.network failed with unknown status code ${response.status} - ${response.statusText}\nRequest url: ${url}`, response.status, response.statusText);
            }
        }
        const data = response.data as { [hash: string]: JsonObject };

        return Object.values(data).filter(u => !allowedHoyoTypes || (u["hoyo_type"] as string) in allowedHoyoTypes).map(u => new EnkaGameAccount(u, username));
    }
}