sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"./LobBase.controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/core/Fragment",
	"../constants/Constants",
	"com/legstate/fts/app/FlightAcceptanceCockpit/flightacceptancecockpit/vendor/lodash.min",
	"sap/m/MessageBox"
], function (Controller, LobBase, JSONModel, Filter, Fragment, Constants, lodash, MessageBox) {
	"use strict";

	return LobBase.extend("fas.controller.AirportCharges", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.legstate.fts.app.FlightAcceptanceCockpit.view.AirportCharges
		 */
		onInit: function () {

			var oViewModel = new JSONModel({
				busy: false,
				delay: 0,
				title: ""
			});

			this.setModel(oViewModel, "airportChargesView");

			// setup			
			this.setupLobModel(
				this.getResourceBundle().getText("AC_INFO_PANEL_TITLE"),
				Constants.LobType.AIRPORT_CHARGES
			);

			this._oTabBar = this.getView().byId("TabBar");

			// handle routing 
			this.getRouter().getRoute("AirportCharges").attachPatternMatched(this.handleRouteMatched, this);
		},

		onBeforeRendering: function () {},

		bindView: function (sObjectPath) {
			this.loadServices(sObjectPath, "FlightSegmentItemSetAC,FlightSegmentHeaderInboundPax,FlightSegmentHeaderOutboundPax");
		},
		
		refreshFlightSegment: function(sObjectPath){
			this.loadServices(sObjectPath, "FlightSegmentItemSetAC,FlightSegmentHeaderInboundPax,FlightSegmentHeaderOutboundPax");
		},

		onPassangerDetailsValueChanged: function(oEvent){
			this.getLobModel().setProperty("/entryHasChanged", true);
		}

	
	});

});