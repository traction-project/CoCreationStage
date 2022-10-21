/**
 * @file A few useful utility functions
 */

var Utils = {
   toString : Object.prototype.toString,

  /**
   * Returns true when parameter is null
   *
   * @function
   * @param {*} obj Object to check
   * @returns {Boolean} true if object is null, false otherwise
   */
  isNull : function (obj) {
    return obj === null;
  },


  /**
   * Returns true when parameter is a number
   *
   * @function
   * @param {*} obj Object to check
   * @returns {Boolean} true if object is a number, false otherwise
   */
  isNumber : function (obj) {
    return toString.call(obj) === '[object Number]';
  },


  /**
   * Serialize object as a JSON string
   *
   * @function
   * @param {Object} obj The object to serialize as JSON string
   * @return {String} The serialized JSON string
   */
   stringify : function (obj) {
    return JSON.stringify(obj, null, 2);
  },
  getHostName:function(url){
    var a = document.createElement('a');
    a.href = "http://" + url;
    return a.hostname;
  }


  // Expose helper functions to the outer world

}
export {Utils}
