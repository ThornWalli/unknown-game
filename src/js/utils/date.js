'use strict';

/**
 * Formatiert den Timestamp zu 00:00 .
 * @param  {[type]} timestamp [description]
 * @return {[type]}           [description]
 */
function timestampToTimeString(timestamp, showHours = true, showMinutes = true, showSeconds = true) {
    let value = timestamp / 1000;
    const seconds = Math.floor(value % 60);
    value /= 60;
    const minutes = Math.floor(value % 60);
    value /= 60;
    const hours = Math.floor(value);

    let time = [];
    if (showHours) {
        time.push((hours < 10 ? '0' : '') + hours);
    }
    if (showMinutes) {
        time.push((minutes < 10 ? '0' : '') + minutes);
    }
    if (showSeconds) {
        time.push((seconds < 10 ? '0' : '') + seconds);
    }

    return time.join(':');
}


export {
    timestampToTimeString
};
