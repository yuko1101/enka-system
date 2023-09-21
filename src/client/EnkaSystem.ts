import EnkaNetworkError from "../errors/EnkaNetworkError";
import UserNotFoundError from "../errors/UserNotFoundError";
import EnkaProfile from "../structures/EnkaProfile";
import EnkaLibrary, { ExtractBuildType } from "./EnkaLibrary";

import { version } from "../../package.json";
import { fetchJson } from "../utils/axios_utils";
import EnkaGameAccount from "../structures/EnkaGameAccount";
import { JsonObject, JsonReader, bindOptions } from "config_file.js";
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

/** @typedef */
export interface EnkaSystemOptions {
    enkaApiUrl: string;
    requestTimeout: number;
    userAgent: string;
}

const getEnkaProfileUrl = (enkaUrl: string, username: string) => `${enkaUrl}/api/profile/${username}`;

/**  */
class EnkaSystem {
    /** Default EnkaSystem instance. */
    static readonly instance: EnkaSystem = new EnkaSystem();
    /**  */
    static readonly enkaUrl: string = "https://enka.network";

    private readonly libraryMap: Map<HoyoType, EnkaLibrary<User, CharacterBuild>> = new Map();

    // TODO: easy way to set options
    options: EnkaSystemOptions;

    /**
     * @param options
     */
    constructor(options: Partial<EnkaSystemOptions> = {}) {
        this.options = bindOptions({
            enkaApiUrl: "https://enka.network",
            requestTimeout: 3000,
            userAgent: `enka-system@${version}`,
        }, options) as unknown as EnkaSystemOptions;
    }

    /**
     * @param library
     */
    registerLibrary(library: EnkaLibrary<User, CharacterBuild>): void {
        if (this.libraryMap.has(library.hoyoType)) throw new Error(`Library for HoyoType ${library.hoyoType} is already registered. Create a new EnkaSystem instance to register multiple libraries for the same HoyoType.`);
        this.libraryMap.set(library.hoyoType, library);
    }

    /**
     * @param hoyoType
     */
    getLibrary(hoyoType: HoyoType): EnkaLibrary<User, CharacterBuild> | undefined {
        return this.libraryMap.get(hoyoType);
    }

    /**
     * @param username enka.network username, not in-game nickname
     * @returns the Enka.Network account
     */
    async fetchEnkaProfile(username: string): Promise<EnkaProfile> {
        const url = getEnkaProfileUrl(this.options.enkaApiUrl, username) + "/";

        const response = await fetchJson(url, this, true);

        if (response.status !== 200) {
            switch (response.status) {
                case 404:
                    throw new UserNotFoundError(`Enka.Network Profile with username ${username} was not found.`, response.status, response.statusText);
                default:
                    throw new EnkaNetworkError(`Request to enka.network failed with unknown status code ${response.status} - ${response.statusText}\nRequest url: ${url}`, response.status, response.statusText);
            }
        }
        const data = response.data;

        return new EnkaProfile(this, data);
    }

    /**
     * @param username enka.network username, not in-game nickname
     * @param allowedHoyoTypes hoyoTypes to filter
     * @returns the all game accounts added to the Enka.Network account
     */
    async fetchEnkaGameAccounts(username: string, allowedHoyoTypes: HoyoType[] | undefined = undefined): Promise<EnkaGameAccount<EnkaLibrary<User, CharacterBuild>>[]> {
        const url = `${getEnkaProfileUrl(this.options.enkaApiUrl, username)}/hoyos/`;

        const response = await fetchJson(url, this, true);

        if (response.status !== 200) {
            switch (response.status) {
                case 404:
                    throw new UserNotFoundError(`Enka.Network Profile with username ${username} was not found.`, response.status, response.statusText);
                default:
                    throw new EnkaNetworkError(`Request to enka.network failed with unknown status code ${response.status} - ${response.statusText}\nRequest url: ${url}`, response.status, response.statusText);
            }
        }
        const data = response.data as { [hash: string]: JsonObject };

        return Object.values(data).filter(u => !allowedHoyoTypes || (u["hoyo_type"] as string) in allowedHoyoTypes).map(u => new EnkaGameAccount(this, u, username));
    }


    /**
     * @param username enka.network username, not in-game nickname
     * @param hash the game account hash
     * @returns the game account added to the Enka.Network account
     */
    async fetchEnkaGameAccount<T extends EnkaLibrary<User, CharacterBuild>>(username: string, hash: string): Promise<EnkaGameAccount<T>> {
        const url = `${getEnkaProfileUrl(this.options.enkaApiUrl, username)}/hoyos/${hash}/`;

        const response = await fetchJson(url, this, true);

        if (response.status !== 200) {
            switch (response.status) {
                case 404:
                    throw new UserNotFoundError(`Enka.Network Profile with username ${username} or EnkaGameAccount with hash ${hash} was not found.`, response.status, response.statusText);
                default:
                    throw new EnkaNetworkError(`Request to enka.network failed with unknown status code ${response.status} - ${response.statusText}\nRequest url: ${url}`, response.status, response.statusText);
            }
        }
        const data = response.data;

        return new EnkaGameAccount(this, data, username);
    }

    /**
     * @param username enka.network username, not in-game nickname
     * @param hash the game account hash
     * @returns the game character builds including saved builds in the Enka.Network game account
     */
    async fetchEnkaCharacterBuilds<T extends EnkaLibrary<User, CharacterBuild>>(username: string, hash: string): Promise<{ [characterId: string]: ExtractBuildType<T>[] }> {

        const url = `${getEnkaProfileUrl(this.options.enkaApiUrl, username)}/hoyos/${hash}/builds/`;

        const response = await fetchJson(url, this, true);

        if (response.status !== 200) {
            switch (response.status) {
                case 404:
                    throw new UserNotFoundError(`Enka.Network Profile with username ${username} or EnkaGameAccount with hash ${hash} was not found.`, response.status, response.statusText);
                default:
                    throw new EnkaNetworkError(`Request to enka.network failed with unknown status code ${response.status} - ${response.statusText}\nRequest url: ${url}`, response.status, response.statusText);
            }
        }

        const json = new JsonReader(response.data);

        const entries = json.mapObject((charId, builds) => [charId, builds.mapArray((_, b) => {
            const hoyoType = b.getAsNumber("hoyo_type") as HoyoType;
            const library = this.libraryMap.get(hoyoType);
            if (!library) return null;
            return library.getCharacterBuild(b.getAsJsonObject(), username, hash);
        }).filter(nonNullable)]);

        return Object.fromEntries(entries.filter(entry => entry[1].length > 0));
    }
}

export default EnkaSystem;