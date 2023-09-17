import EnkaNetworkError from "../errors/EnkaNetworkError";
import UserNotFoundError from "../errors/UserNotFoundError";
import EnkaProfile from "../structures/EnkaProfile";
import EnkaLibrary from "./EnkaLibrary";

import { version } from "../../package.json";
import { fetchJson } from "../utils/axios_utils";
import EnkaGameAccount from "../structures/EnkaGameAccount";
import { JsonObject, JsonReader } from "config_file.js";
import User from "../structures/User";
import CharacterBuild from "../structures/CharacterBuild";
import { nonNullable } from "../utils/ts_utils";

/**
 * @typedef
 * @example
 * |hoyoType|Game Name|
 * |---|---|
 * |0|Genshin Impact|
 * |1|Honkai: Star Rail|
 */
export type HoyoType = 0 | 1;

export interface EnkaSystemOptions {
    enkaApiUrl: string;
    requestTimeout: number;
    userAgent: string;
}

const getEnkaProfileUrl = (enkaUrl: string, username: string) => `${enkaUrl}/api/profile/${username}`;

export default class EnkaSystem {
    static readonly libraryMap: Map<HoyoType, EnkaLibrary<User>> = new Map();

    static readonly enkaUrl = "https://enka.network";
    // TODO: easy way to set options
    static options: EnkaSystemOptions = {
        enkaApiUrl: "https://enka.network",
        requestTimeout: 3000,
        userAgent: `enka-system@${version}`,
    };

    static registerLibrary(library: EnkaLibrary<User>): void {
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
    static async fetchEnkaGameAccounts(username: string, allowedHoyoTypes: HoyoType[] | undefined = undefined): Promise<EnkaGameAccount<User>[]> {
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


    /**
     * @param username enka.network username, not in-game nickname
     * @param hash EnkaUser hash
     * @returns the game account added to the Enka.Network account
     */
    static async fetchEnkaGameAccount<U extends User>(username: string, hash: string): Promise<EnkaGameAccount<U>> {
        const url = `${getEnkaProfileUrl(this.enkaUrl, username)}/hoyos/${hash}/`;

        const response = await fetchJson(url, true);

        if (response.status !== 200) {
            switch (response.status) {
                case 404:
                    throw new UserNotFoundError(`Enka.Network Profile with username ${username} or EnkaUser with hash ${hash} was not found.`, response.status, response.statusText);
                default:
                    throw new EnkaNetworkError(`Request to enka.network failed with unknown status code ${response.status} - ${response.statusText}\nRequest url: ${url}`, response.status, response.statusText);
            }
        }
        const data = response.data;

        return new EnkaGameAccount<U>(data, username);
    }

    /**
     * @param username enka.network username, not in-game nickname
     * @param hash EnkaUser hash
     * @returns the game character builds including saved builds in Enka.Network account
     */
    static async fetchEnkaCharacterBuilds<T extends CharacterBuild>(username: string, hash: string): Promise<{ [characterId: string]: T[] }> {

        const url = `${getEnkaProfileUrl(this.enkaUrl, username)}/hoyos/${hash}/builds/`;

        const response = await fetchJson(url, true);

        if (response.status !== 200) {
            switch (response.status) {
                case 404:
                    throw new UserNotFoundError(`Enka.Network Profile with username ${username} or EnkaUser with hash ${hash} was not found.`, response.status, response.statusText);
                default:
                    throw new EnkaNetworkError(`Request to enka.network failed with unknown status code ${response.status} - ${response.statusText}\nRequest url: ${url}`, response.status, response.statusText);
            }
        }

        const json = new JsonReader(response.data);

        const entries = json.mapObject((charId, builds) => [charId, builds.mapArray((_, b) => {
            const hoyoType = b.getAsNumber("hoyo_type") as HoyoType;
            const library = EnkaSystem.libraryMap.get(hoyoType);
            if (!library) return null;
            return library.getCharacterBuild(b.getAsJsonObject(), username, hash);
        }).filter(nonNullable)]);

        return Object.fromEntries(entries);
    }
}