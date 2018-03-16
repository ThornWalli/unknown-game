'use strict';

const SPRITES = {
    DEFAULT: 'default',
    ROAD: {
        MOON: 'road_moon'
    },
    AREA: {
        DEFAULT: 'area_default'
    },
    VEHICLE: {
        HARVESTER: {
            GRUBBER: 'vehicle_harvester_grubber'
        }
    },
    BUILDING: {
        STORAGE: 'building_storage',
        VEHICLE_DEPOT: 'vehicle_depot'
    }
};
const SPRITES_DATA = [{
    name: SPRITES.DEFAULT,
    path: 'assets/img/default.png',
    width: 1,
    height: 1
}, {
    name: SPRITES.AREA.DEFAULT,
    path: 'assets/img/areas.png',
    width: 3,
    height: 3,
    offset: 2
}, {
    name: SPRITES.ROAD.MOON,
    path: 'assets/img/road/moon.png',
    width: 3,
    height: 3,
    offset: 2
}, {
    name: SPRITES.VEHICLE.HARVESTER.GRUBBER,
    path: 'assets/img/vehicle/harvester/grabber.png',
    width: 1,
    height: 1
}, {
    name: SPRITES.BUILDING.STORAGE,
    path: 'assets/img/building/storage.png',
    width: 1,
    height: 1
}, {
    name: SPRITES.BUILDING.VEHICLE_DEPOT,
    path: 'assets/img/building/vehicle_depot.png',
    width: 1,
    height: 1
}];

export {
    SPRITES,
    SPRITES_DATA
};
