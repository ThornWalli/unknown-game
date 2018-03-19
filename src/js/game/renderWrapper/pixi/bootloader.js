'use strict';

import {
    UNITS as UNIT_TYPES,
    SPRITE_BLUEPRINTS
} from '../../types';

import './Sprite';
import './sprite/Road';
import './sprite/Source';
import './sprite/Storage';
import './sprite/Harvester';
import './sprite/depot/Vehicle';
import './sprite/resource/Iron';
import './sprite/resource/Copper';
import './sprite/source/Iron';
import './sprite/source/Copper';


// Sprites

SPRITE_BLUEPRINTS[UNIT_TYPES.DEFAULT] = {
    name: UNIT_TYPES.DEFAULT,
    path: 'assets/img/default.png',
    width: 1,
    height: 1
};
SPRITE_BLUEPRINTS[UNIT_TYPES.VEHICLE.HARVESTER.GRABBER] = {
    name: UNIT_TYPES.VEHICLE.HARVESTER.GRABBER,
    path: 'assets/img/vehicle/harvester/grabber.png',
    width: 1,
    height: 1
};
SPRITE_BLUEPRINTS[UNIT_TYPES.BUILDING.STORAGE.DEFAULT] = {
    name: UNIT_TYPES.BUILDING.STORAGE.DEFAULT,
    path: 'assets/img/building/storage.png',
    width: 1,
    height: 1
};
SPRITE_BLUEPRINTS[UNIT_TYPES.ROAD.DEFAULT] = {
    name: UNIT_TYPES.ROAD.DEFAULT,
    path: 'assets/img/road/moon.png',
    width: 3,
    height: 3,
    offset: 2
};
SPRITE_BLUEPRINTS[UNIT_TYPES.BUILDING.DEPOT.VEHICLE] = {
    name: UNIT_TYPES.BUILDING.DEPOT.VEHICLE,
    path: 'assets/img/building/vehicle_depot.png',
    width: 1,
    height: 1
};

SPRITE_BLUEPRINTS[UNIT_TYPES.RESOURCE.IRON] = {
    name: UNIT_TYPES.RESOURCE.IRON,
    path: 'assets/img/resource/iron.png',
    width: 1,
    height: 1
};
SPRITE_BLUEPRINTS[UNIT_TYPES.RESOURCE.COPPER] = {
    name: UNIT_TYPES.RESOURCE.COPPER,
    path: 'assets/img/resource/copper.png',
    width: 1,
    height: 1
};
SPRITE_BLUEPRINTS[UNIT_TYPES.SOURCE.IRON] = {
    name: UNIT_TYPES.SOURCE.IRON,
    path: 'assets/img/source/iron.png',
    width: 1,
    height: 1
};
SPRITE_BLUEPRINTS[UNIT_TYPES.SOURCE.COPPER] = {
    name: UNIT_TYPES.SOURCE.COPPER,
    path: 'assets/img/source/copper.png',
    width: 1,
    height: 1
};
