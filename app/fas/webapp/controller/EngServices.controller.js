sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"./LobBase.controller",
	"sap/ui/model/json/JSONModel",
	"../constants/Constants"
], function (Controller,LobBase, JSONModel, Constants) {
	"use strict";

	return LobBase.extend("fas.controller.EngServices", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.legstate.fts.app.FlightAcceptanceCockpit.view.EngServices
		 */
		onInit: function () {
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0,
				title: ""
			});

			this.setModel(oViewModel, "engServicesView");


			this.getRouter().getRoute("EngServices").attachPatternMatched(this.handleRouteMatched, this);
			
			this._oTabBar = this.getView().byId("TabBar");

			// setup			
			this.setupLobModel(
				this.getResourceBundle().getText("AC_INFO_PANEL_TITLE"),
				Constants.LobType.ENG_SERVICES
			);
		},
		
		toggleEditMode: function (oEvent) {
			// toggle edit mode
			var oLobModel = this.getModel("lobView");
			
			var isInEditMode = oLobModel.getProperty("/editMode");
			
			oLobModel.setProperty("/editMode", !isInEditMode);
		},	
		
		bindView: function (sObjectPath) {
			
			this.loadServices(
				sObjectPath,
				"FlightSegmentItemSetEG"
			);
		}

	});

});