/*global QUnit*/

sap.ui.define([
	"comlegstate./route_plan/controller/route_plan.controller"
], function (Controller) {
	"use strict";

	QUnit.module("route_plan Controller");

	QUnit.test("I should test the route_plan controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
