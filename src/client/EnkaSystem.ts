import EnkaLibrary from "./EnkaLibrary";

/**
 * @typedef
 * @example
 * |hoyoType|Game Name|
 * |---|---|
 * |0|Genshin Impact|
 * |1|Honkai: Star Rail|
 */
export type HoyoType = number;

export default class EnkaSystem {
    static registerLibrary(library: EnkaLibrary): void {
        this.libraryMap.set(library.hoyoType, library);
    }

    static readonly libraryMap: Map<HoyoType, EnkaLibrary> = new Map();

    static readonly enkaUrl = "https://enka.network";
    static enkaApiUrl = "https://enka.network";
}