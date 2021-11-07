sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "../constants/Constants",
    "sap/ui/Device",
    "sap/m/library",
  ],
  function (
    BaseController,
    JSONModel,
    formatter,
    Constants,
    Device,
    mobileLibrary
  ) {
    "use strict";

    // shortcut for sap.m.URLHelper
    var URLHelper = mobileLibrary.URLHelper;

    return BaseController.extend("fas.controller.Detail", {
      formatter: formatter,

      /* =========================================================== */
      /* lifecycle methods                                           */
      /* =========================================================== */

      onInit: function () {
        // Model used to manipulate control states. The chosen values make sure,
        // detail page is busy indication immediately so there is no break in
        // between the busy indication fonr loading the view's meta data
        var oViewModel = new JSONModel({
          busy: false,
          delay: 0,
          lineItemListTitle: this.getResourceBundle().getText(
            "detailLineItemTableHeading"
          ),
          arrivals: "ARR",
          departure: "DEP",
        });

        this.getRouter()
          .getRoute("object")
          .attachPatternMatched(this._onObjectMatched, this);

        this.setModel(oViewModel, "detailView");

        this.getOwnerComponent()
          .getModel()
          .metadataLoaded()
          .then(this._onMetadataLoaded.bind(this));
      },

      SegmentTitleFormatter: function (sFlightId, sDirection) {
        if (sFlightId === null || sFlightId === undefined) {
          return null;
        }

        // return outbound flight details
        var sPath = this.getView().getBindingContext().getPath();
        // get the segment object
        var oFlightSegment = this.getModel().getProperty(sPath);

        if (sDirection === Constants.FlightSegmentType.ARRIVAL) {
          if (!sFlightId) {
            return "No Inbound Flight";
          }

          // {Precarriercode}{Preflightno} {Predepairp}-{Prearrairp}
          return (
            oFlightSegment.Precarriercode +
            oFlightSegment.Preflightno +
            " " +
            oFlightSegment.Predepairp +
            "-" +
            oFlightSegment.Prearrairp
          );
        } else if (sDirection === Constants.FlightSegmentType.DEPARTURE) {
          if (!sFlightId) {
            return "No Outbound Flight";
          }

          return (
            oFlightSegment.Precarriercode +
            oFlightSegment.Flightno +
            " " +
            oFlightSegment.Prearrairp +
            "-" +
            oFlightSegment.Arrairp
          );
        }
      },

      onLobSelected: function (oEvent) {
        var listItem = oEvent.getSource();
        var oItemContext = listItem.getBindingContext();
        var oLobContext = listItem.getBindingContext("lobs");
        this._showLob(oLobContext, oItemContext);
      },

      /* =========================================================== */
      /* event handlers                                              */
      /* =========================================================== */

      /**
       * Event handler when the share by E-Mail button has been clicked
       * @public
       */
      onSendEmailPress: function () {
        var oViewModel = this.getModel("detailView");

        URLHelper.triggerEmail(
          null,
          oViewModel.getProperty("/shareSendEmailSubject"),
          oViewModel.getProperty("/shareSendEmailMessage")
        );
      },

      /**
       * Updates the item count within the line item table's header
       * @param {object} oEvent an event containing the total number of items in the list
       * @private
       */
      onListUpdateFinished: function (oEvent) {
        var sTitle,
          iTotalItems = oEvent.getParameter("total"),
          oViewModel = this.getModel("detailView");

        // only update the counter if the length is final
        if (this.byId("lineItemsList").getBinding("items").isLengthFinal()) {
          if (iTotalItems) {
            sTitle = this.getResourceBundle().getText(
              "detailLineItemTableHeadingCount",
              [iTotalItems]
            );
          } else {
            //Display 'Line Items' instead of 'Line items (0)'
            sTitle = this.getResourceBundle().getText(
              "detailLineItemTableHeading"
            );
          }
          oViewModel.setProperty("/lineItemListTitle", sTitle);
        }
      },

      /* =========================================================== */
      /* begin: internal methods                                     */
      /* =========================================================== */

      /**
       * Binds the view to the object path and expands the aggregated line items.
       * @function
       * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
       * @private
       */
      _onObjectMatched: function (oEvent) {
        var sObjectId = oEvent.getParameter("arguments").arrFlightNo || "";
        var sFlightNo = oEvent.getParameter("arguments").depFlightNo || "";

        this.getModel("appView").setProperty(
          "/layout",
          "TwoColumnsMidExpanded"
        );
        this.getModel()
          .metadataLoaded()
          .then(
            function () {
              var sObjectPath = this.getModel().createKey(
                "FlightSegmentHeaderSet",
                {
                  Preaufnr: sObjectId,
                  Aufnr: sFlightNo,
                }
              );

              this._bindView("/" + sObjectPath);
              this._handleLobsActiveStatus("/" + sObjectPath);
            }.bind(this)
          );
      },

      /**
       * Binds the view to the object path. Makes sure that detail view displays
       * a busy indicator while data for the corresponding element binding is loaded.
       * @function
       * @param {string} sObjectPath path to the object to be bound to the view.
       * @private
       */
      _bindView: function (sObjectPath) {
        // Set busy indicator during view binding
        var oViewModel = this.getModel("detailView");

        // If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
        oViewModel.setProperty("/busy", false);

        this.getView().bindElement({
          path: sObjectPath,
          events: {
            change: this._onBindingChange.bind(this),
            dataRequested: function () {
              oViewModel.setProperty("/busy", true);
            },
            dataReceived: function () {
              oViewModel.setProperty("/busy", false);
            },
          },
        });
      },

      _handleLobsActiveStatus: function (sObjectPath) {
        var oDataModel = this.getModel();
        var oLobsModel = this.getModel("lobs");

        // get the current presented item from the
        // odata model
        var oItem = oDataModel.getProperty(sObjectPath);

        if (!oItem) {
          return;
        }

        // modify lobs statuses based on the item status values
        oLobsModel.getData().forEach(function (oLob) {
          switch (oLob.type) {
            case "AC":
              oLob.active =
                oItem.NxtAirpLight !== "PEND" && oItem.NxtLegState !== "PEND";
              break;
            case "CC":
              oLob.active =
                oItem.NxtCrgoLight !== "PEND" && oItem.NxtLegState !== "PEND";
              break;
            case "ES":
              oLob.active =
                oItem.NxtEngrLight !== "PEND" && oItem.NxtLegState !== "PEND";
              break;
            default:
              oLob.active = false;
              break;
          }
        });
      },

      beforeOpenIntStatusPopover: function (oEvent) {
        var oOpenBy = oEvent.getParameter("openBy");
        var sDirection = oOpenBy.data("direction");
        var sBindingPath = oOpenBy.getBindingContext().getPath();

        this._mapInterfaceStatuses(sBindingPath, sDirection);
      },

      afterCloseIntStatusPopover: function (oEvent) {
        this._oInteracesPopOver.destroy();
        this._oInteracesPopOver = null;
      },

      onNavigateToArrivalTrip: function (oEvent) {
        // return outbound flight details
        var sPath = this.getView().getBindingContext().getPath();
        // get the segment object
        var oFlightItem = this.getModel().getProperty(sPath);

        var params = {
          CarrierCode: '', //oFlightItem.Precarriercode,
          FlightNo: '', // oFlightItem.Preflightno,
          Origin: '', //oFlightItem.Predepairp,
          Destination: '', //oFlightItem.Prearrairp,
          SchDate: '1900-01-01',//oFlightItem.Predepdate,
          surrogatenum: oFlightItem.Preaufnr,
        };

        this.onNavigateToTrip(params);
      },

      onNavigateToDepartureTrip: function (oEvent) {
        // return outbound flight details
        var sPath = this.getView().getBindingContext().getPath();
        // get the segment object
        var oFlightItem = this.getModel().getProperty(sPath);

        var params = {
          CarrierCode: '', //oFlightItem.Carriercode,
          FlightNo: '', //oFlightItem.Flightno,
          Origin: '', //oFlightItem.Prearrairp,
          Destination: '', //oFlightItem.Arrairp,
          SchDate: '1900-01-01', //oFlightItem.Depdate,
          surrogatenum: oFlightItem.Aufnr,
        };

        this.onNavigateToTrip(params);

      },

      onNavigateToTrip: function (params) {
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

      _mapInterfaceStatuses: function (sObjectPath, sDirection) {
        // extract the current flight segment from model
        var oFlightSegment = this.getModel().getProperty(sObjectPath);

        // Build the interface status model based on the
        // data we have in the flight segment for the specific direction

        var oInterfaceStatusModel = new JSONModel([
          {
            name: "Passanger",
            status:
              sDirection === Constants.FlightSegmentType.ARRIVAL
                ? oFlightSegment.PrePssLight
                : oFlightSegment.PssLight,
          },
          {
            name: "Cargo",
            status:
              sDirection === Constants.FlightSegmentType.ARRIVAL
                ? oFlightSegment.PreCargoLight
                : oFlightSegment.CargoLight,
          },
          {
            name: "Overfly",
            status:
              sDirection === Constants.FlightSegmentType.ARRIVAL
                ? oFlightSegment.PreCfpLight
                : oFlightSegment.CfpLight,
          },
        ]);

        this._oInteracesPopOver.setModel(
          oInterfaceStatusModel,
          "interfaceStatus"
        );
      },

      _showLob: function (oLob, oItem) {
        // var bReplace = !Device.system.phone;
        // set the layout property of FCL control to show two columns
        // this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
        // route to Lob screen
        // make sure we do not replace to hash
        // in order to go back to this screen

        var sLobType = oLob.getProperty("type");
        var oRouter = this.getRouter();

        // TODO: use contsants
        if (sLobType === "AC") {
          oRouter.navTo("AirportCharges", {
            arrFlightNo: oItem.getProperty("Preaufnr"),
            depFlightNo: oItem.getProperty("Aufnr"),
          });
        } else if (sLobType === "CC") {
          oRouter.navTo("CargoCharges", {
            arrFlightNo: oItem.getProperty("Preaufnr"),
            depFlightNo: oItem.getProperty("Aufnr"),
          });
        } else if (sLobType === "ES") {
          oRouter.navTo("EngServices", {
            arrFlightNo: oItem.getProperty("Preaufnr"),
            depFlightNo: oItem.getProperty("Aufnr"),
          });
        } else if (sLobType === "ON") {
          oRouter.navTo("OverflightServices", {
            arrFlightNo: oItem.getProperty("Preaufnr"),
            depFlightNo: oItem.getProperty("Aufnr"),
          });
        } else if (sLobType === "CT") {
          oRouter.navTo("Catering", {
            arrFlightNo: oItem.getProperty("Preaufnr"),
            depFlightNo: oItem.getProperty("Aufnr"),
          });
        }
      },

      _onBindingChange: function () {
        var oView = this.getView(),
          oElementBinding = oView.getElementBinding();

        // No data for the binding
        if (!oElementBinding.getBoundContext()) {
          this.getRouter().getTargets().display("detailObjectNotFound");
          // if object could not be found, the selection in the master list
          // does not make sense anymore.
          this.getOwnerComponent().oListSelector.clearMasterListSelection();
          return;
        }

        var sPath = oElementBinding.getPath(),
          oResourceBundle = this.getResourceBundle(),
          oObject = oView.getModel().getObject(sPath),
          sObjectId = oObject.Aufnr,
          sObjectName = oObject.Arrairp,
          oViewModel = this.getModel("detailView");

        this.getOwnerComponent().oListSelector.selectAListItem(sPath);

        oViewModel.setProperty(
          "/shareSendEmailSubject",
          oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId])
        );
        oViewModel.setProperty(
          "/shareSendEmailMessage",
          oResourceBundle.getText("shareSendEmailObjectMessage", [
            sObjectName,
            sObjectId,
            location.href,
          ])
        );
      },

      _onMetadataLoaded: function () {
        // Store original busy indicator delay for the detail view
        var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
          oViewModel = this.getModel("detailView");
        // oLineItemTable = this.byId("lineItemsList");
        // iOriginalLineItemTableBusyDelay = oLineItemTable.getBusyIndicatorDelay();

        // Make sure busy indicator is displayed immediately when
        // detail view is displayed for the first time
        oViewModel.setProperty("/delay", 0);
        oViewModel.setProperty("/lineItemTableDelay", 0);

        // oLineItemTable.attachEventOnce("updateFinished", function () {
        // 	// Restore original busy indicator delay for line item table
        // 	oViewModel.setProperty("/lineItemTableDelay", iOriginalLineItemTableBusyDelay);
        // });

        // Binding the view will set it to not busy - so the view is always busy if it is not bound
        oViewModel.setProperty("/busy", true);
        // Restore original busy indicator delay for the detail view
        oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
      },

      onNavBack: function () {
        this.getRouter().navTo("master", {}, true);
      },

      onOverallStatusPressed: function (oEvent) {
        if (this._oInteracesPopOver && this._oInteracesPopOver.isOpen()) {
          this._oInteracesPopOver.close();
          return;
        }

        this._createOverallStatusesPopover();
        // delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
        var oSource = oEvent.getSource();
        jQuery.sap.delayedCall(0, this, function () {
          this._oInteracesPopOver.openBy(oSource);
        });
      },

      _createOverallStatusesPopover: function () {
        if (!this._oInteracesPopOver) {
          this._oInteracesPopOver = sap.ui.xmlfragment(
            "fas.fragments.InterfacesStatus",
            this
          );
        }

        this.getView().addDependent(this._oInteracesPopOver);
      },

      /**
       * Set the full screen mode to false and navigate to master page
       */
      onCloseDetailPress: function () {
        this.getModel("appView").setProperty(
          "/actionButtonsInfo/midColumn/fullScreen",
          false
        );
        // No item should be selected on master after detail page is closed
        this.getOwnerComponent().oListSelector.clearMasterListSelection();
        this.onNavBack();
        // this.getRouter().navTo("master");
      },

      /**
       * Toggle between full and non full screen mode.
       */
      toggleFullScreen: function () {
        var bFullScreen = this.getModel("appView").getProperty(
          "/actionButtonsInfo/midColumn/fullScreen"
        );
        this.getModel("appView").setProperty(
          "/actionButtonsInfo/midColumn/fullScreen",
          !bFullScreen
        );
        if (!bFullScreen) {
          // store current layout and go full screen
          this.getModel("appView").setProperty(
            "/previousLayout",
            this.getModel("appView").getProperty("/layout")
          );
          this.getModel("appView").setProperty(
            "/layout",
            "MidColumnFullScreen"
          );
        } else {
          // reset to previous layout
          this.getModel("appView").setProperty(
            "/layout",
            this.getModel("appView").getProperty("/previousLayout")
          );
        }
      },
    });
  }
);
