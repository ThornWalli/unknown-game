'use strict';

import Controller from 'gp-module-base/Controller';


export default Controller.extend({

    initialize: function() {
        Controller.prototype.initialize.apply(this, arguments);

        // $(document).on('click', 'a', function(e) {
        //     // console.log('CLICK',e);
        // });
    }
});
