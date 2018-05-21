'use strict';

const SymbolEvents = Symbol('events');



class Events {

    constructor() {
        this[SymbolEvents] = Events.getClearEvents();
    }

    addEventsForwarding(name, events) {
        events.on('all', (...args) => {
            args[0] = `${name}.${args[0]}`;
            this.trigger.apply(this, args);
        }, this);
    }

    removeEventsForwarding(events) {
        events.off(null, null, this);
    }

    /**
     * Removes all registred Events.
     */
    detacheEvents() {
        this[SymbolEvents] = Events.getClearEvents();
    }

    on(name, cb, scope) {
        on.bind(this)(name, cb, scope);
        return this;
    }
    once(name, cb, scope) {
        on.bind(this)(name, cb, scope, true);
        return this;
    }
    off(name, cb, scope) {
        if (name in this[SymbolEvents]) {
            let listeners;
            if (!cb) {
                if (scope !== undefined) {
                    listeners = this[SymbolEvents][name].filter(listener => {
                        if (listener.scope === scope) {
                            return listener;
                        }
                    });
                } else {
                    this[SymbolEvents][name] = [];
                }
            } else {
                listeners = this[SymbolEvents][name].filter(listener => {
                    if (listener.cb === cb) {
                        return listener;
                    }
                });
            }
            if (listeners) {
                listeners.forEach(listener => {
                    removeListener(this[SymbolEvents], name, listener);
                });
            }
        } else if (!name) {
            Object.keys(this[SymbolEvents]).forEach(name => {
                this.off(name, null, scope);
            });
        }
        return this;
    }

    trigger(name, ...args) {
        const once = [];
        if (name in this[SymbolEvents]) {
            this[SymbolEvents][name].forEach(listener => {
                listener.cb.apply(listener.scope || listener.cb, args);
                if (listener.once) {
                    once.push(listener);
                }
            });
        }
        // Triggers event "all" on every event
        const allArgs = [name].concat(args);
        this[SymbolEvents].all.forEach(listener => {
            listener.cb.apply(listener.scope || listener.cb, allArgs);
            if (listener.once) {
                once.push(listener);
            }
        });
        once.forEach(listener => removeListener(this[SymbolEvents], name, listener));
        return this;
    }

    static getClearEvents() {
        return {
            all: []
        };
    }

}

function removeListener(events, name, listener) {
    if (events[name].indexOf(listener) < 0) {
        console.error(name, listener, events);
    }
    events[name].splice(events[name].indexOf(listener), 1);
}

function on(name, cb, scope, once = false) {
    if (!(name in this[SymbolEvents])) {
        this[SymbolEvents][name] = [];
    }
    this[SymbolEvents][name].push({
        cb,
        scope,
        once
    });
}

export default Events;
