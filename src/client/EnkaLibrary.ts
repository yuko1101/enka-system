import { JsonObject } from "config_file.js";
import User from "../structures/User";
import CharacterBuild from "../structures/CharacterBuild";

export default interface EnkaLibrary<U extends User> {
    hoyoType: number;

    getUser(data: JsonObject): U;
    getCharacterBuild(data: JsonObject, username: string, hash: string): CharacterBuild;
}