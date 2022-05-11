sap.ui.define([], function () {
    "use strict";

    return {

        /**
         * Rounds the number unit value to 2 digits
         * @public
         * @param {string} sValue the number string to be rounded
         * @returns {string} sValue with 2 digits rounded
         */
        numberUnit : function (sValue) {
            if (!sValue) {
                return "";
            }
            return parseFloat(sValue).toFixed(2);
        },

        statusFormat: function(sValue) {
            let status = null;
            if(sValue === "53") {
                status = "Success";
            } else if(sValue === "51") {
                status = "Error";
            } else if(sValue === "52") {
                status = "Warning";
            } else {
                status = "None";
            }
            return status;
        },

        statusTextFormat: function(sValue) {
            let status = null;
            if(sValue === "53") {
                status = "Processed";
            } else if(sValue === "51") {
                status = "Failed";
            } else if(sValue === "52") {
                status = "Warning";
            } else {
                status = "Ready for Processing";
            }
            return status;
        }

    };

});