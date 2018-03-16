"use strict";

import uniq from 'lodash/uniq';
import unionBy from 'lodash/unionBy';

export function mergeCollections(collectionA, collectionB, by) {
    return uniq(unionBy(collectionB, collectionA, by), false, by);
}
