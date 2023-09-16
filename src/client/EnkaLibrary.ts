import { JsonObject } from "config_file.js";
import IUser from "../structures/IUser";

export default interface EnkaLibrary<U extends IUser = IUser> {
    hoyoType: number;

    getUser(data: JsonObject): U;
}