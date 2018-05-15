'use strict';

import Vehicle from '../Vehicle';
import ItemStorage from '../abstract/ItemStorage';

import SyncPromise from 'sync-p';

import {
    ACTIONS as ACTION_TYPES,
    UNITS as UNIT_TYPES,
    ITEMS
} from '../../../types';

import {
    getSortedUnitByDistance,
    getNearUnitsByItemType
} from '../../../utils/unit';


export default class Transporter extends ItemStorage(Vehicle) {

    constructor(app, unit) {
        super(app, unit);
        this.maxItemStorageItemValue = 20;
        this._transporterAvailableItemTypes = []; // ITEMS.FOOD.DEFAULT
        this._transporterPreferredItemType = null;
        this._transporterPreferredStorageUnit = null;
    }

    /*
     * Functions
     */

    start() {}

    onSelectSecondary(unit) {
        if (unit) {
            console.log('Transporter onSelectSecondary');
            if (
                (this._transporterAvailableItemTypes.length < 1 || unit.isType(UNIT_TYPES.ITEM_STORAGE) && this._transporterAvailableItemTypes.find(itemType => unit.module.hasItem(itemType)))
            ) {
                return this.moveToResource(unit).catch(err => {
                    console.error(err);
                    throw err;
                });
            } else if (unit.isType(UNIT_TYPES.BUILDING.STORAGE.DEFAULT)) {
                return this.unloadItems(unit);
            }
        }
        return Vehicle.prototype.onSelectSecondary.apply(this, arguments);
    }


    /**
     * Unit bewegt sich zu einem Lager.
     * @return {Promise}
     */
    moveToStorage(storageUnit) {
        return this.moveToUnit(storageUnit || this.getStorage());
    }

    /**
     * Zieht Rohstoffe von der angegebenen Unit ab.
     * @param  {game.base.Unit} unit
     * @param {game.types.items} itemType
     * @return {Promise}
     */
    loadItems(unit, itemType) {
        if (unit.module.isItemStorageEmpty()) {
            // Resource is empty
            return this.collectItems(itemType);
        } else {
            itemType = itemType || unit.module.getItemStorageAvailableItems(this.allowedItemsStorageItems).shift();
            if (!itemType) {
                console.error('ItemStorage empty');
                return SyncPromise.resolve();
            }
            this.log('Load items…');

            return this.app.unitActions.add({
                type: ACTION_TYPES.TRANSFER,
                unit: this.unit,
                startArgs: [unit, itemType, this.getFreeItemStorageValue(), true]
            });
        }
    }

    /**
     * Transferiert Rohstoffe zur angegebenen Unit.
     * @param  {game.base.Unit} unit
     * @return {Promise}
     */
    unloadItems(unit) {
        var abort = () => {
            this._transporterPreferredItemType = null;
            return this.moveToDepot();
        };
        if (unit.module.isItemStorageFull()) {
            this.log('Storage full, move to other…');
            return this.moveToAvailableStorage();
        } else if (!unit.module.isItemStorageFull()) {
            return this.moveToStorage().then(() => {
                // Ist beim Lager und entleert sich.
                const itemType = this.getAvailableItem();
                if (!itemType) {
                    console.error('ItemStorage empty');
                    return abort();
                } else if (!unit.module.isFreeAndAllowedItem()) {
                    return this.moveToAvailableStorage();
                }
                this.log('Unload items…');
                return this.app.unitActions.add({
                    type: ACTION_TYPES.TRANSFER,
                    unit: this.unit,
                    startArgs: [unit, itemType, this.getItemStorageItemValue(itemType)]
                }).then(() => {
                    return this.afterUnloadItems(unit);
                });
            });
        } else {
            return abort();
        }
    }

    afterUnloadItems() {
        if (this.unit.module.isItemStorageEmpty()) {
            return this.collectItems();
        }
    }


