/*global QUnit*/

sap.ui.define([
	"fas/controller/fas.controller"
], function (Controller) {
	"use strict";

	QUnit.module("fas Controller");

	QUnit.test("I should test the fas controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
