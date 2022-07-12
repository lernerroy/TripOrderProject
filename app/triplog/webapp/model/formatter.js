sap.ui.define([
    "./enums"
], function (Enums) {
    "use strict";

    return {

        /**
         * Rounds the number unit value to 2 digits
         * @public
         * @param {string} sValue the number string to be rounded
         * @returns {string} sValue with 2 digits rounded
         */
        numberUnit: function (sValue) {
            if (!sValue) {
                return "";
            }
            return parseFloat(sValue).toFixed(2);
        },

        statusStateFormat: function (sValue) {
            return Enums.getStatusState()[parseInt(sValue)];
        },


        statusTextFormat: function (sValue) {
            var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
            var statuses = Enums.getStatuses(resourceBundle);

            var status = statuses.find(item => item.code === parseInt(sValue));
            if (status) {
                return status.text;
            } else {
                return "";
            }
        },

        logTypeFormat: function (sValue) {
            var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
            return Enums.getLogTypes(resourceBundle)[sValue];
        },

        statusDescFormat: function (statusCode, statusParam1, statusParam2, statusParam3, statusParam4) {
            
            if (!statusCode){
                return "";
            }

            var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
            var aStatusDescs = Enums.getStatusDescs();
            var oStatusDesc = aStatusDescs.find(function (item) {
                return item.code === parseInt(statusCode);
            });

            // if status desc not maintained, we need to return the status code as it is
            if (!oStatusDesc) {
                return statusCode;
            }

            // otherwise, we will return the text from i18n props and send the parameters
            return resourceBundle.getText(oStatusDesc.bundleRef, [
                statusParam1,
                statusParam2,
                statusParam3,
                statusParam4
            ]);
        }

    };

});