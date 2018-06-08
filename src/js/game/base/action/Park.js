 'use strict';

 import {
     ACTIONS as ACTION_TYPES
 } from '../../types';

 import Action from '../Action';

 import {
     ticker
 } from '../Ticker';

 ACTION_TYPES.PARK = 'park';

 export default class Park extends Action {
     constructor(unit, callback) {
         super(ACTION_TYPES.PARK, unit, callback);
         this._timerListener = null;
     }

     onComplete() {
         removeListener(this);
         Action.prototype.onComplete.apply(this, arguments);
     }

     /*
      * Functions
      */

     start(targetUnit) {
         this._targetUnit = targetUnit;
         addListener(this);
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

     /*
      * Properties
      */

     get duration() {
         return 500;
     }
 }

 /*
  * Functions
  */

 function addListener(action) {
     action._timerListener = ticker.register(onTick.bind(action), onComplete.bind(action), action.duration);
 }

 function removeListener(action) {
     if (action._timerListener) {
         ticker.unregister(action._timerListener);
     }
     action._timerListener = null;
 }

 // Events

 function onTick() {}

 function onComplete() {
     this.onComplete();
     return false;
 }
