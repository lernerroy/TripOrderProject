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
                    var records = JSON.parse(event.target.result);
                    self._uploadRecords(records);
                };
            },
            _uploadRecords: function (records) {
                var self = this;
                this.getModel("uploadView").setProperty("/uploading", true);

                var sRecordType = this.getModel("uploadView").getProperty("/uploadTypeIndex");
                var entitySet = "";

                if (sRecordType === 0) {
                    entitySet = "/triprecord";
                } else if (sRecordType === 1) {
                    entitySet = "/pax";
                } else if (sRecordType === 2) {
                    entitySet = "/cargorecord";
                }

                var oDataListBinding = this.getModel().bindList(
                    entitySet,
                    null,
                    null,
                    null,
                    {}
                );

                var oRecord = this._toLowerKeys(records[0]);
                oRecord.surrogatenum = `${oRecord.surrogatenum}`;
                oRecord.inflightno = `${oRecord.inflightno}`;
                oRecord.flightno = `${oRecord.flightno}`;
                oRecord.repeatno = `${oRecord.repeatno}`;
                oRecord.aircrafttype = `${oRecord.aircrafttype}`;
                oRecord.delayreason1 = `${oRecord.delayreason1}`;
                oRecord.delayreason2 = `${oRecord.delayreason2}`;
                oRecord.delayreason3 = `${oRecord.delayreason3}`;
                oRecord.delayreason4 = `${oRecord.delayreason4}`;
                oRecord.dep_terminal = `${oRecord.dep_terminal}`;


                oDataListBinding.create(oRecord, false, false, false);

                oDataListBinding.attachCreateCompleted(function (oEvent) {
                    this.getModel("uploadView").setProperty("/uploading", false);
                }, this);
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
            }
        });
    }
);
