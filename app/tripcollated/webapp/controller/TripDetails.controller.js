sap.ui.define(
  ["sap/ui/core/mvc/Controller"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller) {
    "use strict";

    return Controller.extend("tripcollated.controller.TripDetails", {
     
      onInit: function () {
        var sCarrierNo = window.location.hash
          .split("?")[1]
          .split("&")[0]
          .split("=")[1];
        var sDestination = window.location.hash
          .split("?")[1]
          .split("&")[1]
          .split("=")[1];

        var sFlightNo = window.location.hash
          .split("?")[1]
          .split("&")[2]
          .split("=")[1];
        var sOrigin = window.location.hash
          .split("?")[1]
          .split("&")[3]
          .split("=")[1];
        var sSchDate = window.location.hash
          .split("?")[1]
          .split("&")[4]
          .split("=")[1];
        var ssurrogatenum = window.location.hash
          .split("?")[1]
          .split("&")[5]
          .split("=")[1];
        var key =
          "(insupcarriercode2='" +
          sCarrierNo +
          "',inflightno='" +
          sFlightNo +
          "',inorigin='" +
          sOrigin +
          "',indestination='" +
          sDestination +
          "',surrogatenum='" +
          ssurrogatenum +
          "',inscheddeptdate=" +
          sSchDate +
          ")";

        // var urlTripRecord =
        //   "https://" +
        //   window.location.hostname +
        //   "/triporder-ui.tripdetails/~280921160122+0000~/browse/triprecord" +
        //   key;
        var urlTripRecord = "/triporder-ui.tripdetails/browse/triprecord" + key;
        var that = this;
        

         $.get({
           url: urlTripRecord,
           success: function (data) { 
             if (data===undefined)
              { sap.m.MessageBox.error("No Flight Data found for the given Record") 
             } else {
             console.log(data);
             var oModel = new sap.ui.model.json.JSONModel();
             oModel.setData(data);
             that.getView().setModel(oModel, "trip1");
            }
           } ,
           error: function (error) {
             console.log(error);
             sap.m.MessageBox.error("No Flight Data found for the given Record")
             // your error logic
           },
         });
        var urlTripRecord =
          "/triporder-ui.tripdetails/browse/accommodation" + key;
        var that = this;
        $.get({
          url: urlTripRecord,
          success: function (data) {
            console.log(data);
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(data);
            that.getView().setModel(oModel, "accommodation");
            
          },
          error: function (error) {
            console.log(error);
            // your error logic
          },
        });
        var urlTripRecord = "/triporder-ui.tripdetails/browse/pax" + key;
        var that = this;
        $.get({
          url: urlTripRecord,
          success: function (data) {
            console.log(data);
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(data);
            that.getView().setModel(oModel, "pax");
            
          },
          error: function (error) {
            console.log(error);
            // your error logic
          },
        });
        var urlTripRecord =
          "/triporder-ui.tripdetails/browse/cargorecord" + key;
        var that = this;
        $.get({
          url: urlTripRecord,
          success: function (data) {
            console.log(data);
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(data);
            that.getView().setModel(oModel, "cargorecord");
            
          },
          error: function (error) {
            console.log(error);
            // your error logic
          },
        });
        var urlTripRecord = "/triporder-ui.tripdetails/browse/routeplan" + key;
        var that = this;
        $.get({
          url: urlTripRecord,
          success: function (data) {
            console.log(data);
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(data);
            that.getView().setModel(oModel, "routeplan");
            
          },
          error: function (error) {
            console.log(error);
            // your error logic
          },
        });
      },
    });
  }
);
