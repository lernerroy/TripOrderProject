sap.ui.define([
    "sap/ui/core/ValueState"
], function (ValueState) {
    "use strict";

    return {
        getStatusState: function() {
            return {
                51: ValueState.Error,
                52: ValueState.Warning,
                53: ValueState.Success,
                64: ValueState.None
            };
        },
        getStatuses: function (resourceBundle) {
            return [
                {
                    code: 51,
                    codeText: "Error",
                    text: resourceBundle.getText('StatusError')
                },
                {
                    code: 52,
                    codeText: "Warning",
                    text: resourceBundle.getText("StatusWarning")
                },
                {
                    code: 53,
                    codeText: "Processed",
                    text: resourceBundle.getText("StatusProcessed")
                },
                {
                    code: 64,
                    codeText: "ReadyForProcessing",
                    text: resourceBundle.getText("StatusReadyForProcessing")
                }

            ];
        },
        getLogTypes: function (resourceBundle) {

            return {
                "1": resourceBundle.getText("TripLogType"),
                "2": resourceBundle.getText("PassengerLogType"),
                "3": resourceBundle.getText("CargoLogType"),
                "4": resourceBundle.getText("RoutePlanLogType"),
                "5": resourceBundle.getText("CateringLogType")
            };
        }
    }
});