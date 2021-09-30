sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../constants/Constants",
	"sap/ui/model/Filter"
], function (Controller, Constants, Filter) {
	"use strict";

	return Controller.extend("fas.controller.ServicesFragmentController", {
		constructor: function (oController, oDataModel) {
			this._oController = oController;
			this._oDataModel = oDataModel;
			return Controller.call(this);
		},
		
		onMoreServicesButtonPressed: function(event){
		},

		bind: function (sFlightSegmentType, sObjectPath) {
			
			var sFragmentId = undefined;
			var sBindingPath = undefined;
			var aFilters = [];
			
			var oView = this._oController.getView();

			if (sFlightSegmentType === Constants.FlightSegmentType.ARRIVAL) {
				sFragmentId = oView.createId("arrServices");
				sBindingPath = sObjectPath + "/FlightSegmentItemSetAC";
				var arrFilter = new Filter("Direction", sap.ui.model.FilterOperator.EQ, 1);
				aFilters.push(arrFilter);
			} else if (sFlightSegmentType === Constants.FlightSegmentType.DEPARTURE) {
				sFragmentId = oView.createId("depServices");
				sBindingPath = sObjectPath + "/FlightSegmentItemSetAC";
				var depFilter = new Filter("Direction", sap.ui.model.FilterOperator.EQ, 2);
				aFilters.push(depFilter);
			} else {
				return;
			}

			var oServicesTable = sap.ui.core.Fragment.byId(sFragmentId, "servicesTable");

			if (!this.oTemplate) {
				this.oTemplate = oServicesTable.getItems()[0];
				oServicesTable.removeAllItems();
			}

			if (!oServicesTable.getBinding("items")) {

				// var oViewModel = this.getModel("airportChargesView");

				// bind the services table 
				oServicesTable.bindAggregation("items", {
					path: sBindingPath,
					template: this.oTemplate,
					filters: aFilters,
					events: {
						change: function (oEvent) {},
						dataRequested: function (oEvent) {
							// oViewModel.setProperty("/busy", true);
						},
						dataReceived: function (oEvent) {
							// oViewModel.setProperty("/busy", false);
						}
					}
				});
			}
		}
	});

});