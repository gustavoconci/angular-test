"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (w) {
  var masks = {
    number: function number(e) {
      return e.target.value.replace(/\D/g, '');
    }
  };
  w.addEventListener('load', function () {
    document.addEventListener('input', function (e) {
      var dataset = e.target.dataset;

      if (_typeof(dataset.mask) !== (typeof undefined === "undefined" ? "undefined" : _typeof(undefined))) {
        e.target.value = masks[dataset.mask](e);
      }
    }, false);
  });
})(window);