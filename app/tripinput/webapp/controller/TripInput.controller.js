sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, JSONModel, FilterOperator, Filter) {
    "use strict";

    return Controller.extend("tripinput.controller.tripinput", {
      onInit: function () {
        var oModel = new JSONModel();
        this.getView().setModel(oModel, "ViewModel");
        this.getView().getModel("ViewModel").setProperty("/filters", {
          insupcarriercode2: "",
          inflightno: "",
          inorigin: "",
          indestination: "",
          inscheddeptdate: "",
        });
        this.getTripDetails();
        var oDataModel = this.getOwnerComponent().getModel();
        this.getView().setModel(oDataModel);
      },
      onSearch: function () {
          var oFilters = this.getView().getModel("ViewModel").getProperty("/filters");
          //if(!(oFilters.inscheddeptdate === "")) {
          //var aDate = oFilters.inscheddeptdate.split("/");
          //oFilters.inscheddeptdate = "20" + aDate[2] + "-" + aDate[1] + "-" + aDate[0]; 
       // }
        this._oGlobalFilter = new Filter(
          [
            new Filter("insupcarriercode2", FilterOperator.Contains, oFilters.insupcarriercode2),
            new Filter("inflightno", FilterOperator.Contains, oFilters.inflightno),
            new Filter("inorigin", FilterOperator.Contains, oFilters.inorigin),
            new Filter("indestination", FilterOperator.Contains, oFilters.indestination),
            new Filter("inscheddeptdate", FilterOperator.EQ, oFilters.inscheddeptdate),
          ],
          false
        );
        var oFilter = new Filter([this._oGlobalFilter], true);
        this.getView()
          .byId("sTableId")
          .getBinding("items")
          .filter(this._oGlobalFilter.aFilters, "Application");
      },
      getTripDetails: function () {
        var that = this;
        var urlTripRecord =
          "https://" +
          window.location.hostname +
          "/triporder-ui.tripdetails/browse/triprecord";
        var that = this;
        $.get({
          url: urlTripRecord,
          success: function (data) {
            // var oModel = new sap.ui.model.json.JSONModel( );
            //oModel.setData(data);
            that
              .getView()
              .getModel("ViewModel")
              .setProperty("/tabledata", data.value);
            that.getView().getModel("ViewModel").refresh(true);
          },
          error: function (error) {
            console.log(error);
            // your error logic
          },
        });
      },
      onPress: function () {
        this.addTableData();
      },
      onTableRowSelect: function (evt) {
        // var bValid = this.validateMandatoryFields();
        // this.addTableData();
        var oSelectedObject = evt
          .getSource()
          .getBindingContext("ViewModel")
          .getObject();

        var bValid = true;
        if (bValid) {
          //   var sCarrierCode = this.getView()
          //     .byId("insupcarriercode2")
          //     .getValue();
          var sFlightNo = oSelectedObject.inflightno;
          var sOrigin = oSelectedObject.inorigin;
          var sDestination = oSelectedObject.indestination;
          var sSchDate = oSelectedObject.inscheddeptdate;
          var sCarrierCode = oSelectedObject.insupcarriercode2;
          var sSurrogatenum = oSelectedObject.surrogatenum;
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
                params: {
                  CarrierCode: sCarrierCode,
                  FlightNo: sFlightNo,
                  Origin: sOrigin,
                  Destination: sDestination,
                  SchDate: sSchDate,
                  surrogatenum: sSurrogatenum,
                },
              })) ||
            "";

          console.log(href);
          xnaservice.toExternal({
            target: {
              shellHash: href,
            },
          });
        } else {
          MessageBox.warning("Please enter all the mandatory fields");
        }
      },
      addTableData: function () {
        var sCarrierCode = this.getView().byId("insupcarriercode2").getValue();
        var sFlightNo = this.getView().byId("inflightno").getValue();
        var sOrigin = this.getView().byId("inorigin").getValue();
        var sDestination = this.getView().byId("indestination").getValue();
        var sSchDate = this.getView().byId("inscheddeptdate").getDateValue();
        var sSurrogatenum = this.getView().byId("surrogatenum").getValue();
        var aTableData = this.getView()
          .getModel("ViewModel")
          .getProperty("/TableData");
        var oTableData = {
          CarrierCode: sCarrierCode,
          FlightNo: sFlightNo,
          Origin: sOrigin,
          Destination: sDestination,
          SchDepDate: sSchDate,
          surrogatenum: sSurrogatenum,
        };
        aTableData.push(oTableData);
        this.getView()
          .getModel("ViewModel")
          .setProperty("/TableData", oTableData);
        this.getView().getModel("ViewModel").refresh(true);
        //  var bValid = true;
        //   if(sCarrierCode === "" || sCarrierCode === undefined){
        //   bValid = false;
        // } else if(sFlightNo === "" || sFlightNo === undefined){
        //bValid = false;
        //} else if(sOrigin === "" || sOrigin === undefined){
        //bValid = false;
        //} else if(sDestination === "" || sDestination === undefined){
        //bValid = false;
        //} else if(sSchDate === "" || sSchDate === undefined || sSchDate === null){
        //bValid = false;
        //  }
        //return bValid;
      },
    });
  }
);

