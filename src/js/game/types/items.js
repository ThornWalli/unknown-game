'use strict';

const ITEMS = {

    FOOD: {
        DEFAULT: 'food.default',
        VEGETABLE: 'food.vegetable'
    },

    RESOURCE: {
        DEFAULT: 'resource.default',

        // GAS

        HELIUM: 'resource.helium',
        HYDROGEN: 'resource.hydrogen',
        CARBON: 'resource.carbon',
        OXYGEN: 'resource.oxygen',


        // LIQUID

        WATER: 'resource.water',

        // SOLID

        IRON: 'resource.iron',
        COPPER: 'resource.copper',
        GOLD: 'resource.gold',
        PLATIN: 'resource.platin',
        TITAN: 'resource.titan',
        COBALT: 'resource.cobalt',
        LITHIUM: 'resource.lithium',
        URAN: 'resource.uran',
        PLUTONIUM: 'resource.plutonium',


        PLASTIC: 'resource.plastic'

    }
};

const ITEMS_DATA = [{
        type: ITEMS.FOOD.VEGETABLE,
        title: 'Gemüse (Vegetable)',
        description: 'Gemüse dient zur pflanzlichen Ernährung der Bewohner.',
        teleporterEnergy: 0.8
    },
    {
        type: ITEMS.RESOURCE.WATER,
        title: 'Wasser (Water)',
        description: 'Wasser wird überall dort benötigt, wo sich leben befindet. Menschen und Pflanzen können ohne nicht existieren.',
        teleporterEnergy: 0.2
    }
];
const ITEMS_DATA_MAP = ITEMS_DATA.reduce((result, data) => {
    result[data.type] = data;
    return result;
}, {});

export {
    ITEMS as
    default,
    ITEMS_DATA,
    ITEMS_DATA_MAP
};
