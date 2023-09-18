import { JsonObject, JsonReader } from "config_file.js";

/**  */
class User {

    readonly _data: JsonObject;

    /**
     * @param data
     */
    constructor(data: JsonReader) {
        this._data = data.getAsJsonObject();
    }
}

export default User;