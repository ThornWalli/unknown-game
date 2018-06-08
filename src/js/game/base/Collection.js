'use strict';

import Events from './Events';

export default class Collection extends Events {

    constructor(filter, items) {
        super();
        this._filter = filter;
        this._items = items || [];
    }

    /*
     * Functions
     */

    /**
     * Löst die Collection auf.
     * @return {[type]} [description]
     */
    destroy() {
        this.trigger('destroy', this);
        this.detacheEvents();
        this._items = null;
    }

    sort() {
        const items = [].concat(this._items);
        return items.sort.apply(this._items, arguments);
    }
    find() {
        const items = [].concat(this._items);
        return items.find.apply(this._items, arguments);
    }
    forEach() {
        const items = [].concat(this._items);
        return items.forEach.apply(this._items, arguments);
    }
    reduce() {
        const items = [].concat(this._items);
        return items.reduce.apply(this._items, arguments);
    }
    map() {
        const items = [].concat(this._items);
        return items.map.apply(this._items, arguments);
    }
    filter() {
        const items = [].concat(this._items);
        return items.filter.apply(items, arguments);
    }

    createFilteredCollection(filter) {
        const collection = new(this.class)(filter, this.filter(filter));
        collection.once('destroy', () => this.off(null, null, collection), this);
        this.on('add', collection.add, collection);
        this.on('remove', collection.remove, collection);
        return collection;
    }

    add(item, options) {
        if ((!this._filter || this._filter(item))) {
            if (this._items) {
                this._items.push(item);
                this.addEventsForwarding('item', item);
                if (!options || options && !options.silence) {
                    this.trigger('add', item, options);
                }
            } else {
                console.error('items undefined Oo');
            }
        }
    }

    remove(item, options = {}) {
        if (!this._filter || this._filter(item)) {
            if (this._items) {
                this._items.splice(this._items.indexOf(item), 1);
                this.removeEventsForwarding('item', item);
                if (!options || options && !options.silence) {
                    this.trigger('remove', item, options);
                }
            } else {
                console.error('items undefined Oo');
            }
        }
    }

    /*
     * Properties
     */

    get items() {
        return this._items;
    }
    get length() {
        return this._items.length;
    }
    get class() {
        return Collection;
    }
}
