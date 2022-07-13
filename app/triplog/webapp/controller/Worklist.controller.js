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
    "sap/ui/core/format/DateFormat",
    "sap/ui/table/library",
    "sap/ui/core/Fragment",
    "sap/ui/model/Sorter",
    "sap/ui/Device",
    "../model/enums",
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
    DateFormat,
    library,
    Fragment,
    Sorter,
    Device,
    Enums
  ) {
    "use strict";
    // shortcut for sap.ui.table.SortOrder
    var sortOrder = library.SortOrder;

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

        // keeps the reference to any of the created sap.m.ViewSettingsDialog
        this._mViewSettingsDialogs = {};

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
          tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
          showFooter: false,
          processButtonEnabled: false,
          resetButtonEnabled: false,
          search: "",
        });
        this.setModel(oViewModel, "worklistView");

        var oFilterModel = new JSONModel({
          timestamp: {
            from: undefined,
            to: undefined,
            dateFormat: "yyyy/MM/dd",
          },
          selectedStatuses: [],
          selectedLogTypes: [],
        });

        this.setModel(oFilterModel, "triplogFilters");
      },

      onTripPreview: function (oEvent) {
        var oItem = {};

        var params = {
          CarrierCode: oItem.insupcarriercode2,
          FlightNo: oItem.inflightno,
          Origin: oItem.inorigin,
          Destination: oItem.indestination,
          SchDate: oItem.inscheddeptdate,
          surrogatenum: oItem.surrogatenum,
        };
        var xnaservice =
          sap.ushell &&
          sap.ushell.Container &&
          sap.ushell.Container.getService &&
          sap.ushell.Container.getService("CrossApplicationNavigation");
        var href =
          (xnaservice &&
            xnaservice.hrefForExternal({
              target: {
                semanticObject: "TripCollated",
                action: "manage",
              },
              params: params,
            })) ||
          "";
        console.log(href);
        xnaservice.toExternal({
          target: {
            shellHash: href,
          },
        });
      },

      onWorklistTableSelectionChange: function (oEvent) {
        var aSelectedItems = oEvent.getSource().getSelectedItems();
        var aItems = aSelectedItems.map(function (item) {
          return item.getBindingContext().getObject();
        });

        this.getModel("worklistView").setProperty(
          "/processButtonEnabled",
          this._hasItemsForProcess(aItems)
        );
        this.getModel("worklistView").setProperty(
          "/resetButtonEnabled",
          this._hasItemsForReset(aItems)
        );
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
      onWorklistUpdateFinished: function (oEvent) {
        var oItemsBinding = oEvent.getSource().getBinding("items");

        var aItems = oItemsBinding.getContexts().map(function (context) {
          return context.getObject();
        });

        var showProcessedFooter =
          this._hasItemsForProcess(aItems) || this._hasItemsForReset(aItems);
        this.getModel("worklistView").setProperty(
          "/showFooter",
          showProcessedFooter
        );

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

      _hasItemsForProcess: function (aItems) {
        var hasItems = false;

        // Check if we found at least one item that can be processed
        for (var i = 0; i < aItems.length; i++) {
          if (parseInt(aItems[i].status) !== Enums.Status.PROCESSED) {
            hasItems = true;
            break;
          }
        }
        return hasItems;
      },

      _hasItemsForReset: function (aItems) {
        var hasItems = false;
        // Check if we found at least one item that can be processed
        for (var i = 0; i < aItems.length; i++) {
          if (
            parseInt(aItems[i].status) !== Enums.Status.READY_FOR_PROCESSING
          ) {
            hasItems = true;
            break;
          }
        }
        return hasItems;
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
      /** Event Handler for Search Functionality on Filter */
      onFilter: function () {
        var aFilters = [];
        var oTable = this.getView().byId("tripLogTable");
        var oBinding = oTable.getBinding("items");
        oBinding.refresh();
        var oFiltersModel = this.getModel("triplogFilters");

        var sQuery = this.getModel("worklistView").getProperty("/search");

        var aSearchFilters = this._getSearchFilters(sQuery);
        if (aSearchFilters.length) {
          aFilters.push(
            new Filter({
              filters: aSearchFilters,
              and: false,
            })
          );
        }

        var timestamp = oFiltersModel.getProperty("/timestamp");

        if (timestamp.from && timestamp.to) {
          var dateFormat = DateFormat.getDateInstance({
            pattern: "YYYY-MM-ddTHH:mm:ss.sss",
            UTC: true,
          });
          // set start of day
          var fromStringDate = dateFormat.format(timestamp.from, false) + "Z";
          // set end of day
          var toStringDate = dateFormat.format(timestamp.to, false) + "Z";

          // build the timestamp filters
          aFilters.push(
            new Filter({
              path: "creation_timestamp",
              operator: FilterOperator.BT,
              value1: fromStringDate,
              value2: toStringDate,
            })
          );
        }

        // build statuses filter
        const selectedStatuses = oFiltersModel.getProperty("/selectedStatuses");

        var aStatusFilters = [];

        selectedStatuses.forEach((status) => {
          aStatusFilters.push(
            new Filter({
              path: "status",
              operator: FilterOperator.EQ,
              value1: status,
            })
          );
        });

        if (aStatusFilters.length) {
          aFilters.push(
            new Filter({
              filters: aStatusFilters,
              and: false,
            })
          );
        }

        // Build log type filters
        const selectedLogTypes = oFiltersModel.getProperty("/selectedLogTypes");

        var aLogTypesFilters = [];

        selectedLogTypes.forEach((logType) => {
          aLogTypesFilters.push(
            new Filter({
              path: "logtype",
              operator: FilterOperator.EQ,
              value1: logType,
            })
          );
        });

        if (aLogTypesFilters.length) {
          aFilters.push(
            new Filter({
              filters: aLogTypesFilters,
              and: false,
            })
          );
        }

        oTable
          .getBinding("items")
          .filter(aFilters, sap.ui.model.FilterType.Control);

        if (oBinding.isSuspended()) {
          oTable.getBinding("items").resume();
        }
      },

      showStatuses: function (oEvent) {
        var oItem = oEvent.getSource().getBindingContext().getObject();
        this.getRouter().navTo("statuses", {
          insupcarriercode2: oItem.insupcarriercode2,
          inflightno: oItem.inflightno,
          inorigin: oItem.inorigin,
          indestination: oItem.indestination,
          inscheddeptdate: oItem.inscheddeptdate,
          surrogatenum: oItem.surrogatenum,
          creation_timestamp: oItem.creation_timestamp,
        });
      },

      _getSearchFilters: function (sQuery) {
        if (!sQuery || !sQuery.length) {
          return [];
        }

        var searchFields = [
          "insupcarriercode2",
          "surrogatenum",
          // you can add more fields in here
        ];

        return searchFields.map(function (field) {
          return new Filter({
            path: field,
            operator: FilterOperator.Contains,
            value1: sQuery,
          });
        });
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

      onWorklistItemPressed: function (oEvent) {
        var oListItem = oEvent.getParameter("listItem");
        this._showObject(oListItem.getBindingContext().getObject());
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
        var navTo = "";
        switch (parseInt(oItem.logtype)) {
          case Enums.LogType.TRIP:
            navTo = "object";
            break;
          case Enums.LogType.PASSENGER:
            navTo = "passengerRecord";
            break;
          case Enums.LogType.CARGO:
            navTo = "cargoRecord";
            break;
        }
        this.getRouter().navTo(navTo, {
          insupcarriercode2: oItem.insupcarriercode2,
          inflightno: oItem.inflightno,
          inorigin: oItem.inorigin,
          indestination: oItem.indestination,
          inscheddeptdate: oItem.inscheddeptdate,
          surrogatenum: oItem.surrogatenum,
          creation_timestamp: oItem.creation_timestamp,
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
        oTable.getBinding("items").filter(aTableSearchState, "Application");
        // changes the noDataText of the list in case there are no filter results
        if (aTableSearchState.length !== 0) {
          oViewModel.setProperty(
            "/tableNoDataText",
            this.getResourceBundle().getText("worklistNoDataWithSearchText")
          );
        }
      },

      onProcess: function (oEvent) {
        var oTable = this.getView().byId("tripLogTable");
        // get all selected objects
        var aSelectedItems = oTable
          .getSelectedContexts()
          .map(function (oContext) {
            return oContext.getObject();
          });
        // get all items that needs to be processed
        var aItemsToProcess = aSelectedItems.filter(function (item) {
          return item.status !== Enums.Status.PROCESSED;
        });

        var oOperation = this.getModel().bindContext("/processMessage(...)");
        oOperation.setParameter("trips", aItemsToProcess);

        this.getView().setBusy(true);
        var self = this;

        oOperation
          .execute()
          .then(function (oUpdatedContext) {
            self.showMessage(
              self.getResourceBundle().getText("messageProcessSuccesful")
            );
            oTable.getBinding("items").refresh();
            self.getView().setBusy(false);
          })
          .catch(function (err) {
            console.log("Error", err);
            oTable.getBinding("items").refresh();
            self.getView().setBusy(false);
          });
      },

      onReset: function (oEvent) {
        var oTable = this.getView().byId("tripLogTable");
        // get all selected objects
        var aSelectedItems = oTable
          .getSelectedContexts()
          .map(function (oContext) {
            return oContext.getObject();
          });
        // get all items that needs to be processed
        var aItemsToProcess = aSelectedItems.filter(function (item) {
          return item.status !== Enums.Status.READY_FOR_PROCESSING;
        });

        var oOperation = this.getModel().bindContext("/resetMessage(...)");
        oOperation.setParameter("trips", aItemsToProcess);

        this.getView().setBusy(true);
        var self = this;

        oOperation
          .execute()
          .then(function (oUpdatedContext) {
            self.showMessage(
              self.getResourceBundle().getText("messageProcessSuccesful")
            );
            oTable.getBinding("items").refresh();
            self.getView().setBusy(false);
          })
          .catch(function (err) {
            console.log("Error", err);
            oTable.getBinding("items").refresh();
            self.getView().setBusy(false);
          });
      },

      getViewSettingsDialog: function (sDialogFragmentName) {
        var pDialog = this._mViewSettingsDialogs[sDialogFragmentName];

        if (!pDialog) {
          pDialog = Fragment.load({
            id: this.getView().getId(),
            name: sDialogFragmentName,
            controller: this,
          }).then(function (oDialog) {
            if (Device.system.desktop) {
              oDialog.addStyleClass("sapUiSizeCompact");
            }
            return oDialog;
          });
          this._mViewSettingsDialogs[sDialogFragmentName] = pDialog;
        }
        return pDialog;
      },

      handleSortButtonPressed: function () {
        var oBundle = this.getView().getModel("i18n").getResourceBundle();
        this.getViewSettingsDialog("triplog.view.SortDialog").then(function (
          oViewSettingsDialog
        ) {
          var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleUrl: oBundle.aPropertyOrigins[0],
          });
          oViewSettingsDialog.setModel(i18nModel, "i18n");
          oViewSettingsDialog.open();
        });
      },

      handleSortDialogConfirm: function (oEvent) {
        var oTable = this.byId("tripLogTable"),
          mParams = oEvent.getParameters(),
          oBinding = oTable.getBinding("items"),
          sPath,
          bDescending,
          aSorters = [];

        sPath = mParams.sortItem.getKey();
        bDescending = mParams.sortDescending;
        aSorters.push(new Sorter(sPath, bDescending));

        // apply the selected sort and group settings
        oBinding.sort(aSorters);
      },
    });
  }
);
