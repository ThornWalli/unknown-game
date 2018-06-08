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
                `Position: ${unit.position.toString()}`,
                `Port-Position: ${unit.module ? unit.module.portPosition.toString() : ''}`,
                `Z-Index: ${unit.sprite.zIndex}`
            ];
            if (unit.activeAction) {
                infos.push(`has Action`);
            }
            if (unit.isSetToRemove()) {
                infos.push(`Is set remove`);
            }
            if (unit.user) {
                infos.push(`User: ${unit.user.name}[${unit.user.id}]`);
            }
            if (unit.neighborPositions) {
                infos.push(`<br/><strong>Neighboars:</strong>`);
                getNeighborMatrix(unit).forEach(row => {
                    row.join(' / ');
                    infos.push(row);
                });
            }
        } else {
            infos = [];
        }
        this.el.innerHTML = infos.join('<br />');
        this.model.visible = !!unit;
    }

});



function getNeighborMatrix(unit) {

    const matrix = Array(3);
    for (var i = 0; i < matrix.length; i++) {
        matrix[i] = Array(3).fill(false);
    }

    unit.neighborPositions.forEach(position => {
        matrix[1 + position[0]][1 + position[1]] = true;
    });
    return matrix;
}
