sap.ui.define(
  [
    "./DetailsBaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "../model/formatter",
    "sap/f/LayoutType",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (
    BaseController,
    JSONModel,
    History,
    formatter,
    LayoutType,
    Filter,
    FilterOperator
  ) {
    "use strict";

    return BaseController.extend("triplog.controller.PassengerRecord", {
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
          busy: true,
          delay: 0,
        });

        this.setModel(oViewModel, "cargoRecordView");

        this.getRouter()
          .getRoute("cargoRecord")
          .attachPatternMatched(function (oEvent) {
            this.onObjectMatched(
              oViewModel,
              oEvent.getParameter("arguments"),              
              "/cargorecordStaging"
            );
          }, this);
      }
    });
  }
);
