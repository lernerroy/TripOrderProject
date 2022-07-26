sap.ui.define(
  [
    "./DetailsBaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/f/LayoutType",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (
    BaseController,
    JSONModel,
    formatter,
    LayoutType,
    Filter,
    FilterOperator
  ) {
    "use strict";

    return BaseController.extend("triplog.controller.Statuses", {
      formatter: formatter,

      /* =========================================================== */
      /* lifecycle methods                                           */
      /* =========================================================== */

      /**
       * Called when the worklist controller is instantiated.
       * @public
       */
      onInit: function () {
        // Model used to manipulate control states. The chosen values make sure,
        // detail page shows busy indication immediately so there is no break in
        // between the busy indication for loading the view's meta data
        var oViewModel = new JSONModel({
          busy: false,
          delay: 0,
        });

        this.setModel(oViewModel, "statusView");

        this.getRouter()
          .getRoute("statuses")
          .attachPatternMatched(this.onObjectMatched, this);
      },
      _onMessageProcessed: function (oEvent) {
        // currently we simply refresh the statuses each time a message is being processed o
        // we can check if we really need to refresh it by checking the data in the event and
        // check there if one of the processed items is the current items that we are displaying.
        var oTable = this.getView().byId("statusesTable");
        oTable.getBinding("items").refresh();
      },
      _onMessageReset: function (oEvent) {
        var oTable = this.getView().byId("statusesTable");
        oTable.getBinding("items").refresh();
      },
      onObjectMatched: function (oEvent) {
        var oArgs = oEvent.getParameter("arguments");

        // subscribe to process message and reset message events
        this.getEventBus().subscribe(
          null,
          "messageProcessed",
          this._onMessageProcessed,
          this
        );

        // subscribe to process message and reset message events
        this.getEventBus().subscribe(
          null,
          "messageReset",
          this._onMessageReset,
          this
        );

        var aFilters = [];

        Object.entries(oArgs).forEach(([key, value]) => {
          aFilters.push(
            new Filter({
              path: key,
              operator: FilterOperator.EQ,
              value1: value || "",
            })
          );
        });

        var oFilter = new Filter({
          filters: aFilters,
          and: true,
        });

        var oTable = this.getView().byId("statusesTable");
        var oBinding = oTable.getBinding("items");

        oBinding.filter(oFilter, sap.ui.model.FilterType.Control);

        if (oBinding.isSuspended()) {
          oBinding.resume();
        }

        this.getAppViewModel().setProperty(
          "/layout",
          LayoutType.TwoColumnsBeginExpanded
        );
      },
    });
  }
);
