import { JsonObject, JsonReader } from "config_file.js";

export default class User {

    readonly _data: JsonObject;

    constructor(data: JsonReader) {
        this._data = data.getAsJsonObject();
    }
}