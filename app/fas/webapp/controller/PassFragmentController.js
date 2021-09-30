sap.ui.define([
	"sap/ui/core/mvc/Controller",
], function (Controller) {
	"use strict";

	return Controller.extend("fas.controller.PassFragmentController", {
		constructor: function(oController) {
			this._oController = oController;
			return Controller.call(this);
		},
		onInit: function()  {
		},
		
		bind: function(sPath){
			debugger;
		}

	});

});
