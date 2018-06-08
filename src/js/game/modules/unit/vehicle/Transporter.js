'use strict';

import Vehicle from '../Vehicle';
import ItemStorage from '../abstract/ItemStorage';

import SyncPromise from 'sync-p';

import {
    ACTIONS as ACTION_TYPES,
    UNITS as UNIT_TYPES
} from '../../../types';


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
            value = Math.min(value || 0, this.getFreeItemStorageValue(itemType));
            return this.app.unitActions.add({
                type: ACTION_TYPES.TRANSFER,
                unit: this.unit,
                startArgs: [unit, itemType, value, true]
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
                value = value || this.getItemStorageItemValue(itemType);
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
        const itemValue = this.getItemStorageItemValue(itemType);
        return this.app.unitActions.add({
            type: ACTION_TYPES.TRANSFER,
            unit: this.unit,
            startArgs: [unit, itemType, Math.min(value, itemValue)]
        }).then(() => itemValue);
    }

    afterUnloadItemsToStorage(unit, itemType, value) {
        if (!this.unit.module.isItemStorageEmpty(itemType) && (!value || value > this.unit.module.getItemStorageItemValue(itemType))) {
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
        const storage = this.transporterPreferredStorageUnit || this.app.runtimeObserver.getFreeStorage(this.unit.position, this.getAvailableItem());
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
        if (this.app.runtimeObserver.hasFreeItemStorages()) {
            return this.moveToUnit(unit).then(() => {
                this.log('Clean Storage…');

                const load = (unit, type) => {
                    return this.loadItems(unit, type).then(() => {
                        if (!this.isItemStorageFull() && !unit.module.isItemStorageEmpty(type)) {
                            return load(unit, type);
                        } else {
                            return SyncPromise.resolve();
                        }
                    });
                };

                return load(unit, type).then(() => {
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
        } else {
            return this.moveToDepot();
        }
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
        return this.app.runtimeObserver.getStoragesByDistance(this.unit.position).find(building => ignoredUnits.indexOf(building) === -1 && building.module.getItemStorageItemValue(type));
    }


    /**
     * Bringt eine angegebenes Item zur Unit.
     * @param  {game.base.Unit} unit
     * @param  {game.types.Items} type
     * @param  {number} value
     */
    bringItemFromStorage(unit, type, value) {

        this._transporterBringOriginValue = value;
        this._transporterBringValue = value;

        const moveToStorageAndLoad = () => {
            const storage = this.getStorageWithItem(type);
            if (storage) {
                // Gibt Storage mit Item
                return this.moveToUnit(storage).then(() => {
                    // An Storage angekommen und lädt jetzt
                    return this.loadItems(storage, type, value);
                }).then(() => {
                    return true;
                });
            } else {
                // Gibt kein Storage mit angegebenen Item
                this.log('Can\'t Find Storage With Item');
                return SyncPromise.resolve(false);
            }
        };

        return moveToStorageAndLoad().then(flag => {
            if (flag) {
                // Transporter voll
                if (!this.isItemStorageFull(type) && this.getItemStorageItemValue(type) < this._transporterBringValue) {
                    // Transporter ist nocht nicht voll, aber lager leer…
                    // Ein weiteres Lager wird angefahren, wenn möglich.
                    return moveToStorageAndLoad();
                }
            }
            return flag;
        }).then(flag => {
            if (flag) {
                // Fährt zum Ziel
                return this.moveToUnit(unit).then(() => {
                    if (!unit.module.isItemStorageFull()) {
                        // Am Ziel angekommen und entlädt
                        return this.unloadItems(unit, type, this._transporterBringValue).then(unloadValue => {
                            // Reduzieren der noch zu holenden Menge
                            this._transporterBringValue -= unloadValue;
                            // Hat am Ziel entladen
                            // Übeprüfen ob angefragte Menge ausgeliefert wurden ist.
                            if (this._transporterBringValue > 0 && this._transporterBringValue < this._transporterBringOriginValue) {
                                return this.bringItemFromStorage(unit, type, this._transporterBringValue);
                            }
                        });
                    } else {
                        // Am Ziel angekommen, ziel ist aber voll…
                        return this.unloadItemsToStorage();
                    }
                });
            }
            return flag;
        }).catch(e => {
            console.error(e);
            throw e;
        });
    }

    getAvailableItem() {
        return this.unit.module.getItemStorageAvailableItems(this.allowedItemsStorageItems).shift();
    }
    moveToAvailableStorage(ignoredUnits = []) {
        const storage = this.app.runtimeObserver.getFreeStorage(this.unit.position, this.getAvailableItem(), ignoredUnits);
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
        return this._transporterPreferredStorageUnit || this.app.runtimeObserver.getFreeStorage(this.unit.position, this.getAvailableItem());
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
