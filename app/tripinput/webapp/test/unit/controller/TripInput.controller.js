/*global QUnit*/

sap.ui.define([
	"tripinput/controller/TripInput.controller"
], function (Controller) {
	"use strict";

	QUnit.module("TripInput Controller");

	QUnit.test("I should test the TripInput controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
