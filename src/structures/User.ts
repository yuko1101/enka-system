import { JsonObject, JsonReader } from "config_file.js";

export default class User {
    readonly uid: number;

    readonly _data: JsonObject;

    constructor(data: JsonReader) {
        this.uid = data.getAsNumber("uid");

        this._data = data.getAsJsonObject();
    }
}