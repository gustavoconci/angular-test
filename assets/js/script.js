(function (w) {
    'use strict';

    var masks = {
        number: function (e) {
            return e.target.value.replace(/\D/g, '');
        }
    }

    w.addEventListener('load', function(event) {
        document.addEventListener('input', function (e) {
            var dataset = e.target.dataset;

            if (typeof dataset.mask !== typeof undefined) {
                e.target.value = masks[dataset.mask](e);
            }
        }, false);
    });
})(window);