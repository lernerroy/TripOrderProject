sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "./enums"
],
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device, Enums) {
        "use strict";

        return {
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },
            createEnumsModel: function(resourceBundle) {
                var oModel = new JSONModel({
                    statuses: Enums.getStatuses(resourceBundle)
                });
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            }
        };
    });