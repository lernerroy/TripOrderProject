sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"sap/ui/model/FilterType",
	"sap/ui/core/Fragment",
	"../model/formatter",
	"../constants/Constants",
], function (BaseController, JSONModel, Filter, Sorter, FilterOperator, GroupHeaderListItem, Device, FilterType, Fragment, formatter,
	Constants) {
	"use strict";

	return BaseController.extend("fas.controller.Master", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the master list controller is instantiated. It sets up the event handling for the master/detail communication and other lifecycle tasks.
		 * @public
		 */
		onInit: function () {

			// Control state model
			var oList = this.byId("list"),
				oViewModel = this._createViewModel(),
				// Put down master list's original value for busy indicator delay,
				// so it can be restored later on. Busy handling on the master list is
				// taken care of by the master list itself.
				iOriginalBusyDelay = oList.getBusyIndicatorDelay();

			this._oList = oList;
			// keeps the filter and search state
			this._oListFilterState = {
				aFilter: [],
				searchQuery: undefined
			};

			this.setModel(oViewModel, "masterView");
			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oList.attachEventOnce("updateFinished", function () {
				// Restore original busy indicator delay for the list
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});

			var self = this;

			oList.attachEventOnce("updateStarted", function () {
				self._applyFilterFromStorage();
			});

			this.getView().addEventDelegate({
				onBeforeFirstShow: function () {
					this.getOwnerComponent().oListSelector.setBoundMasterList(oList);
				}.bind(this)
			});

			this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
			this.getRouter().attachBypassed(this.onBypassed, this);

		},

		onSearch: function (oEvent) {
			var query = oEvent.getParameter("query");

			if (query && query.length) {
				this._oListFilterState.searchQuery = query;
			} else {
				this._oListFilterState.searchQuery = undefined;
			}

			this._applyFilterSearch();

		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * After list data is available, this handler method updates the
		 * master list counter
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function (oEvent) {
			// update the master list object counter after new data is loaded
			this._updateListItemCount(oEvent.getParameter("total"));
		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function () {
			this._oList.getBinding("items").refresh();
		},

		/**
		 * Event handler for the filter, sort and group buttons to open the ViewSettingsDialog.
		 * @param {sap.ui.base.Event} oEvent the button press event
		 * @public
		 */
		onOpenViewSettings: function (oEvent) {
			var sDialogTab = "filter";
			if (oEvent.getSource() instanceof sap.m.Button) {
				var sButtonId = oEvent.getSource().getId();
				if (sButtonId.match("sort")) {
					sDialogTab = "sort";
				} else if (sButtonId.match("group")) {
					sDialogTab = "group";
				}
			}
			
			var oDialog = this.byId("viewSettingsDialog");
			
			// load asynchronous XML fragment
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(this.getView().getId(), "fas.view.ViewSettingsDialog", this);
				oDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				this.getView().addDependent(oDialog);
			} 
			
			oDialog.open(sDialogTab);

		},

		/**
		 * Event handler called when ViewSettingsDialog has been confirmed, i.e.
		 * has been closed with 'OK'. In the case, the currently chosen filters, sorters or groupers
		 * are applied to the master list, which can also mean that they
		 * are removed from the master list, in case they are
		 * removed in the ViewSettingsDialog.
		 * @param {sap.ui.base.Event} oEvent the confirm event
		 * @public
		 */
		onConfirmViewSettingsDialog: function (oEvent) {

			var aFilterItems = oEvent.getParameters().filterItems;

			var filterObj = {
				filters: {},
				filterString: oEvent.getParameters().filterString
			};

			aFilterItems.forEach(function (oItem) {

				if (!filterObj.filters[oItem.getParent().getKey()]) {
					filterObj.filters[oItem.getParent().getKey()] = [];
				}

				filterObj.filters[oItem.getParent().getKey()].push({
					operator: FilterOperator.EQ,
					value: oItem.getKey()
				});
			});
			
			window.localStorage.setItem("currentFilter", JSON.stringify(filterObj));
			
			this._applyFilterFromStorage();

		},

		_applyFilterFromStorage: function () {


			var filterObjString = window.localStorage.getItem("currentFilter");

			// if no filters found in local storage 
			// we can simply continue 
			if (!filterObjString) {
				return;
			}

			var filterObj = JSON.parse(filterObjString);

			var aFilters = [];

			var legstateFilters = [];
			var airportChargesFilters = [];
			var cargoFilters = [];
			var engServicesFilters = [];

			Object.keys(filterObj.filters).map(function (key) {
				var filtersVal = filterObj.filters[key];
				filtersVal.forEach(function (filter) {
					switch (key) {
					case "legstate":
						legstateFilters.push(new Filter("NxtLegState", filter.operator, filter.value));
						break;
					case "airportcharges":
						airportChargesFilters.push(new Filter("NxtAirpLight", filter.operator, filter.value));
						break;
					case "cargo":
						cargoFilters.push(new Filter("NxtCrgoLight", filter.operator, filter.value));
						break;
					case "engservices":
						engServicesFilters.push(new Filter("NxtEngrLight", filter.operator, filter.value));
						break;
					default:
						break;
					}
				});
			});

			// build the final filters array 
			if (legstateFilters.length > 0) {
				aFilters.push(new Filter({
					filters: legstateFilters,
					and: false
				}));
			}

			if (airportChargesFilters.length > 0) {
				aFilters.push(new Filter({
					filters: airportChargesFilters,
					and: false
				}));
			}

			if (cargoFilters.length > 0) {
				aFilters.push(new Filter({
					filters: cargoFilters,
					and: false
				}));
			}

			if (engServicesFilters.length > 0) {
				aFilters.push(new Filter({
					filters: engServicesFilters,
					and: false
				}));
			}

			this._oListFilterState.aFilter = aFilters;

			this._updateFilterBar(filterObj.filterString);

			this._applyFilterSearch();
		},

		/**
		 * Event handler for the list selection event
		 * @param {sap.ui.base.Event} oEvent the list selectionChange event
		 * @public
		 */
		onSelectionChange: function (oEvent) {

			var oList = oEvent.getSource(),
				bSelected = oEvent.getParameter("selected");

			// get the selected list item
			var oSelectedItem = oEvent.getParameter("listItem");

			// save the current selected list item path 

			// skip navigation when deselecting an item in multi selection mode
			if (!(oList.getMode() === "MultiSelect" && !bSelected)) {
				// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
				this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
			}
		},

		/**
		 * Event handler for the bypassed event, which is fired when no routing pattern matched.
		 * If there was an object selected in the master list, that selection is removed.
		 * @public
		 */
		onBypassed: function () {
			this._oList.removeSelections(true);
		},

		/**
		 * Used to create GroupHeaders with non-capitalized caption.
		 * These headers are inserted into the master list to
		 * group the master list's items.
		 * @param {Object} oGroup group whose text is to be displayed
		 * @public
		 * @returns {sap.m.GroupHeaderListItem} group header with non-capitalized caption.
		 */
		createGroupHeader: function (oGroup) {
			return new GroupHeaderListItem({
				title: oGroup.text,
				upperCase: false
			});
		},

		/**
		 * Event handler for navigating back.
		 * We navigate back in the browser historz
		 * @public
		 */
		onNavBack: function () {
			// eslint-disable-next-line sap-no-history-manipulation
			history.go(-1);
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		_createViewModel: function () {
			return new JSONModel({
				isFilterBarVisible: false,
				filterBarLabel: "",
				delay: 0,
				title: this.getResourceBundle().getText("masterTitleCount", ["...", ""]),
				noDataText: this.getResourceBundle().getText("masterListNoDataText"),
				sortBy: "Arrairp",
				groupBy: "None"
			});
		},

		_onMasterMatched: function () {
			//Set the layout property of the FCL control to 'OneColumn'
			this.getModel("appView").setProperty("/layout", "OneColumn");
		},

		/**
		 * Shows the selected item on the detail page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showDetail: function (oItem) {
			var bReplace = !Device.system.phone;
			// set the layout property of FCL control to show two columns
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getRouter().navTo("object", {
				arrFlightNo: oItem.getBindingContext().getProperty("Preaufnr"),
				depFlightNo: oItem.getBindingContext().getProperty("Aufnr")
			}, bReplace);
		},

		/**
		 * Sets the item count on the master list header
		 * @param {integer} iTotalItems the total number of items in the list
		 * @private
		 */
		_updateListItemCount: function (iTotalItems) {
			var sTitle;
			// only update the counter if the length is final
			if (this._oList.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("masterTitleCount", [iTotalItems, "BOG"]);
				// sTitle = this.getResourceBundle().getText("masterTitleCount", [iTotalItems]);
				this.getModel("masterView").setProperty("/title", sTitle);
			}
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @private
		 */
		_applyFilterSearch: function () {
			
			var aFilters = this._oListFilterState.aFilter;
			var searchQuery = this._oListFilterState.searchQuery;

			var oBindingInfo = this._oList.getBindingInfo("items");
			oBindingInfo.filters = aFilters;
			
			// apply search query to custom url parameters
			if (searchQuery && searchQuery.length){
				oBindingInfo.parameters.custom.search = searchQuery;
			} else {
				delete oBindingInfo.parameters.custom.search;
			}
			
			this._oList.bindItems(oBindingInfo);
		},

		/**
		 * Internal helper method that sets the filter bar visibility property and the label's caption to be shown
		 * @param {string} sFilterBarText the selected filter value
		 * @private
		 */
		_updateFilterBar: function (sFilterBarText) {
			var oViewModel = this.getModel("masterView");
			oViewModel.setProperty("/isFilterBarVisible", (this._oListFilterState.aFilter.length > 0));
			oViewModel.setProperty("/filterBarLabel", sFilterBarText);
			// oViewModel.setProperty("/filterBarLabel", this.getResourceBundle().getText("masterFilterBarText", [sFilterBarText]));
		}

	});

});