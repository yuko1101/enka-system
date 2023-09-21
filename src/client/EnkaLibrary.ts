import { JsonObject } from "config_file.js";
import User from "../structures/User";
import CharacterBuild from "../structures/CharacterBuild";
import { HoyoType } from "./EnkaSystem";

/** @typedef */
interface EnkaLibrary<U extends User, B extends CharacterBuild> {
    hoyoType: HoyoType;

    getUser(data: JsonObject): U;
    getCharacterBuild(data: JsonObject, username: string, hash: string): B;
}

export default EnkaLibrary;

export type ExtractUserType<T extends EnkaLibrary<User, CharacterBuild>> = T extends EnkaLibrary<infer U, CharacterBuild> ? U : never;
export type ExtractBuildType<T extends EnkaLibrary<User, CharacterBuild>> = T extends EnkaLibrary<User, infer B> ? B : never;
