import { JsonReader, JsonObject } from "config_file.js";
import EnkaSystem from "../client/EnkaSystem";

/**
 * The Enka.Network account
 */
class EnkaProfile {
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
    constructor(data: JsonObject) {

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
}

export default EnkaProfile;