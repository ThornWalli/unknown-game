'use strict';

import Vehicle from '../Vehicle';
import ItemStorage from '../abstract/ItemStorage';

import SyncPromise from 'sync-p';

import {
    ACTIONS as ACTION_TYPES,
    UNITS as UNIT_TYPES
} from '../../../types';

import {
    getSortedUnitByDistance
} from '../../../utils/unit';


export default class Transporter extends ItemStorage(Vehicle) {

    constructor(app, unit) {
        super(app, unit);
        this.maxItemStorageItemValue = 20;
        this._transporterAvailableItemTypes = []; // ITEMS.FOOD.DEFAULT
        this._transporterPreferredItemType = null;
        this._transporterPreferredStorageUnit = null;
        this._transporterIgnoredUnitTypes = [UNIT_TYPES.RESOURCE.DEFAULT];
    }

    /*
     * Functions
     */

    start() {}

    onSelectSecondary(unit) {
        if (unit && !this.isIgnoredUnit(unit) && unit.isType(UNIT_TYPES.ITEM_STORAGE)) {
            console.log('Transporter onSelectSecondary');
            if (
                (this._transporterAvailableItemTypes.length < 1 || unit.isType(UNIT_TYPES.ITEM_STORAGE) && this._transporterAvailableItemTypes.find(itemType => unit.module.hasItem(itemType)))
            ) {
                return this.moveToResource(unit).catch(err => {
                    console.error(err);
                    throw err;
                });
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
    loadItems(unit, itemType, value) {
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
                startArgs: [unit, itemType, Math.min(value, this.getFreeItemStorageValue(itemType)), true]
            });
        }
    }

    /**
     * Transferiert Rohstoffe zur angegebenen Unit.
     * @param  {game.base.Unit} unit
     * @param  {game.types.Items} itemType
     * @param  {number} value
     * @return {Promise}
     */
    unloadItemsToStorage(unit, itemType, value) {
        var abort = () => {
            this._transporterPreferredItemType = null;
            return this.moveToDepot();
        };
        if (unit.module.isItemStorageFull()) {
            this.log('Storage full, move to other…');
            return this.moveToAvailableStorage().then(unit => {
                if (!unit) {
                    return this.moveToDepot();
                }
                return unit;
            });
        } else if (!unit.module.isItemStorageFull()) {
            return this.moveToStorage().then(() => {
                // Ist beim Lager und entleert sich.
                itemType = itemType || this.getAvailableItem();
                if (!itemType) {
                    console.error('ItemStorage empty');
                    return abort();
                } else if (!unit.module.isFreeAndAllowedItem(itemType)) {
                    return this.moveToAvailableStorage();
                }
                return this.unloadItems(unit, itemType, value).then(() => {
                    return this.afterUnloadItemsToStorage(unit, itemType, value);
                });
            });
        } else {
            return abort();
        }
    }
    unloadItems(unit, itemType, value) {
        this.log('Unload items…', itemType);
        return this.app.unitActions.add({
            type: ACTION_TYPES.TRANSFER,
            unit: this.unit,
            startArgs: [unit, itemType, Math.min(value, this.getItemStorageItemValue(itemType))]
        });
    }

    afterUnloadItemsToStorage(unit, itemType, value) {
        if (!this.unit.module.isItemStorageEmpty() && (!value || value >= this.unit.module.getItemStorageItemValue(itemType))) {
            return this.unloadItemsToStorage(unit);
        } else {
            return SyncPromise.resolve();
        }
    }


    /**
     * Startet zum einsammeln von Rohstoffen.
     * @param {game.types.Units} itemType
     * @return {Promise}
     */
    collectItems() {
        const storage = this.transporterPreferredStorageUnit || this.getFreeStorage();
        if (storage && !this.isItemStorageEmpty()) {
            return this.unloadItemsToStorage(storage);
        } else {
            this.log('No Empty Storage, Move To Depot…');
            return this.moveToDepot();
        }
    }

