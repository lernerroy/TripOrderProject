sap.ui.define(
  ["./BaseController", "sap/ui/model/json/JSONModel", "../model/formatter"],
  function (BaseController, JSONModel, formatter) {
    "use strict";

    return BaseController.extend("UpdUtility.uploadutility.controller.Upload", {
      formatter: formatter,

      /* =========================================================== */
      /* lifecycle methods                                           */
      /* =========================================================== */

      /**
       * Called when the worklist controller is instantiated.
       * @public
       */
      onInit: function () {
        // Model used to manipulate control states
        var oViewModel = new JSONModel({
          uploadTypeIndex: -1,
          selectedFile: "",
          uploading: false,
        });
        this.setModel(oViewModel, "uploadView");
      },
      onUpload: function () {
        if (!this.oSelectedFile) {
          return;
        }

        // use file reader to read the file contetn
        var reader = new FileReader();
        reader.readAsText(this.oSelectedFile, "UTF-8");

        var self = this;

        reader.onload = function (event) {
          var records = self._csvToJSON(event.target.result);
          self._uploadRecords(records);
        };
      },
      _uploadRecords: function (records) {
        // this.getModel("uploadView").setProperty("/uploading", true);

        var oDataListBinding = this.getModel().bindList(
          "/triprecord",
          null,
          null,
          null,
          {}
        );

        var oRecord = this._toLowerKeys(records[0]);
        oRecord.actgatetime = parseInt(oRecord.actgatetime);
        oRecord.actualflyingdur = parseInt(oRecord.actualflyingdur);
        oRecord.estdeptdateutc = "2021-10-14";
        oRecord.estarrdate = "2021-10-14";
        oRecord.planblocktime = parseInt(oRecord.planblocktime);
        oRecord.flight_tm = parseInt(oRecord.flight_tm);
        oRecord.onblockdate = "2021-10-14";
        oRecord.onblocktime = "10:30:00";
        oRecord.offblockdate = "2021-10-14";
        oRecord.taxi_out_time = parseInt(oRecord.taxi_out_time);

        oDataListBinding.create(oRecord, false, false, false);
      },
      _toLowerKeys: function (obj) {
        return Object.keys(obj).reduce((accumulator, key) => {
          accumulator[key.toLowerCase()] = obj[key];
          return accumulator;
        }, {});
      },
      onFileChange: function (oEvent) {
        // read the selected file
        var oFile = oEvent.getParameter("files")[0];

        if (!oFile) {
          return;
        }

        this.oSelectedFile = oFile;
      },
      _csvToJSON: function (csv, delimiter = ",", stringify = false) {
        var lines = csv.split("\n");

        var result = [];

        var headers = lines[0].split(delimiter);

        for (var i = 1; i < lines.length; i++) {
          var obj = {};
          var currentline = lines[i].split(delimiter);

          for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
          }

          result.push(obj);
        }

        return stringify ? JSON.stringify(result) : result;
      },
    });
  }
);
