sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
], function (BaseController, JSONModel, formatter) {
    "use strict";

    return BaseController.extend("UpdUtility.uploadutility.controller.Upload", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit : function () {
            // Model used to manipulate control states
            var oViewModel = new JSONModel({

            });
            this.setModel(oViewModel, "worklistView");
        },
        onUpload: function() {

        },
        onFileChange: function(oEvent) {
            
        }
    });
});
