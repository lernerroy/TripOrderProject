sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"./PassFragmentController"
], function (BaseController, JSONModel, Controller, PassangerFragmentController) {
	"use strict";

	return BaseController.extend("fas.controller.lob", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.legstate.fts.app.FlightAcceptanceCockpit.view.lob
		 */
		onInit: function () {
			
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0,
				title: ""
			});			
			
			this.getRouter().getRoute("Lob").attachPatternMatched(this._onLobMatched, this);
			
			this.setModel(oViewModel, "lobView");

			// store tab bar in object 
			this._oTabBar = this.getView().byId("TabBar");
		},

		onAfterRendering: function () {
		},

		_onLobMatched: function (oEvent) {

			var args = oEvent.getParameter("arguments");

			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");

			this.getModel().metadataLoaded().then(function () {
				
				
				
				var sObjectPath = this.getModel().createKey("FlightSegmentHeaderSet", {
					Preaufnr: args.objectId,
					Aufnr: args.flightNo
				});

				this._bindView("/" + sObjectPath, args.lobType);

				this.getOwnerComponent().oListSelector.selectAListItem("/" + sObjectPath);
			}.bind(this));
			
			
			// get lob title from lob model 
			var oLobModel = this.getModel("lobs");
			var oViewModel = this.getModel("lobView");
			
			
			oViewModel.setProperty("/title", "this is title");
			

		},

		onCloseLobPress: function (oEvent) {
			this.onNavBack();
		},

		// ========== BINDING ================

		_bindView: function (sObjectPath, sLobType) {
			
			if (sLobType === "AC"){
				this._addAirportChargesContent(sObjectPath);
			}
			
			
		

			// this._bindPassangerDetails(sObjectPath);

		},
		
		/**
		 * 
		 * 
		 * */
		_addAirportChargesContent: function(sObjectPath){
			var oPassangerFragmentController = new PassangerFragmentController(this);
			var oPassangerFragment = sap.ui.xmlfragment("fas.fragments.PassangerDetails", oPassangerFragmentController);
			this._getContentContainer().addContent(oPassangerFragment);	
			
			var sPath = sObjectPath + "/FlightSegmentHeaderInboundPax";
			// bind passanger details 
			oPassangerFragmentController.bind(sPath);
		},
		
		

		_bindPassangerDetails: function (sObjectPath) {
			// get passanger details form 
			var sPassangerFragmentId = this.getView().createId("depPassangerInfoFragment");
			var oPassangerDetailsGrid = sap.ui.core.Fragment.byId(sPassangerFragmentId, "gridPassDetails");
			var sPath = sObjectPath + "/FlightSegmentHeaderInboundPax";
			
			oPassangerDetailsGrid.bindElement({
				path: sPath
			});
		},
		
		_getContentContainer: function() {
			return this.getView().byId("scrollContArrival");
		},

		// =========== EVENTS ================

		onTabSelected: function (oEvent) {}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.legstate.fts.app.FlightAcceptanceCockpit.view.lob
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.legstate.fts.app.FlightAcceptanceCockpit.view.lob
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.legstate.fts.app.FlightAcceptanceCockpit.view.lob
		 */
		//	onExit: function() {
		//
		//	}

	});

});