// import { measureMemory } from "vm";

// sap.ui.define([
//     "sap/ui/core/mvc/Controller",
//     "sap/m/MessageBox"
// ],
// 	/**
// 	 * @param {typeof sap.ui.core.mvc.Controller} Controller
// 	 */
// 	function (Controller, MessageBox) {
// 		"use strict";

// 		return Controller.extend("tripinput.controller.TripInput", {
// 			onInit: function () {

// 			},
//             onPress: function (evt) {
//                  var bValid = this.validateMandatoryFields();
//                  if(bValid){
//                      var xnaservice = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService && sa.ushell.Container.getService("CrossApplicationNavigation");
//                     var href = (xnaservice && xnaservice.hrefForExternal({
//                         target : {
//                             semanticObject: "TripCollated",
//                             action: "display"
//                         }
//                     })) || "";
//                     xnaservice.toExternal({
//                         target: {
//                             shellHash : href
//                         }
//                     });

//                     }else{
//                     MessageBox.warning("Please enter all the mandatory fields");
//                     }

//             },
//                 validateMandatoryFields: function(){
//                   var sCarrierCode = this.getView().byId("insupcarriercode2").getValue();
//                   var sFlightNo= this.getView().byId("inflightno").getValue();
//                   var sOrigin = this.getView().byId("inorigin").getValue();
//                   var sDestination = this.getView().byId("indestination").getValue();
//                   var sSchDate = this.getView().byId("inscheddeptdate ").getValue();
//                   var bValid = true;
//                  if(sCarrierCode === "" || sCarrierCode === undefined){
//                    bValid = false;
//                    } else if(sFlightNo === "" || sFlightNo === undefined){
//                     bValid = false;
//                     } else if(sOrigin === "" || sOrigin === undefined){
//                     bValid = false;
//                      } else if(sDestination === "" || sDestination === undefined){
//                      bValid = false;
//                     } else if(sSchDate === "" || sSchDate === undefined || sSchDate === null){
//                bValid = false;
//      }
//      return bValid;
//  }

// 	});
// });

// // sap.ui.define([
// // 	"sap/ui/core/mvc/Controller"
// // ],
// // 	/**
// // 	 * @param {typeof sap.ui.core.mvc.Controller} Controller
// // 	 */
// // 	function (Controller) {
// // 		"use strict";

// // 		return Controller.extend("tripinput.controller.TripInput", {
// // 			onInit: function () {

// //             }

// //             // onPress: function (evt) {
// //             //     var bValid = this.validateMandatoryFields();

// //             // }

// //             // validateMandatoryFields: function(){
// //             //     var sCarrierCode = this.getView().byId("insupcarriercode2").getValue();
// //             //     var sFlightNo= this.getView().byId("inflightno").getValue();
// //             //     var sOrigin = this.getView().byId("inorigin").getValue();
// //             //     var sDestination = this.getView().byId("indestination").getValue();
// //             //     var sSchDate = this.getView().byId("inscheddeptdate ").getValue();
// //             //     var bValid = true;
// //             //     if(sCarrierCode === "" || sCarrierCode === undefined){
// //             //         bValid = false;
// //             //     } else if(sFlightNo === "" || sFlightNo === undefined){
// //             //         bValid = false;
// //             //     } else if(sOrigin === "" || sOrigin === undefined){
// //             //         bValid = false;
// //             //     } else if(sDestination === "" || sDestination === undefined){
// //             //         bValid = false;
// //             //     } else if(sSchDate === "" || sSchDate === undefined || sSchDate === null){
// //             //         bValid = false;
// //             //     }
// //             //     return bValid;
// //             // }
// //         });
// //     });
