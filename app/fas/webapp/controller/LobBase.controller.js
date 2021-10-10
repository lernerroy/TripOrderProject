sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../constants/Constants",
	"fas/dialog/BusyDialogController",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (Controller, BaseController, JSONModel, Constants, BusyDialog, MessageBox, MessageToast) {
	"use strict";

	return BaseController.extend("fas.controller.LobBase", {

		// ========================= Common Setup/Init =========================

		setupLobModel: function (sTitle, sLobType) {
			var oLobView = new JSONModel({
				infoPanelTitle: sTitle,
				lobType: sLobType,
				editMode: false,
				busy: false,
				delay: 0,
				entryIsLocked: false,
				entryHasChanged: false
			}, true);

			this.setModel(oLobView, "lobView");
		},

		// ========================= End of Common Setup/Init =========================

		// ========================= Common Helpers =========================

		unbindData: function () {

			var oServicesModel = this.getModel("flightServices");

			if (!oServicesModel) {
				return;
			}

			// clear the services table 
			oServicesModel.setData({
				details: {},
				allServices: [],
				currentServices: [],
				moreServices: [],
				tabs: []
			});

			oServicesModel.refresh();

		},

		getLobModel: function () {
			return this.getModel("lobView");
		},

		handleRouteMatched: function (oEvent) {

			// make sure we unbind data in order to make sure
			// we always get the latest data 
			this.unbindData();

			// Get arguemnts and save them 
			this.oRouteArgs = oEvent.getParameter("arguments");

			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");

			this.getModel().metadataLoaded().then(function () {

				var sObjectPath = this.getModel().createKey("FlightSegmentHeaderSet", {
					Preaufnr: this.oRouteArgs.arrFlightNo || '',
					Aufnr: this.oRouteArgs.depFlightNo || ''
				});

				// bind the view 
				this.bindView("/" + sObjectPath);

				this.sObjectPath = sObjectPath;

				// Select last selected row
				this.getOwnerComponent().oListSelector.selectAListItem("/" + sObjectPath);

			}.bind(this));
		},

		bindView: function (sObjectPath) {
			// Should be override by child controller
		},

		getFlightNumberByDirection: function () {
			var sDirection = this._getDirection();
			if (sDirection === Constants.FlightSegmentType.ARRIVAL) {
				return this.oRouteArgs.arrFlightNo;
			} else {
				return this.oRouteArgs.depFlightNo;
			}
		},

		// ========================= End of Common Helpers =========================

		// ========================= Common Action Handlers =========================

		onSaveFlight: function (oEvent) {
			// When on save flight pressed we execute call to the server 
			// to update the flight segment header entity 
			// we use deep create and build the deep create payload 
			// according to the current selected segment 
			this.createDeepEntry();
		},

		onClose: function (oEvent) {

			var self = this;

			var oLobModel = this.getLobModel();

			// If the user made changes to the flight 
			// Present him a dialog that will ask him if he like 
			// to: 1. Save the changes and continue, 2. Revert changes and continue
			if (oLobModel.getData().entryHasChanged === true) {
				this._presentSaveFlightMessageBox(false,true);
			} else if (oLobModel.getData().entryIsLocked === true) {

				this.executeDequeueSegmentAction(function () {
					self.getLobModel().setProperty("/editMode", false);
					self.onNavBack();
				});

			} else {
				self.getLobModel().setProperty("/editMode", false);
				self.onNavBack();
			}
		},

		_presentSaveFlightMessageBox: function (bRefreshRecord, bClose) {
			
			var self = this;
			
			MessageBox.alert("Do you want to save the document first?", {
				title: "Leave Flight",
				actions: [
					MessageBox.Action.CANCEL,
					MessageBox.Action.NO,
					MessageBox.Action.YES
				],
				onClose: function (sAction) {
					if (sAction === MessageBox.Action.YES) {
						// TODO: Save entry and dequeue flight 
					} else if (sAction === MessageBox.Action.NO) {
						self._cancelEdit(bRefreshRecord, bClose);
					}
				}
			});
		},

		onEditPressed: function (oEvent) {

			var self = this;

			this.executeEnququeSegmentAction(function (bIsLocked) {
				self._toggleEditMode(true);
			}, true)

		},

		createDeepEntry: function () {

			let nDirection = this._getDirection() === Constants.FlightSegmentType.ARRIVAL ? 1 : 2;

			var oFlightSegment = this.getServicesModel();
			var oDataModel = this.getModel();

			// The deep entity path will be on the 
			// whole flight segment 
			var sPath = "/FlightSegmentHeaderSet";

			var oPayload = {
				Aufnr: this.oRouteArgs.depFlightNo || '',
				Preaufnr: this.oRouteArgs.arrFlightNo || ''
			};

			// Build payload according to the 
			// current segment direction and data
			var sDirection = this._getDirection();

			// entity names where we need to 
			// set services path ahead of 
			// execute the create entity call 			
			var sServicesEntityName = null;
			var sServicesModelPath = null;

			var sLob = this.getLobModel().getProperty("/lobType");
			sServicesEntityName = "FlightSegmentItemSetAC";
			if (sLob === Constants.LobType.AIRPORT_CHARGES) {
				sServicesEntityName = "FlightSegmentItemSetAC";
			} else if (sLob === Constants.LobType.CARGO_DETAILS) {
				sServicesEntityName = "FlightSegmentItemSetCG";
			} else if (sLob === Constants.LobType.ENG_SERVICES) {
				sServicesEntityName = "FlightSegmentItemSetEG";
			}

			// entity names where we need to 
			// set details ahead of 
			// execute the create entity call 
			var sDetailsEntityName = null;
			var sDetailsModelPath = null;

			if (sDirection === Constants.FlightSegmentType.ARRIVAL) {
				sDetailsEntityName = "FlightSegmentHeaderInboundPax";
				sDetailsModelPath = "/1/details";
				sServicesModelPath = "/1/currentServices";
			} else if (sDirection === Constants.FlightSegmentType.DEPARTURE) {
				sDetailsEntityName = "FlightSegmentHeaderOutboundPax";
				sDetailsModelPath = "/2/details";
				sServicesModelPath = "/2/currentServices";
			}

			// omit the usage types from the model 
			var aServices = _.map(oFlightSegment.getProperty(sServicesModelPath), function (oService) {
				return _.omit(oService, ['usageTypes']);
			});

			// set the details and services to
			// the entity payload dynamically 
			if (sDetailsEntityName) {
				oPayload[sDetailsEntityName] = oFlightSegment.getProperty(sDetailsModelPath);
			}
			oPayload[sServicesEntityName] = aServices;

			oDataModel.create(sPath, oPayload, {
				success: function (data, response) {

				},
				error: function (error) {

				}
			});
		},

		executeEnququeSegmentAction: function (fnSuccess, bShowBusyDialog) {

			var self = this;

			// Get the flight number by the current selected direction
			// (Arrival or Departure)
			var sFlightNumber = this.getFlightNumberByDirection();

			if (!sFlightNumber) {
				return;
			}

			var oBusyDialog = null;

			if (bShowBusyDialog) {
				oBusyDialog = new BusyDialog(null, "Enqueue...");
				oBusyDialog.present(this.getView());
			}

			this.getModel().callFunction("/EnqueueSegment", {
				method: "POST",
				urlParameters: {
					"FlightNumber": sFlightNumber
				},
				success: function (oData, response) {
					if (oBusyDialog) {
						oBusyDialog.dismiss();
					}
					var result = oData.EnqueueSegment;
					if (result.IsLocked === true) {
						self.getLobModel().setProperty("/entryIsLocked", true);
						self.getSharedStateModel().setProperty("/entryIsLocked", true);
						// modify the lob view model that we're in edit mode
						// self.getLobModel().setProperty("/editMode", true);
					} else {
						// present error message that we cannot enqueu this object
						MessageBox.alert(result.Error);
						self.getLobModel().setProperty("/entryIsLocked", false);
					}

					fnSuccess(result.IsLocked);
				},
				error: function (oErr) {
					if (oBusyDialog) {
						oBusyDialog.dismiss();
					}
					// Error handling here
				}
			});
		},

		executeDequeueSegmentAction: function (fnSuccess) {

			// Get the flight number by the current selected direction
			// (Arrival or Departure)
			var sFlightNumber = this.getFlightNumberByDirection();

			if (!sFlightNumber) {
				return;
			}

			var self = this;

			var oDialog = new BusyDialog(null, "Dequeue...");
			oDialog.present(this.getView());

			this.getModel().callFunction("/DequeueSegment", {
				method: "POST",
				urlParameters: {
					"FlightNumber": sFlightNumber
				},
				success: function (oData, response) {
					oDialog.dismiss();
					self.getLobModel().setProperty("/entryIsLocked", false);
					fnSuccess(oData, response);
				},
				error: function (oErr) {
					oDialog.dismiss();
				}
			});
		},

		onCancelEdit: function (oEvent) {
			// cancel edit mode
			this._cancelEdit(true);
		},
		
		_cancelEdit: function(bRefresh, bClose){
			
			var self = this;
			
			this.executeDequeueSegmentAction(function () {
				
				self._toggleEditMode(false);
				
				var bEntryChanged = self.getLobModel().getProperty("/entryHasChanged");
				
				// if entry has changed and the user cancel 
				// the edit mode then we need to reset the entry change flag and 
				// reload the flight segment again from the server
				if (bEntryChanged) {
					self.getLobModel().setProperty("/entryHasChanged", false);
					if (bRefresh){
						self.refreshFlightSegment("/" + self.sObjectPath);
					}
				}
				
				if (bClose){
					self.onNavBack();
				}
			});			
		},

		refreshFlightSegment: function (sObjectPath) {
			// should be overrided by child classes 
		},

		_toggleEditMode: function (bEditMode) {

			var bIsInEditMode = this.getLobModel().getProperty("/editMode");

			if (bEditMode === bIsInEditMode) {
				return;
			}

			if (bEditMode) {
				this.getLobModel().setProperty("/editMode", true);
				this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
				MessageToast.show("Edit mode enabled");
			} else {
				this.getLobModel().setProperty("/editMode", false);
				this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
				MessageToast.show("Edit mode disabled");
			}
		},

		onServiceQuantityChanged: function (oEvent) {

			// get the parent row where this input field is located
			var oParent = oEvent.getSource().getParent();

			// Modify the Lob model state that the entry has changed			
			this.getLobModel().setProperty("/entryHasChanged", true);

		},

		onTabSelected: function (oEvent) {

			var oLobModel = this.getLobModel();

			// Save the tab key that the user want to see 
			var sRequestedSelectedTabKey = oEvent.getParameter("selectedKey");

			var self = this;

			// If the user made changes to the flight 
			// Present him a dialog that will ask him if he like 
			// to: 1. Save the changes and continue, 2. Revert changes and continue
			if (oLobModel.getData().entryHasChanged === true) {
				this._presentSaveFlightMessageBox(true);
				// cancel tab selection
				this._oTabBar.setSelectedKey(this._sCurrentSelectedTabKey);

			} else if (oLobModel.getData().entryIsLocked === true) {

				this.executeDequeueSegmentAction(function () {
					self._handleTabSelection(sRequestedSelectedTabKey);
				})

			} else {
				this._handleTabSelection(sRequestedSelectedTabKey);
			}
		},

		_handleTabSelection: function (sSelectedTabKey) {

			var sBindingPath = "/" + this.sObjectPath;

			// Disable edit model when we move to another tab
			// this.getLobModel().setProperty("/editMode", false);
			this._toggleEditMode(false);

			// bind passanger details 
			// this._bindPassangerDetails(sBindingPath, sSelectedTabKey);

			this.renderServicesByDirection();

			// Save the current selected tab
			this._sCurrentSelectedTabKey = sSelectedTabKey;
		},

		// ========================= End of Common Action Handlers =========================

		// ========================= Flight Services =========================

		loadServices: function (sObjectPath, sExpand) {

			var oDataModel = this.getModel();

			this.getLobModel().setProperty("/busy", true);

			var self = this; // save context 

			// Get all services from the server 
			oDataModel.read(sObjectPath, {
				urlParameters: {
					"$expand": sExpand
				},
				success: function (response, oData) {
					self.getLobModel().setProperty("/busy", false);
					// handle the loaded services
					self.handleFlightSegmentLoaded(oData.data)
				},
				error: function (oError) {}
			});
		},

		_getDirection: function () {
			return this._oTabBar.getSelectedKey();
		},

		/**
		 * 
		 * 
		 * */
		handleFlightSegmentLoaded: function (oFlightSegment) {

			// here we map all entry sheet services 
			// and routine services into a dedicated JSON model
			// current services are the services which currently displayed on the 
			// services table and these are actually the services that this LOB has
			// more services are services that can be added 
			var oServicesModel = new JSONModel({
				flightSegment: oFlightSegment,
				// allServices: aServices, // all services from server 
				currentServices: [], // current services that will be displayed on table 
				moreServices: [], // more services that can be added to table  
				inboundDetails: {},
				outboundDetails: {},
				tabs: [],
				details: {}, // details to present 
				1: {
					details: {},
					currentServices: [], // current services for inbound flight
					moreServices: [], // more services for inbound flight
				},
				2: {
					details: {},
					currentServices: [], // current services for outbound flight 
					moreServices: [], // more services for outbound flight
				}
			});

			// set the flight services model
			// to render the data in the UI 
			this.setModel(oServicesModel, "flightServices");

			this.handleTabsVisibility(oFlightSegment);

			// map services for inbound and outbound flight 
			this.mapAndBindServices();

			this.renderServicesByDirection();

		},
		// TODO: Build tabs with binding ! 
		handleTabsVisibility: function (oFlightSegment) {

			var oFlightSegmentModel = this.getServicesModel();

			var aTabs = [];
			var icon = sap.ui.core.IconPool.getIconURI("arrival", "fa");

			if (oFlightSegment.Preaufnr) {

				var icon = sap.ui.core.IconPool.getIconURI("arrival", "fa");

				aTabs.push({
					title: "Arrival",
					key: Constants.FlightSegmentType.ARRIVAL,
					icon: sap.ui.core.IconPool.getIconURI("arrival", "fa")
				});

				this._oTabBar.setSelectedKey(Constants.FlightSegmentType.ARRIVAL);
			}

			if (oFlightSegment.Aufnr) {
				aTabs.push({
					title: "Departure",
					key: Constants.FlightSegmentType.DEPARTURE,
					icon: sap.ui.core.IconPool.getIconURI("departure", "fa")
				});

				if (!oFlightSegment.Preaufnr) {
					this._oTabBar.setSelectedKey(Constants.FlightSegmentType.DEPARTURE);
				}
			}

			oFlightSegmentModel.setProperty("/tabs", aTabs);

		},

		getServicesModel: function () {
			return this.getModel("flightServices");
		},

		renderServicesByDirection: function () {

			// copy the services from the relevant direction to displayed services 
			let nDirection = this._getDirection() === Constants.FlightSegmentType.ARRIVAL ? 1 : 2;
			var oServicesModel = this.getServicesModel();

			// We can do this because all model changes are done "by refrerence" so when
			// we will delete a service from the displayed services it will also be deleted 
			// from the inbound/outbound list 
			oServicesModel.setProperty("/currentServices", oServicesModel.getProperty("/" + nDirection + "/currentServices"));
			oServicesModel.setProperty("/moreServices", oServicesModel.getProperty("/" + nDirection + "/moreServices"));
			oServicesModel.setProperty("/details", oServicesModel.getProperty("/" + nDirection + "/details"));

			// refresh model to apply changes to the UI
			oServicesModel.refresh();
		},

		mapAndBindServices: function () {

			// make sure that the services has been loaded
			var oServicesModel = this.getModel("flightServices");

			if (!oServicesModel) {
				return;
			}

			// get the full flight segment object 
			var oFlightSegment = oServicesModel.getProperty("/flightSegment");

			var aServices = this._getServicesByLob(oFlightSegment);

			// map usage type to services 

			for (var i = 0; i < aServices.length; i++) {
				var oService = aServices[i];
				if (!oService.UsageTypeString) {
					continue;
				}

				// split the UsageTypeString by ; into usage types array
				oService.usageTypes = _.map(_.split(oService.UsageTypeString, ';'), function (usageType) {
					return {
						name: usageType
					};
				});
			}

			// get all directions from services and map them into array 
			var aDirections = _.map(_.uniqBy(aServices, function (oSrv) {
				return oSrv.Direction;
			}), function (oSrv) {
				return oSrv.Direction;
			});

			var self = this;

			// iterate on direction and collect all services per direction
			_.forEach(aDirections, function (nDirection) {

				var details = {};

				// Map arrival and departure details to model
				// We need to change this implementation soon as the server 
				// side will have one entity set that will contain both directions 	
				// TODO: Change this code when the server will made the changes 
				if (nDirection === 1) {
					details = self._getInboundDetailsByLob(oFlightSegment);
				} else if (nDirection === 2) {
					details = self._getOutboundDetailsByLob(oFlightSegment);
				}

				let aEntrySheetServices = _.filter(aServices, function (s) {
					// TODO: request from Roy to replace it to Edm.Boolean
					return s.EssrExists === "X" && s.Direction === nDirection;
				});

				// if there are entry sheet services then 
				// set them as the current services and all other services 
				// will be the additional services 
				if (aEntrySheetServices.length > 0) {
					// filter all more services
					let aMoreServices = _.filter(aServices, function (s) {
						// TODO: request from Roy to replace it to Edm.Boolean
						return s.EssrExists !== "X" && s.Direction === nDirection;
					});

					oServicesModel.setProperty("/" + nDirection, {
						details: details,
						currentServices: aEntrySheetServices,
						moreServices: aMoreServices
					});

				} else {
					// if there are no entry sheet services we need to present 
					// the routine services and all other services will be 
					// additional services

					let aMoreServices = _.filter(aServices, function (s) {
						return s.AdditionalFlag === "X" && s.Direction === nDirection;
					});

					let aRoutineServices = _.filter(aServices, function (s) {
						return s.AdditionalFlag !== "X" && s.Direction === nDirection;
					});

					oServicesModel.setProperty("/" + nDirection, {
						details: details,
						currentServices: aRoutineServices,
						moreServices: aMoreServices
					});
				}
			});
		},

		_getServicesByLob: function (oFlightSegment) {

			// get the flight services model 

			var sLob = this.getLobModel().getProperty("/lobType");
			if (sLob === Constants.LobType.AIRPORT_CHARGES) {
				return oFlightSegment.FlightSegmentItemSetAC.results;
			} else if (sLob === Constants.LobType.CARGO_DETAILS) {
				return oFlightSegment.FlightSegmentItemSetCG.results;
			} else if (sLob === Constants.LobType.ENG_SERVICES) {
				return oFlightSegment.FlightSegmentItemSetEG.results;
			} else if (sLob === Constants.LobType.OVERFLIGHT_SERVICES){
				return oFlightSegment.FlightSegmentItemSetOV.results;
			}
		},

		_getInboundDetailsByLob: function (oFlightSegment) {

			var sLob = this.getLobModel().getProperty("/lobType");

			if (sLob === Constants.LobType.AIRPORT_CHARGES) {
				return oFlightSegment.FlightSegmentHeaderInboundPax;
			} else if (sLob === Constants.LobType.CARGO_DETAILS) {
				return oFlightSegment.FlightSegmentHeaderInboundCargo;
			}
		},

		_getOutboundDetailsByLob: function (oFlightSegment) {

			var sLob = this.getLobModel().getProperty("/lobType");

			if (sLob === Constants.LobType.AIRPORT_CHARGES) {
				return oFlightSegment.FlightSegmentHeaderOutboundPax;
			} else if (sLob === Constants.LobType.CARGO_DETAILS) {
				return oFlightSegment.FlightSegmentHeaderOutboundCargo;
			}
		},

		/**
		 * Function that handle the remove of service from the current 
		 * services table. Removing service from the current services table 
		 * will transfer the deleted service to the more services table 
		 */
		onRemoveService: function (oEvent) {
			// get the parent row
			// because the click event captured on the table column 
			// the parent row will be the parent of the table column which is 
			// the one who capture the event 
			var oServiceRow = oEvent.getSource().getParent();

			// after we have the row we can simply get the item we want to transfer 
			// using the row binding path 
			var sBindingPath = oServiceRow.getBindingContextPath();

			var oServicesModel = this.getServicesModel();

			// take the service that needs to be removed from the current services 
			var oServiceToDelete = oServicesModel.getProperty(sBindingPath);

			// delete the service from the current services table 
			_.remove(oServicesModel.getData().currentServices, function (oSrv) {
				return oSrv.SrvcCode === oServiceToDelete.SrvcCode
			});

			// add the deleted service to the more services table 
			oServicesModel.getData().moreServices.push(oServiceToDelete);

			// refresh the model to apply changes in the UI
			oServicesModel.refresh(true);

		},

		onMoreServicesButtonPressed: function (oEvent) {
			if (!this._oMoreServicesDialog) {
				this._oMoreServicesDialog = sap.ui.xmlfragment("fas.fragments.MoreServices", this);
			}

			this.getView().addDependent(this._oMoreServicesDialog);

			this._oMoreServicesDialog.open();
		},

		onConfirmMoreServicesDialog: function (oEvent) {
			// get the selected items 
			var aSelectedItems = oEvent.getParameter("selectedItems");

			// if user did not select items then we can do nothing
			if (!aSelectedItems || aSelectedItems.length === 0) {
				return;
			}

			// extract the services that needs to be added from the services model
			// and then add them to the current services table 
			var oServicesModel = this.getModel("flightServices");
			var aServicesToRemove = [];

			for (var i = 0; i < aSelectedItems.length; i++) {
				var sServiceBindingPath = aSelectedItems[i].getBindingContextPath();
				// take the relevant service from the model 
				var oServiceToAdd = oServicesModel.getProperty(sServiceBindingPath);

				if (!oServiceToAdd) {

					continue;
				}

				// add the service to the current services (push to bottom)
				oServicesModel.getData().currentServices.push(oServiceToAdd);

				aServicesToRemove.push(oServiceToAdd);

				// _.remove(aMoreServices, function (oSrv) {
				// 	return oSrv.SrvcCode === oServiceToAdd.SrvcCode
				// });
			}

			// remove all selected services from the more services table
			_.remove(oServicesModel.getData().moreServices, function (oSrv) {
				return _.includes(aServicesToRemove, oSrv);
			});

			oServicesModel.refresh(true);

			// make sure to destroy dialog after finish
			this._oMoreServicesDialog.destroy();
			this._oMoreServicesDialog = null;
		},

		onCancelMoreServicesDialog: function (oEvent) {
			// make sure to destroy dialog after finish
			this._oMoreServicesDialog.destroy();
			this._oMoreServicesDialog = null;
		}

		// ========================= End of Flight Services =========================

	});

});