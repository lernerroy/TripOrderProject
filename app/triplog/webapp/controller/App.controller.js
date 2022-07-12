sap.ui.define(
  ["./BaseController", "sap/f/LayoutType", "sap/ui/model/json/JSONModel"],
  function (BaseController, LayoutType, JSONModel) {
    "use strict";

    return BaseController.extend("triplog.controller.App", {
      onInit: function () {

        var oViewModel = new JSONModel({
            busy: false,
            delay: 0,
            layout: LayoutType.OneColumn,
          });
  
          this.getOwnerComponent().setModel(oViewModel, "appView");

        // apply content density mode to root view
        this.getView().addStyleClass(
          this.getOwnerComponent().getContentDensityClass()
        );
      },
    });
  }
);
