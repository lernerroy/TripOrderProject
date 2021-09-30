sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"./LobBase.controller",
	"sap/ui/model/json/JSONModel",
	"../constants/Constants"
], function (Controller, LobBase, JSONModel ,Constants) {
	"use strict";

	return LobBase.extend("fas.controller.CargoCharges", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.legstate.fts.app.FlightAcceptanceCockpit.view.CargoCharges
		 */
		onInit: function () {
			var oViewModel = new JSONModel({
				busy: false,
				servicesBusy: false,
				delay: 0,
				title: ""
			});
			
			
			this.setModel(oViewModel, "cargoChargesView");

			this.getRouter().getRoute("CargoCharges").attachPatternMatched(this.handleRouteMatched, this);
			

			// store tab bar in object 
			this._oTabBar = this.getView().byId("TabBar");
			
			this.setupLobModel(
				this.getResourceBundle().getText("CD_INFO_PANEL_TITLE"),
				Constants.LobType.CARGO_DETAILS
			);			
			

		},


		bindView: function (sObjectPath) {
			
			this.loadServices(
				sObjectPath,
				"FlightSegmentItemSetCG,FlightSegmentHeaderInboundCargo,FlightSegmentHeaderOutboundCargo"
			);
		},
		
		toggleEditMode: function (oEvent) {
			// toggle edit mode
			var oLobModel = this.getModel("lobView");
			
			var isInEditMode = oLobModel.getProperty("/editMode");
			
			oLobModel.setProperty("/editMode", !isInEditMode);
		},
		
		onCargoDetailsValueChanged: function(oEvent){
			// get the parent row where this input field is located
			// var oParent = oEvent.getSource().getParent();

			// Modify the Lob model state that the entry has changed			
			this.getLobModel().setProperty("/entryHasChanged", true);			
		}		
	});

});