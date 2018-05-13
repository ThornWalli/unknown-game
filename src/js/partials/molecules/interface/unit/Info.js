"use strict";

import Interface from '../../Interface';

import lang from '../../../../game/utils/lang';

export default Interface.extend({

    modelConstructor: Interface.prototype.modelConstructor.extend({
        session: {}
    }),

    events: Object.assign({}, Interface.prototype.events, {}),

    initialize() {
        Interface.prototype.initialize.apply(this, arguments);
    },

    onSelectUnit(unit) {
        let infos;
        Interface.prototype.onSelectUnit.apply(this, arguments);
        if (unit && this.isAvailableUnit(unit)) {
            const types = unit.types.join(', ');
            infos = [
                `Type: ${types}`,
                `ID: ${unit.id}`,
                `Name: ${lang.get(unit.type)}`,
                `Position: ${unit.position.toString()}`
            ];
            if (unit.user) {
                infos.push(`User: ${unit.user.name}[${unit.user.id}]`);
            }
        } else {
            infos = [];
        }
        this.el.innerHTML = infos.join('<br />');
        this.model.visible = !!unit;
    }

});
