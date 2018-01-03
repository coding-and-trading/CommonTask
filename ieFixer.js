/*
    Author: YeHong Du
    CreateAt: 2018-1-3
*/

(function() {
    /* String */
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
          return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        };
      }
})();