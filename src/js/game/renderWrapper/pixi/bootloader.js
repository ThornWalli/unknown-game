'use strict';

import {
    UNITS as UNIT_TYPES,
    SPRITE_BLUEPRINTS
} from '../../types';

import './Sprite';
import './sprite/Source';





/*
 * Sprites
 */

SPRITE_BLUEPRINTS[UNIT_TYPES.DEFAULT] = {
    name: UNIT_TYPES.DEFAULT,
    path: 'assets/img/default.png',
    width: 1,
    height: 1
};

// Vehicle

import './sprite/Transporter';
SPRITE_BLUEPRINTS[UNIT_TYPES.VEHICLE.TRANSPORTER.DEFAULT] = {
    name: UNIT_TYPES.VEHICLE.TRANSPORTER.DEFAULT,
    path: 'assets/img/vehicle/spider.png',
    width: 1,
    height: 1
};

import './sprite/Harvester';
SPRITE_BLUEPRINTS[UNIT_TYPES.VEHICLE.HARVESTER.DEFAULT] = {
    name: UNIT_TYPES.VEHICLE.HARVESTER.DEFAULT,
    path: 'assets/img/vehicle/grabber.png',
    width: 1,
    height: 1
};

SPRITE_BLUEPRINTS[UNIT_TYPES.VEHICLE.HARVESTER.GRABBER] = {
    name: UNIT_TYPES.VEHICLE.HARVESTER.GRABBER,
    path: 'assets/img/vehicle/grabber.png',
    width: 1,
    height: 1
};
SPRITE_BLUEPRINTS[UNIT_TYPES.VEHICLE.HARVESTER.SPIDER] = {
    name: UNIT_TYPES.VEHICLE.HARVESTER.SPIDER,
    path: 'assets/img/vehicle/spider.png',
    width: 1,
    height: 1
};

// Building

import './sprite/Storage';
SPRITE_BLUEPRINTS[UNIT_TYPES.BUILDING.STORAGE.DEFAULT] = {
    name: UNIT_TYPES.BUILDING.STORAGE.DEFAULT,
    path: 'assets/img/building/storage.png',
    width: 1,
    height: 1
};

import './sprite/storage/Container';
SPRITE_BLUEPRINTS[UNIT_TYPES.BUILDING.STORAGE.CONTAINER] = {
    name: UNIT_TYPES.BUILDING.STORAGE.CONTAINER,
    path: 'assets/img/building/container_storage.png',
    width: 10,
    height: 1
};

import './sprite/House';
SPRITE_BLUEPRINTS[UNIT_TYPES.BUILDING.HOUSE.DEFAULT] = {
    name: UNIT_TYPES.BUILDING.HOUSE.DEFAULT,
    path: 'assets/img/building/house.png',
    width: 1,
    height: 1
};

import './sprite/food/Greenhouse';
SPRITE_BLUEPRINTS[UNIT_TYPES.BUILDING.FOOD.GREENHOUSE] = {
    name: UNIT_TYPES.BUILDING.FOOD.GREENHOUSE,
    path: 'assets/img/building/greenhouse.png',
    width: 1,
    height: 1
};

import './sprite/depot/Vehicle';
SPRITE_BLUEPRINTS[UNIT_TYPES.BUILDING.DEPOT.VEHICLE] = {
    name: UNIT_TYPES.BUILDING.DEPOT.VEHICLE,
    path: 'assets/img/building/vehicle_depot.png',
    width: 1,
    height: 1
};

import './sprite/ContainerTeleporer';
SPRITE_BLUEPRINTS[UNIT_TYPES.BUILDING.CONTAINER_TELEPORTER] = {
    name: UNIT_TYPES.BUILDING.CONTAINER_TELEPORTER,
    path: 'assets/img/building/container_teleporter.png',
    width: 6,
    height: 2
};

// Road

import './sprite/Road';
SPRITE_BLUEPRINTS[UNIT_TYPES.ROAD.DEFAULT] = {
    name: UNIT_TYPES.ROAD.DEFAULT,
    path: 'assets/img/road/moon.png',
    width: 3,
    height: 3
};


// Resource



import './sprite/resource/Iron';
SPRITE_BLUEPRINTS[UNIT_TYPES.RESOURCE.IRON] = {
    name: UNIT_TYPES.RESOURCE.IRON,
    path: 'assets/img/resource/iron.png',
    width: 4,
    height: 1
};

import './sprite/resource/Copper';
SPRITE_BLUEPRINTS[UNIT_TYPES.RESOURCE.COPPER] = {
    name: UNIT_TYPES.RESOURCE.COPPER,
    path: 'assets/img/resource/copper.png',
    width: 4,
    height: 1
};

// Source

import './sprite/source/Iron';
SPRITE_BLUEPRINTS[UNIT_TYPES.SOURCE.IRON] = {
    name: UNIT_TYPES.SOURCE.IRON,
    path: 'assets/img/source/iron.png',
    width: 1,
    height: 1
};

import './sprite/source/Copper';
SPRITE_BLUEPRINTS[UNIT_TYPES.SOURCE.COPPER] = {
    name: UNIT_TYPES.SOURCE.COPPER,
    path: 'assets/img/source/copper.png',
    width: 1,
    height: 1
};
