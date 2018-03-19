'use strict';

import Abstract_Neighbor from './Neighbor';


/**
 * Abstract Class Neighbor
 */
const Road = Abstract => class extends Abstract_Neighbor(Abstract) {
    constructor() {
        super();
    }
};

export default Road;
