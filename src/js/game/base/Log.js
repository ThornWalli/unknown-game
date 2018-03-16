'use strict';

export default class Log {
    constructor(timestamp, type, text) {
        this.timestamp = timestamp;
        this.type = type;
        this.text = text;
    }
}