    /**
     * Entleert das Storage vom angegebenen Item.
     * @param  {game.base.Unit} unit
     * @param  {game.types.items} type
     * @return {SyncPromise}
     */
    cleanStorage(unit, type) {
        return this.moveToUnit(unit).then(() => {
            this.log('Clean Storage…');
            return this.loadItems(unit, type).then(() => {
                return this.moveToAvailableStorage([unit]);
            });
        }).then(() => {
            if (!unit.module.isItemAllowed(type)) {
                this.log('Storage no allowed Item');
                return this.moveToDepot();
            } else if (unit.module.isItemStorageEmpty(type)) {
                this.log('Storage is cleaned from Item');
                return this.moveToDepot();
            } else {
                return this.cleanStorage.apply(this, arguments);
            }
        });
    }

    moveToResource(unit, type) {
        this.transporterPreferredItemType = this.getAvailableItem();
        if (this.unit.module.isItemStorageFull()) {
            // Ist voll und fährt zum Lager.
            this.log('Resource collected, go to Storage');
            return this.unloadItemsToStorage(unit);
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

    getStorageWithItem(type, ignoredUnits = []) {
        return this.getStoragesByDistance().find(building => {
            return ignoredUnits.indexOf(building) === -1 && building.module.getItemStorageItemValue(type);
        });
    }

    bringItemFromStorage(unit, type, value) {
        const storage = this.getStorageWithItem(type);
        if (storage) {
            return this.moveToUnit(storage).then(() => {
                return this.loadItems(storage, type, value);
            }).then(() => {
                console.log('this.getItemStorageItemValue(type) < value', this.getItemStorageItemValue(type) , value, this.getItemStorageItemValue(type) < value);
                if (this.getItemStorageItemValue(type) < value) {
                    return this.bringItemFromStorage(unit, type, value - this.getItemStorageItemValue(type));
                } else {
                    return this.moveToUnit(unit).then(() => {
                        console.log('unloadItems', unit, type, Math.min(value, this.getItemStorageItemValue(type)), JSON.stringify(this.itemStorageItems));
                        return this.unloadItems(unit, type, Math.min(value, this.getItemStorageItemValue(type))).then(() => {
                            if (value > this.getItemStorageItemValue(type)) {
                                return this.bringItemFromStorage(unit, type, value - this.getItemStorageItemValue(type));
                            }
                        });
                    });
                }
            });
        } else if (this.getItemStorageItemValue(type) > 0) {
            return this.moveToUnit(unit).then(() => {
                console.log('unloadItems', unit, type, Math.min(value, this.getItemStorageItemValue(type)), JSON.stringify(this.itemStorageItems));
                return this.unloadItems(unit, type, value);
            });
        } else {
            this.log('Can\'t Find Storage With Item');
            return SyncPromise.resolve();
        }
    }

    getStoragesByDistance() {
        const storages = getSortedUnitByDistance(this.unit.position, this.app.runtimeObserver.buildings.filter(building => {
            return building.isType(UNIT_TYPES.BUILDING.STORAGE.DEFAULT) && building.isType(UNIT_TYPES.ITEM_STORAGE);
        }));
        storages.forEach((storage, i, storages) => {
            storages[i] = storage.unit;
        });
        return storages;
    }

    getFreeStorage(ignoredUnits = []) {
        const storages = this.getStoragesByDistance();
        return storages.find(storage => ignoredUnits.indexOf(storage) === -1 && storage.module.isFreeAndAllowedItem(this.getAvailableItem()));
    }

    getAvailableItem() {
        return this.unit.module.getItemStorageAvailableItems(this.allowedItemsStorageItems).shift();
    }
    moveToAvailableStorage(ignoredUnits = []) {
        const storage = this.getFreeStorage(ignoredUnits);
        this._transporterPreferredStorageUnit = storage;
        if (storage) {
            return this.moveToUnit(storage).then(() => {
                return this.unloadItemsToStorage(storage).then(() => {
                    return storage;
                });
            });
        } else {
            return SyncPromise.resolve(null);
        }
    }

    getStorage() {
        return this._transporterPreferredStorageUnit || this.getFreeStorage();
    }


    /**
     * Überprüft ob Unit-Type ignoriert wird.
     * @param  {game.base.Unit}  unit
     * @return {Boolean}
     */
    isIgnoredUnit(unit) {
        return this._transporterIgnoredUnitTypes.find(type => unit.isType(type));
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
