import { JsonObject } from "config_file.js";
import User from "../structures/User";
import CharacterBuild from "../structures/CharacterBuild";
import { HoyoType } from "./EnkaSystem";

/** @typedef */
interface EnkaLibrary<U extends User> {
    hoyoType: HoyoType;

    getUser(data: JsonObject): U;
    getCharacterBuild(data: JsonObject, username: string, hash: string): CharacterBuild;
}

export default EnkaLibrary;