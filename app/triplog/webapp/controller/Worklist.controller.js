sap.ui.define(
    [
        "./BaseController",
        "sap/ui/model/json/JSONModel",
        "../model/formatter",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/ColumnListItem",
        "sap/m/ObjectIdentifier",
        "sap/m/ObjectAttribute",
        "sap/m/ObjectStatus",
        "triplog/utils/Rest",
        "sap/ui/core/format/DateFormat"
    ],
    function (
        BaseController,
        JSONModel,
        formatter,
        Filter,
        FilterOperator,
        ColumnListItem,
        ObjectIdentifier,
        ObjectAttribute,
        ObjectStatus,
        Rest,
        DateFormat
    ) {
        "use strict";

        return BaseController.extend("triplog.controller.Worklist", {
            formatter: formatter,

            /* =========================================================== */
            /* lifecycle methods                                           */
            /* =========================================================== */

            /**
             * Called when the worklist controller is instantiated.
             * @public
             */
            onInit: function () {
                var oViewModel;

                // keeps the search state
                this._aTableSearchState = [];

                // Model used to manipulate control states
                oViewModel = new JSONModel({
                    worklistTableTitle: this.getResourceBundle().getText(
                        "worklistTableTitle"
                    ),
                    shareSendEmailSubject: this.getResourceBundle().getText(
                        "shareSendEmailWorklistSubject"
                    ),
                    shareSendEmailMessage: this.getResourceBundle().getText(
                        "shareSendEmailWorklistMessage",
                        [location.href]
                    ),
                    tableNoDataText: this.getResourceBundle().getText(
                        "tableNoDataText"
                    ),
                });
                this.setModel(oViewModel, "worklistView");

                var oFilterModel = new JSONModel({
                    timestamp: {
                        from: undefined,
                        to: undefined,
                        dateFormat: "yyyy/MM/dd"
                    },
                    selectedStatuses: [],
                    selectedLogTypes: []
                });

                this.setModel(oFilterModel, "triplogFilters");
            },

            /* =========================================================== */
            /* event handlers                                              */
            /* =========================================================== */

            /**
             * Triggered by the table's 'updateFinished' event: after new table
             * data is available, this handler method updates the table counter.
             * This should only happen if the update was successful, which is
             * why this handler is attached to 'updateFinished' and not to the
             * table's list binding's 'dataReceived' method.
             * @param {sap.ui.base.Event} oEvent the update finished event
             * @public
             */
            onUpdateFinished: function (oEvent) {

                // // update the worklist's object counter after the table update
                // var sTitle,
                //     oTable = oEvent.getSource(),
                //     iTotalItems = oEvent.getParameter("total");
                // // only update the counter if the length is final and
                // // the table is not empty
                // if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                //     sTitle = this.getResourceBundle().getText(
                //         "worklistTableTitleCount",
                //         [iTotalItems]
                //     );
                // } else {
                //     sTitle = this.getResourceBundle().getText(
                //         "worklistTableTitle"
                //     );
                // }
                // this.getModel("worklistView").setProperty(
                //     "/worklistTableTitle",
                //     sTitle
                // );
            },

            /**
             * Event handler when a table item gets pressed
             * @param {sap.ui.base.Event} oEvent the table selectionChange event
             * @public
             */
            onPress: function (oEvent) {
                // The source is the list item that got pressed
                this._showObject(oEvent.getSource());
            },

            /**
             * Event handler for navigating back.
             * Navigate back in the browser history
             * @public
             */
            onNavBack: function () {
                // eslint-disable-next-line sap-no-history-manipulation
                history.go(-1);
            },

            onSearch: function (oEvent) {
                if (oEvent.getParameters().refreshButtonPressed) {
                    // Search field's 'refresh' button has been pressed.
                    // This is visible if you select any main list item.
                    // In this case no new search is triggered, we only
                    // refresh the list binding.
                    this.onRefresh();
                } else {
                    var aTableSearchState = [];
                    var sQuery = oEvent.getParameter("query");

                    if (sQuery && sQuery.length > 0) {
                        aTableSearchState = [
                            new Filter(
                                "insupcarriercode2",
                                FilterOperator.Contains,
                                sQuery
                            ),
                        ];
                    }
                    this._applySearch(aTableSearchState);
                }
            },
            /** Event Handler for Search Functionality on Filter */
            onFilter: function () {
                var aFilters = [];
                var oTable = this.getView().byId("tripLogTable");
                var oBinding = oTable.getBinding("items");
                var oFiltersModel = this.getModel("triplogFilters");

                var timestamp = oFiltersModel.getProperty("/timestamp");

                if (timestamp.from && timestamp.to) {
                    var dateFormat = DateFormat.getDateInstance({ pattern: "YYYY-MM-ddTHH:mm:ss.sss", UTC: true });
                    // set start of day 
                    var fromStringDate = dateFormat.format(timestamp.from, false) + "Z";
                    // set end of day
                    var toStringDate = dateFormat.format(timestamp.to, false) + "Z";
    
                    // build the timestamp filters
                    aFilters.push(new Filter({
                        path: "creation_timestamp",
                        operator: FilterOperator.BT,
                        value1: fromStringDate,
                        value2: toStringDate
                    }));
                }

                // build statuses filter
                const selectedStatuses = oFiltersModel.getProperty("/selectedStatuses");

                var aStatusFilters = [];

                selectedStatuses.forEach(status => {
                    aStatusFilters.push(new Filter({
                        path: "status_code",
                        operator: FilterOperator.EQ,
                        value1: status
                    }));
                });

                if (aStatusFilters.length){
                    aFilters.push(new Filter({
                        filters: aStatusFilters,
                        and: false
                    }));
                }

                oTable.getBinding("items").filter(aFilters);

                if (oBinding.isSuspended()) {
                    oTable.getBinding("items").resume();
                }
            },

            /**
             * Event handler for refresh event. Keeps filter, sort
             * and group settings and refreshes the list binding.
             * @public
             */
            onRefresh: function () {
                // var oTable = this.byId("table");
                // oTable.getBinding("items").refresh();
            },

            /* =========================================================== */
            /* internal methods                                            */
            /* =========================================================== */

            /**
             * Shows the selected item on the object page
             * @param {sap.m.ObjectListItem} oItem selected Item
             * @private
             */
            _showObject: function (oItem) {
                this.getRouter().navTo("object", {
                    objectId: oItem
                        .getBindingContext()
                        .getPath()
                        .substring("/triplog".length),
                });
            },

            /**
             * Internal helper method to apply both filter and search state together on the list binding
             * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
             * @private
             */
            _applySearch: function (aTableSearchState) {
                var oTable = this.byId("table"),
                    oViewModel = this.getModel("worklistView");
                oTable
                    .getBinding("items")
                    .filter(aTableSearchState, "Application");
                // changes the noDataText of the list in case there are no filter results
                if (aTableSearchState.length !== 0) {
                    oViewModel.setProperty(
                        "/tableNoDataText",
                        this.getResourceBundle().getText(
                            "worklistNoDataWithSearchText"
                        )
                    );
                }
            },

            onProcess: function (oEvent) {
                // const sPath = this.getView().getModel().sServiceUrl.slice(2) + "processMessage";  // For deployment
                const sPath = "/browse/processMessage"; // For Local
                const requestData = {
                    trips: []
                };
                const oTable = this.getView().byId("table");
                oTable.getSelectedContexts().forEach((oContext) => {
                    requestData.trips.push(oContext.getObject());
                });
                this.getView().setBusy(true);
                const csrfToken = this.getView().getModel().getHttpHeaders()[
                    "X-CSRF-Token"
                ];
                Rest.ajaxCall("POST", sPath, csrfToken, requestData).then(
                    (oSuccess) => {
                        oTable.getBinding("items").refresh();
                        sap.m.MessageToast.show(
                            this.getResourceBundle().getText(
                                "messageProcessSuccesful"
                            )
                        );
                        this.getView().setBusy(false);
                    },
                    (oError) => {
                        if (oError.responseJSON) {
                            sap.m.MessageBox.error(
                                `${oError.responseJSON.error.code} - ${oError.responseJSON.error.message}`
                            );
                        } else {
                            sap.m.MessageBox.error(`${oError.responseText}`);
                        }

                        this.getView().setBusy(false);
                    }
                );
            }
        });
    }
);
