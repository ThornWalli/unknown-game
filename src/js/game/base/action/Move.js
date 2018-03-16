 'use strict';

 import Action from '../Action';

 import {
     ticker
 } from '../Ticker';

 export default class Move extends Action {
     constructor(unit, callback) {
         super('move', unit, callback);
         this._moveData = null;
         this._timerListener = null;
     }

     onComplete() {
         removeListener(this);
         Action.prototype.onComplete.apply(this, arguments);
     }

     // Functions

     start(moveData) {
         this._moveData = moveData;
         addListener(this, this._moveData.path);
         Action.prototype.start.apply(this, arguments);
     }

     stop() {
         removeListener(this);
         Action.prototype.stop.apply(this, arguments);
     }

     destroy() {
         removeListener(this);
         Action.prototype.destroy.apply(this, arguments);
     }

     // Properties

     get duration() {
         return 250; //750; //250; // ms
     }

     get startTime() {
         return this._timerListener.timestamp;
     }
     get moveData() {
         return this._moveData;
     }

     get pathLength() {
         return this._pathLength;
     }
 }

 // Functions

 function addListener(action, path) {
     action._timerFirstTick = false;
     action._timerListener = ticker.register(onTick.bind(action)(), onComplete.bind(action)(path), action.duration);
 }

 function removeListener(action) {
     if (action._timerListener) {
         ticker.unregister(action._timerListener);
     }
     action._timerListener = null;
 }

 // Events

 function onTick() {
     return value => {
         if (this._timerFirstTick) {
             this.unit.offsetPosition.setLocal(this.unit.position).subtractLocal(this.unit.lastPosition).multiplyValuesLocal(value, value);
             // action.unit.offsetPositionExtended.setLocal(action.unit.nextPosition).subtractLocal(action.unit.lastPosition).multiplyValuesLocal(value, value).subtractValuesLocal(1, 1);
             this.unit.renderSprite();
             this.trigger('moving', this, value);
         }
     };
 }

 function onComplete(path) {
     return () => {
         if (path.length < 1) {
             this.unit.positionOffset.setValuesLocal(0, 0);
             this._timerFirstTick = false;
             this.unit.nextPosition = null;
             this.onComplete();
             return false;
         } else {
             // Get next Position
             if (path.length > 1) {
                 this.unit.nextPosition = path[1];
             }
             this.unit.setPosition(path.shift());
             this._timerFirstTick = true;
             return true;
         }

     };
 }
