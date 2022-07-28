sap.ui.define([
    "sap/ui/core/ValueState"
], function (ValueState) {
    "use strict";

    return {
        Status: {
            READY_FOR_PROCESSING: 64,
            BEING_PROCESSED: 50,
            ERROR: 51,
            WARNING: 52,
            PROCESSED: 53
        },
        LogType: {
            TRIP: 1,
            PASSENGER: 2,
            CARGO: 3
        },
        getStatusState: function() {
            return {
                50: ValueState.Information,
                51: ValueState.Error,
                52: ValueState.Warning,
                53: ValueState.Success,
                64: ValueState.None
            };
        },
        getStatuses: function (resourceBundle) {
            return [
                {
                    code: 50,
                    codeText: "BeingProcessed",
                    text: resourceBundle.getText('StatusBeingProcessed')
                },
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
        getStatusDescs: function(resourceBundle) {
            return [
                {
                    code: 1,
                    bundleRef: "ErrorACExistence"
                },
                {
                    code: 2,
                    bundleRef: "ErrorManualProcess"
                },
                {
                    code: 3,
                    bundleRef: "ErrorMissingTailNo"
                },
                {
                    code: 4,
                    bundleRef: "ErrorRepeatNo"
                },
                {
                    code: 5,
                    bundleRef: "ErrorFlightStatusHirarchy"
                },
                {
                    code: 6,
                    bundleRef: "ErrorDBExecution"
                },
                {
                    code: 7,
                    bundleRef: "ErrorLegstate"
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