    /**
     * Startet zum einsammeln von Rohstoffen.
     * @return {Promise}
     */
    collectItems(itemType) {
        if (!this.isItemStorageFull()) {

            itemType = itemType || this.transporterPreferredItemType || (this._transporterAvailableItemTypes ? this._transporterAvailableItemTypes[0] : null);
            // console.log('collectItems', type || this.transporterPreferredItemType);
            const units = getNearUnitsByItemType(this.app.map.units, this.unit.position, itemType);

            let unit = null;

            // Eine nicht volle Resource wird bevorzugt.
            units.forEach(data => {
                if (!unit || data.unit.module.getItemStorageItemValue(itemType) < unit.module.getItemStorageItemValue(itemType)) {
                    unit = data.unit;
                }
            });

            if (units.length > 0) {
                this.log('Go to resource…');
                if (!unit) {
                    unit = units.shift().unit;
                }
                if (!unit.module.isItemStorageEmpty()) {
                    return this.moveToResource(unit);
                }
            }
        }
        return this.unloadItems(this.transporterPreferredStorageUnit || this.getNearOptimalStorage());
    }

    cleanStorage(unit, type){}

    moveToResource(unit, type) {
        this.transporterPreferredItemType = this.getAvailableItem();
        if (this.unit.module.isItemStorageFull()) {
            // Ist voll und fährt zum Lager.
            this.log('Resource collected, go to Storage');
            return this.unloadItems();
        } else {
            return this.moveToUnit(unit).then(() => {
                this.log('Collect resource…');
                return this.loadItems(unit, type);
            }).then(() => {
                // Noch leer, sammelt weiter Ressourcen.
                this.log('Resource collected, go to next Resource');
                return this.collectItems();
            });
        }
    }

    getNearOptimalStorage() {
        const unit = getSortedUnitByDistance(this.unit.position, this.app.runtimeObserver.buildings.filter(building => {
            return building.isType(UNIT_TYPES.BUILDING.STORAGE.DEFAULT) && building.isType(UNIT_TYPES.ITEM_STORAGE) && building.module.isFreeAndAllowedItem(this.getAvailableItem());
        })).shift();
        if (unit) {
            return unit.unit;
        }
        return null;
    }

    getAvailableItem() {
        return this.unit.module.getItemStorageAvailableItems(this.allowedItemsStorageItems).shift();
    }
    moveToAvailableStorage() {
        const storage = this.getNearOptimalStorage();
        this._transporterPreferredStorageUnit = storage;
        if (storage) {

            return this.moveToUnit(storage).then(() => {
                return this.unloadItems(storage);
            });
        } else {
            return SyncPromise.resolve();
        }
    }

    getStorage() {
        return this._transporterPreferredStorageUnit || this.getNearOptimalStorage();
    }

    /*
     * Properties
     */

    /**
     * Ruft die erlaubten Item Typs ab.
     * @return {game.types.Item}
     */
    get transporterAvailableItemTypes() {
        return this._transporterAvailableItemTypes;
    }
    /**
     * Legt die erlaubten Item Typs fest.
     * @param {game.types.Item} value
     */
    set transporterAvailableItemTypes(value) {
        this._transporterAvailableItemTypes = value;
        this.trigger('change.transporterAvailableItemTypes', this, value);
    }

    /**
     * Ruft den bevorzugte Item Typ ab.
     * @return {game.types.Item}
     */
    get transporterPreferredItemType() {
        return this._transporterPreferredItemType;
    }
    /**
     * Legt den bevorzugten Item Typ fest.
     * @param {game.types.Item} value
     */
    set transporterPreferredItemType(value) {
        this._transporterPreferredItemType = value;
        this.trigger('change.transporterPreferredItemType', this, value);
    }

    /**
     * Ruft das bevorzugte Lager ab.
     * @return {game.base.Unit}
     */
    get transporterPreferredStorageUnit() {
        return this._transporterPreferredStorageUnit;
    }
    /**
     * Legt das bevorzugte Lager fest.
     * @param {game.base.Unit} value
     */
    set transporterPreferredStorageUnit(value) {
        this._transporterPreferredStorageUnit = value;
        this.trigger('transporterPreferredStorageUnit.change', this, value);
    }

}
