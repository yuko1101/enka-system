import { JsonReader, JsonObject } from "config_file.js";
import EnkaSystem, { HoyoType } from "../client/EnkaSystem";
import User from "./User";
import EnkaLibrary, { ExtractBuildType } from "../client/EnkaLibrary";
import CharacterBuild from "./CharacterBuild";
import EnkaGameAccount from "./EnkaGameAccount";

/**
 * The Enka.Network account
 */
class EnkaProfile {
    /**  */
    readonly system: EnkaSystem;
    /**  */
    readonly username: string;
    /**  */
    readonly bio: string;
    /**  */
    readonly avatar: string | null;
    /**  */
    readonly imageUrl: string | null;
    /**  */
    readonly level: number;
    /**  */
    readonly signupState: number;
    /**  */
    readonly url: string;

    readonly _data: JsonObject;

    /**
     * @param data
     * @param system
     */
    constructor(system: EnkaSystem, data: JsonObject) {

        this.system = system;
        this._data = data;

        const json = new JsonReader(this._data);

        this.username = json.getAsString("username");

        const profile = json.get("profile");

        this.bio = profile.getAsString("bio");

        this.avatar = profile.getAsNullableString("avatar");

        this.imageUrl = profile.getAsStringWithDefault(null, "image_url");

        this.level = profile.getAsNumber("level");

        this.signupState = profile.getAsNumber("signup_state");

        this.url = `${EnkaSystem.enkaUrl}/u/${this.username}/`;
    }

    /**
     * @param allowedHoyoTypes hoyoTypes to filter
     * @returns the all game accounts added to the Enka.Network account
     */
    async fetchGameAccounts(allowedHoyoTypes: HoyoType[] | undefined = undefined): Promise<EnkaGameAccount<EnkaLibrary<User, CharacterBuild>>[]> {
        return await this.system.fetchEnkaGameAccounts(this.username, allowedHoyoTypes);
    }

    /**
     * @param hash the game account hash
     * @returns the game account added to the Enka.Network account
     */
    async fetchGameAccount<T extends EnkaLibrary<User, CharacterBuild>>(hash: string): Promise<EnkaGameAccount<T>> {
        return await this.system.fetchEnkaGameAccount(this.username, hash);
    }

    /**
     * @param hash the game account hash
     * @returns the game character builds including saved builds in the Enka.Network game account
     */
    async fetchBuilds<T extends EnkaLibrary<User, CharacterBuild>>(hash: string): Promise<{ [characterId: string]: ExtractBuildType<T>[] }> {
        return await this.system.fetchEnkaCharacterBuilds(this.username, hash);
    }

}

export default EnkaProfile;