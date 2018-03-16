'use strict';
import {
    DIRECTIONS,
    TYPES as UNIT_TYPES
} from '../../utils/unit';
import {
    CELL_SIZE,
    loadFrames,
    getDirectionRotation
} from './pixi/utils';

import Position from '../../base/Position';

import {
    Application,
    SCALE_MODES,
    settings
} from 'pixi.js';

// quintOut easeOutExpo
import {
    expoOut as rotateEase
} from 'eases';

import SpriteDefault from './pixi/Sprite';
import SpriteRoadMoon from './pixi/sprite/road/Moon';
import SpriteHome from './pixi/sprite/Home';
import SpriteHarvester from './pixi/sprite/Harvester';
import SpriteVehicleDepot from './pixi/sprite/VehicleDepot';

import RenderWrapper from '../RenderWrapper';
console.log('SCALE_MODES', SCALE_MODES);
export default class PIXIWrapper extends RenderWrapper {
    constructor(display) {
        super(display);

        this._renderUnits = [];

        console.log('display', display);
        this._ready = ready.bind(this)();
    }

    // Functions
    render() {
        if (this._application) {

            const position = this.display.position;
            console.log('REDER', position);
            console.log(this._application.stage, -CELL_SIZE.width / 2 + position.x * CELL_SIZE.width, -CELL_SIZE.width / 2 + position.y * CELL_SIZE.height);
            this._application.stage.pivot.set(-CELL_SIZE.width / 2 + position.x * CELL_SIZE.width, -CELL_SIZE.width / 2 + position.y * CELL_SIZE.height);
        }
    }
    // Properties
    get ready() {
        return this._ready;
    }
}


/**
 * Ready
 */
function ready() {
    return new Promise(resolve => {

        loadFrames()
            // .then(prepareFrames)
            .then(setupApp.bind(this)).then(() => {
                this.display.app.refresh();
            })
            .then(resolve);

    });
}



function setupApp() {
    settings.SCALE_MODE = SCALE_MODES.NEAREST;
    console.log('PIXI setupApp:', this.display.visibleDimension.width, this.display.visibleDimension.height);
    this._application = new Application(this.display.visibleDimension.width, this.display.visibleDimension.height, {
        backgroundColor: 0x424552 //0x111111
    });
    this._application.stage.pivot.set(-CELL_SIZE.width / 2);
    console.log(this._application);
    this.display.containerEl.appendChild(this._application.view);

    [].concat(this.map.units.items).forEach(onAddUnit.bind(this));
    this.map.units
        .on('add', onAddUnit, this)
        .on('remove', onRemoveUnit, this)
        .on('render.unit.sprite', onRenderUnitSprite, this)
        .on('change.unit.sprite.visible', onChangeUnitSpriteVisible, this);

}

function onChangeUnitSpriteVisible(unit, visible) {
    toggleUnitVisible.bind(this)(unit, visible);
}

// Events

function onRenderUnitSprite(unit) {
    // setSpriteDirection(unit.sprite, unit.direction);
    const position = getPosition(unit.floatingPosition, this.display);
    unit.sprite.position.set(
        position.x,
        position.y
    );

    /*
     * Unit Direction + Rotation
     */
    if (unit.direction !== unit.lastDirection) {
        const rotation = getDirectionRotation(getAlign(unit.direction, unit.lastDirection));
        let value = Math.abs(unit.positionOffset.x + unit.positionOffset.y);
        value = rotateEase(value);
        unit.sprite.rotation = getDirectionRotation(unit.lastDirection) + rotation * value;
    } else {
        unit.sprite.rotation = getDirectionRotation(unit.direction);
    }

}
// Functions

function getAlign(direction, lastDirection) {
    if (direction === DIRECTIONS.TOP && lastDirection === DIRECTIONS.RIGHT || direction === DIRECTIONS.BOTTOM && lastDirection === DIRECTIONS.LEFT ||
        direction === DIRECTIONS.RIGHT && lastDirection === DIRECTIONS.BOTTOM || direction === DIRECTIONS.LEFT && lastDirection === DIRECTIONS.TOP) {
        return DIRECTIONS.LEFT;
    } else if (direction === DIRECTIONS.BOTTOM && lastDirection === DIRECTIONS.RIGHT || direction === DIRECTIONS.TOP && lastDirection === DIRECTIONS.LEFT ||
        direction === DIRECTIONS.RIGHT && lastDirection === DIRECTIONS.TOP || direction === DIRECTIONS.LEFT && lastDirection === DIRECTIONS.BOTTOM) {
        return DIRECTIONS.RIGHT;
    }

    return false;
}

function getSpriteFromUnitType(type) {
    const TYPE_TO_SPRITE = {};
    TYPE_TO_SPRITE[UNIT_TYPES.UNIT] = SpriteDefault;
    TYPE_TO_SPRITE[UNIT_TYPES.ROAD] = SpriteRoadMoon;
    TYPE_TO_SPRITE[UNIT_TYPES.HOME] = SpriteHome;
    TYPE_TO_SPRITE[UNIT_TYPES.VEHICLE.HARVESTER] = SpriteHarvester;
    TYPE_TO_SPRITE[UNIT_TYPES.BUILDING.VEHICLE_DEPOT] = SpriteVehicleDepot;
    if (TYPE_TO_SPRITE[type]) {
        return TYPE_TO_SPRITE[type];
    } else {
        return SpriteDefault;
    }
}


function createSprite(unit) {
    let spriteClass = getSpriteFromUnitType(unit.type);
    var sprite = new spriteClass(unit);

    return sprite;
}

function onAddUnit(unit) {
    const sprite = createSprite(unit);
    // sprite.on('render', onRenderUnit, this);
    //
    // move the sprite to the center of the screen
    // sprite.x = this._application.screen.width / 2;
    // sprite.y = this._application.screen.height / 2;
    const position = getPosition(unit.position, this.display);
    sprite.position.set(position.x, position.y);

    // this._application.stage.addChild(sprite);
    toggleUnitVisible.bind(this)(unit, unit.spriteVisible);
    sprite.onAdded();
}

/**
 * Fügt oder entfernt die Unit Sprite in der Stage.
 */
function toggleUnitVisible(unit, visible) {
    if (visible && !unit.sprite.parent) {
        this._application.stage.addChild(unit.sprite);
    } else if (unit.sprite.parent) {
        this._application.stage.removeChild(unit.sprite);
    }
}



function getPosition(position, display) {
    const min = display.fixedVisibleBounds.min;
    const x = (position.x - min.x) * CELL_SIZE.width,
        y = (position.y - min.y) * CELL_SIZE.height;
    return new Position(x, y);
}

function onRemoveUnit(unit) {
    this._application.stage.removeChild(unit.sprite);
}
