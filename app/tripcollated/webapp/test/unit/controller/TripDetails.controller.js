/*global QUnit*/

sap.ui.define([
	"tripcollated/controller/TripDetails.controller"
], function (Controller) {
	"use strict";

	QUnit.module("TripDetails Controller");

	QUnit.test("I should test the TripDetails controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
