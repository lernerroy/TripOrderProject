sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/f/LayoutType",
  ],
  function (BaseController, Filter, FilterOperator, LayoutType) {
    "use strict";

    return BaseController.extend("triplog.controller.DetailsBaseController", {
      onObjectMatched: function (oViewModel, oArgs, sBindingPath) {
        var aFilters = [];

        Object.entries(oArgs).forEach(([key, value]) => {
          aFilters.push(
            new Filter({
              path: key,
              operator: FilterOperator.EQ,
              value1: value,
            })
          );
        });

        var oFilter = new Filter({
          filters: aFilters,
          and: true,
        });

        var oListBinding = this.getModel().bindList(
          sBindingPath,
          null,
          null,
          oFilter,
          null
        );

        this.getAppViewModel().setProperty(
          "/layout",
          LayoutType.TwoColumnsBeginExpanded
        );

        oListBinding
          .requestContexts(0, 1)
          .then(
            function (aContexts) {
              if (aContexts && aContexts.length > 0) {
                this.oContext = aContexts[0];
                this._bindView(this.oContext, oViewModel);
              }
            }.bind(this)
          )
          .catch(function (error) {}.bind(this));
      },
      _bindView: function (oContext, oViewModel) {
        this.getView().bindElement({
          path: oContext.getPath(),
          events: {
            dataRequested: function () {
              oViewModel.setProperty("/busy", true);
            },
            dataReceived: function () {
              oViewModel.setProperty("/busy", false);
            },
          },
        });
      },
      onClose: function () {
        this.getRouter().navTo("worklist", {}, true);
        this.getAppViewModel().setProperty("/layout", LayoutType.OneColumn);
      },
    });
  }
);
