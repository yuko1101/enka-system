import { JsonReader, JsonObject } from "config_file.js";
import EnkaSystem, { HoyoType } from "../client/EnkaSystem";
import IUser from "./IUser";

/** @typedef */
export type GameServerRegion = "" | "CN" | "B" | "NA" | "EU" | "ASIA" | "TW";

/**
 * The game account added to the Enka.Network account.
 * @en EnkaGameAccount
 */
class EnkaGameAccount<U extends IUser = IUser> {
    /** Enka.Network username, not in-game nickname */
    readonly username: string;
    /**  */
    readonly hash: string;
    /**  */
    readonly hoyoType: HoyoType;
    /** [Genshin User](User) or [Star Rail User](https://starrail.vercel.app/docs/api/User) */
    readonly user: U | unknown;
    /**  */
    readonly uid: number | null;
    /**  */
    readonly isVerified: boolean;
    /**  */
    readonly isPublic: boolean;
    /**  */
    readonly isUidPublic: boolean;
    /**  */
    readonly verificationCode: string | null;
    /**  */
    readonly verificationExpires: Date | null;
    /**  */
    readonly verificationCodeRetries: number | null;
    /**
     * The region of the server where the account was created
     * https://cdn.discordapp.com/attachments/971472744820650035/1072868537472925767/image.png
     */
    readonly region: GameServerRegion;
    /**  */
    readonly order: number;
    /**  */
    readonly characterOrder: { [characterId: string]: number } | null;
    /**  */
    readonly url: string;

    readonly _data: JsonObject;

    /**
     * @param data
     * @param system
     * @param username
     */
    constructor(data: JsonObject, username: string) {

        this._data = data;

        this.username = username;

        const json = new JsonReader(this._data);

        this.hash = json.getAsString("hash");

        this.hoyoType = json.getAsNumber("hoyo_type");

        this.user = EnkaSystem.libraryMap.get(this.hoyoType)?.getUser(data) as U | null;

        this.uid = json.getAsNumberWithDefault(null, "uid");

        this.isVerified = json.getAsBoolean("verified");

        this.isPublic = json.getAsBoolean("public");

        this.isUidPublic = json.getAsBoolean("uid_public");

        this.verificationCode = json.getAsStringWithDefault(null, "verification_code");

        this.verificationExpires = json.has("verification_expire") ? new Date(json.getAsNumber("verification_expire")) : null;

        this.verificationCodeRetries = json.getAsNumberWithDefault(null, "verification_code_retries");

        this.region = json.getAsString("region") as GameServerRegion;

        this.order = json.getAsNumber("order");

        this.characterOrder = json.getValue("avatar_order") as { [characterId: string]: number } | null;

        this.url = `${EnkaSystem.enkaUrl}/u/${username}/${this.hash}/`;
    }
}

export default EnkaGameAccount;