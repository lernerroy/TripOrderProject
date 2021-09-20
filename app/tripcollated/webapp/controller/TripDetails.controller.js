sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller) {
        "use strict";

        return Controller.extend("tripcollated.controller.TripDetails", {
            onInit: function () {
                var key = "(insupcaarriercode2='" + + "',inflightno='" + + "',inorigin='" + + "',indestination='" + + "',inscheddeptdate='" + + "',surrogatenum='')";
                var urlTripRecord = "/browse/triprecord" + key;
                var that = this;
                $.get({
                    url: urlTripRecord,
                    success: function (data) {
                        var oModel = new sap.ui.model.json.JSONModel();
                        oModel.setData(data);
                        that.getView().setModel(oModel, "tripRecord");
                    },
                    error: function (error) {
                        // your error logic
                    }
                });
            }
        });
    });
