const cds = require("@sap/cds");
class TripService extends cds.ApplicationService {
    async init() {
        const { triprecord, triprecordStaging, pax, paxStaging, cargorecord, cargorecordStaging,
            routeplan, routeplanStaging, catering, cateringStaging, triplog, triplogAll,
            TailRegistrations, Legstates/*, LegstatesFinal*/ } = this.entities;
        const tripLogType = '1', paxLogType = '2', cargoLogType = '3', routeLogType = '4',
            cateringLogType = '5';
        const statusBeingProcessed = 50, statusError = 51, statusWarning = 52, statusProcessed = 53,
            statusReady = 64;
        const manualMessage = 'manualProcessMessage', resetMessage = 'resetMessage';
        const legstateCNL = 'CNL', legstateDefault = 'X-XXX';
        const tripWhereComps = {};
        const db = await cds.connect.to("db");
        this.on("CREATE", triprecord, async (req) => {
            let tripData = req.data;
            tripData.staging_creation_timestamp = Date.now();
            const triplogdata = {};
            triplogdata.surrogatenum = req.data.surrogatenum;
            triplogdata.insupcarriercode2 = req.data.insupcarriercode2;
            triplogdata.inflightno = req.data.inflightno;
            triplogdata.inorigin = req.data.inorigin;
            triplogdata.indestination = req.data.indestination;
            triplogdata.inscheddeptdate = req.data.inscheddeptdate;
            triplogdata.fosuffix = req.data.fosuffix;
            triplogdata.status = statusReady;
            triplogdata.staging_creation_timestamp = tripData.staging_creation_timestamp;
            triplogdata.logtype = tripLogType;
            // triplogdata.statusCode = 1;
            // triplogdata.statusParam1 = "UECCC";
            // TODO: infinite loop
            await db.run(INSERT([tripData]).into(triprecordStaging));
            await db.run(INSERT([triplogdata]).into(triplogAll));
            return req.reply(tripData);
        });
        this.on("CREATE", pax, async (req) => {
            let paxData = req.data;
            paxData.staging_creation_timestamp = Date.now();
            const paxlogdata = {};
            paxlogdata.surrogatenum = req.data.surrogatenum;
            paxlogdata.insupcarriercode2 = req.data.insupcarriercode2;
            paxlogdata.inflightno = req.data.inflightno;
            paxlogdata.inorigin = req.data.inorigin;
            paxlogdata.indestination = req.data.indestination;
            paxlogdata.inscheddeptdate = req.data.inscheddeptdate;
            paxlogdata.fosuffix = req.data.fosuffix;
            paxlogdata.status = statusReady;
            paxlogdata.staging_creation_timestamp = paxData.staging_creation_timestamp;
            paxlogdata.logtype = paxLogType;
            // TODO: infinite loop
            await db.run(INSERT([paxData]).into(paxStaging));
            await db.run(INSERT([paxlogdata]).into(triplogAll));
            return req.reply(paxData);
        });
        this.on("CREATE", cargorecord, async (req) => {
            let cargoData = req.data;
            cargoData.staging_creation_timestamp = Date.now();
            const cargologdata = {};
            cargologdata.surrogatenum = req.data.surrogatenum;
            cargologdata.insupcarriercode2 = req.data.insupcarriercode2;
            cargologdata.inflightno = req.data.inflightno;
            cargologdata.inorigin = req.data.inorigin;
            cargologdata.indestination = req.data.indestination;
            cargologdata.inscheddeptdate = req.data.inscheddeptdate;
            cargologdata.fosuffix = req.data.fosuffix;
            cargologdata.status = statusReady;
            cargologdata.staging_creation_timestamp = cargoData.staging_creation_timestamp;
            cargologdata.logtype = cargoLogType;
            // TODO: infinite loop
            await db.run(INSERT([cargoData]).into(cargorecordStaging));
            await db.run(INSERT([cargologdata]).into(triplogAll));
            return req.reply(cargoData);
        });
        this.on("CREATE", routeplan, async (req) => {
            let routeData = req.data;
            routeData.staging_creation_timestamp = Date.now();
            const routelogdata = {};
            routelogdata.surrogatenum = req.data.surrogatenum;
            routelogdata.insupcarriercode2 = req.data.insupcarriercode2;
            routelogdata.inflightno = req.data.inflightno;
            routelogdata.inorigin = req.data.inorigin;
            routelogdata.indestination = req.data.indestination;
            routelogdata.inscheddeptdate = req.data.inscheddeptdate;
            routelogdata.fosuffix = req.data.fosuffix;
            routelogdata.lineno = req.data.lineno;
            routelogdata.cfpno = req.data.cfpno;
            routelogdata.status = statusReady;
            routelogdata.staging_creation_timestamp = routeData.staging_creation_timestamp;
            routelogdata.logtype = routeLogType;
            // TODO: infinite loop
            await db.run(INSERT([routeData]).into(routeplanStaging));
            await db.run(INSERT([routelogdata]).into(triplogAll));
            return req.reply(routeData);
        });
        this.on("CREATE", catering, async (req) => {
            let cateringData = req.data;
            cateringData.staging_creation_timestamp = Date.now();
            const cateringlogdata = {};
            cateringlogdata.surrogatenum = req.data.surrogatenum;
            cateringlogdata.insupcarriercode2 = req.data.insupcarriercode2;
            cateringlogdata.inflightno = req.data.inflightno;
            cateringlogdata.inorigin = req.data.inorigin;
            cateringlogdata.indestination = req.data.indestination;
            cateringlogdata.inscheddeptdate = req.data.inscheddeptdate;
            cateringlogdata.fosuffix = req.data.fosuffix;
            cateringlogdata.status = statusReady;
            cateringlogdata.staging_creation_timestamp = cateringData.staging_creation_timestamp;
            cateringlogdata.logtype = cateringLogType;
            // TODO: infinite loop
            await db.run(INSERT([cateringData]).into(cateringStaging));
            await db.run(INSERT([cateringlogdata]).into(triplogAll));
            return req.reply(cateringData);
        });
        this.on("processMessage", async (req) => {
            const isSuccess = await this.pushTripsToActualEntity(
                req.data.trips, "processMessage"
            );
            if (!isSuccess) throw req.reject(500, "Message Processing Failed");

            // else if(isSuccess == "no Rows") throw req.reject(500, 'No Rows were processed');
        });
        this.on("processMessagesIn", async (req) => {
            const status = req.data.status;
            const triplogInput = await SELECT.from(triplog).where('status =', status);
            const triplogOutput = await this.pushTripsToActualEntity(
                triplogInput, "processMessageIn"
            );
            if (triplogOutput === false) {
                throw req.reject(500, "Message Processing Failed");
            } else {
                req.reply(triplogOutput);
            }
        });
        this.on("resetMessage", async (req) => {
            const isSuccess = await this.changeStatuses(
                req.data.trips, statusReady, resetMessage
            );
            if (!isSuccess) throw req.reject(500, "Message Processing Failed");
        });
        this.on("manualProcessMessage", async (req) => {
            const isSuccess = await this.changeStatuses(
                req.data.trips, statusProcessed, manualMessage
            );
            if (!isSuccess) throw req.reject(500, "Message Processing Failed");
        });
        /**
         * This code section is to debug unexpected errors
         */
        // this.on ('error', (err, req) => {
        //     if(true)
        //         throw req.reject(500, `error: ${err}`);
        //     // // modify the message
        //     // err.message = 'Oh no! ' + err.message
        //     // // attach some custom data
        //     // err['@myCustomProperty'] = 'Hello, World!'
        //   });
        this.pushTripsToActualEntity = async (trips, caller) => {
            let whereTripString = "";
            let wherePaxString = "";
            let whereCargoString = "";
            let whereRouteString = "";
            let whereCateringString = "";

            trips.forEach((trip) => {
                switch (trip.logtype) {
                    default:
                    case tripLogType:
                        whereTripString = this.buildWhereString(trip, whereTripString, tripLogType, false);
                        break;
                    case paxLogType:
                        wherePaxString = this.buildWhereString(trip, wherePaxString, paxLogType, false);
                        break;
                    case cargoLogType:
                        whereCargoString = this.buildWhereString(trip, whereCargoString, cargoLogType, false);
                        break;
                    case routeLogType:
                        whereRouteString = this.buildWhereString(trip, whereRouteString, routeLogType, false);
                        break;
                    case cateringLogType:
                        whereCateringString = this.buildWhereString(trip, whereCateringString, cateringLogType, false);
                        break;
                }
            });

            // Update selected trips
            if (whereTripString) {
                const tripsStaged = await SELECT.from(triprecordStaging).where(
                    cds.parse.expr(whereTripString)
                ).orderBy("staging_creation_timestamp asc");

                if (tripsStaged) {
                    for (let trip of tripsStaged) {
                        trips = await this.updateTrip(trips, trip, tripLogType);
                        if(!trips) return false;
                    };
                }
            }

            // Update selected passangers
            if (wherePaxString) {
                const paxStaged = await SELECT.from(paxStaging).where(
                    cds.parse.expr(wherePaxString)
                ).orderBy("staging_creation_timestamp asc");

                if (paxStaged) {
                    for (let trip of paxStaged) {
                        trips = await this.updateTrip(trips, trip, paxLogType);
                        if(!trips) return false;
                    };
                }
            }

            // Update selected cargo
            if (whereCargoString) {
                const cargoStaged = await SELECT.from(cargorecordStaging).where(
                    cds.parse.expr(whereCargoString)
                ).orderBy("staging_creation_timestamp asc");

                if (cargoStaged) {
                    for (let trip of cargoStaged) {
                        trips = await this.updateTrip(trips, trip, cargoLogType);
                        if(!trips) return false;
                    };
                }
            }

            // Update selected route
            if (whereRouteString) {
                const routePlanStaged = await SELECT.from(routeplanStaging).where(
                    cds.parse.expr(whereRouteString)
                ).orderBy("staging_creation_timestamp asc");

                if (routePlanStaged) {
                    for (let trip of routePlanStaged) {
                        trips = await this.updateTrip(trips, trip, routeLogType);
                        if(!trips) return false;
                    };
                }
            }

            // Update selected catering
            if (whereCateringString) {
                const cateringStaged = await SELECT.from(cateringStaging).where(
                    cds.parse.expr(whereCateringString)
                ).orderBy("staging_creation_timestamp asc");

                if (cateringStaged) {
                    for (let trip of cateringStaged) {
                        trips = await this.updateTrip(trips, trip, cateringLogType);
                        if(!trips) return false;
                    };
                }
            }

            if (caller === "processMessage") {
                return true;
            } else {
                return trips;
            }
        };

        /**
         * Called to build the where condition for a specific trip
         */
        this.buildWhereString = (trip, whereString, logType, isLogTable) => {
            let whereComponent = this.buildWhereComponent(trip, logType, isLogTable);
            if (whereString === "") {
                whereString = whereComponent;
            } else {
                whereString = `${whereString} or ${whereComponent}`;
            }
            return whereString;
        };

        /**
         * Called to build a single trip where clause depending on log type
         */
        this.buildWhereComponent = (trip, logType, isLogTable) => {
            let whereComponent = "";
            tripWhereComps['surrogatenum'] = trip.surrogatenum;
            if (
                tripWhereComps['surrogatenum'] !== null &&
                tripWhereComps['surrogatenum'] !== undefined
            ) {
                tripWhereComps['surrogatenum'] = "'" + trip.surrogatenum + "'";
            }
            tripWhereComps['insupcarriercode2'] = trip.insupcarriercode2;
            if (
                tripWhereComps['insupcarriercode2'] !== null &&
                tripWhereComps['insupcarriercode2'] !== undefined
            ) {
                tripWhereComps['insupcarriercode2'] = "'" + trip.insupcarriercode2 + "'";
            }
            tripWhereComps['inflightno'] = trip.inflightno;
            if (tripWhereComps['inflightno'] !== null && tripWhereComps['inflightno'] !== undefined) {
                tripWhereComps['inflightno'] = "'" + trip.inflightno + "'";
            }
            tripWhereComps['inorigin'] = trip.inorigin;
            if (tripWhereComps['inorigin'] !== null && tripWhereComps['inorigin'] !== undefined) {
                tripWhereComps['inorigin'] = "'" + trip.inorigin + "'";
            }
            tripWhereComps['indestination'] = trip.indestination;
            if (
                tripWhereComps['indestination'] !== null &&
                tripWhereComps['indestination'] !== undefined
            ) {
                tripWhereComps['indestination'] = "'" + trip.indestination + "'";
            }
            tripWhereComps['inscheddeptdate'] = trip.inscheddeptdate;
            if (
                tripWhereComps['inscheddeptdate'] !== null &&
                tripWhereComps['inscheddeptdate'] !== undefined
            ) {
                tripWhereComps['inscheddeptdate'] = "'" + trip.inscheddeptdate + "'";
            }
            tripWhereComps['sct'] = trip.staging_creation_timestamp;
            if (
                tripWhereComps['sct'] !== null &&
                tripWhereComps['sct'] !== undefined
            ) {
                tripWhereComps['sct'] = "'" + trip.staging_creation_timestamp + "'";
            }

            if (isLogTable) {
                whereComponent = `(surrogatenum = ${tripWhereComps['surrogatenum']} and insupcarriercode2 = ` +
                    `${tripWhereComps['insupcarriercode2']} and inflightno = ${tripWhereComps['inflightno']}` +
                    ` and inorigin = ${tripWhereComps['inorigin']} and indestination = ` +
                    `${tripWhereComps[`indestination`]} and inscheddeptdate = ${tripWhereComps['inscheddeptdate']}` +
                    ` and staging_creation_timestamp = ${tripWhereComps['sct']} and logtype = ${logType} )`; //and status_timestamp = ${status_timestamp}
            } else {
                if (logType !== routeLogType) {
                    whereComponent = `(surrogatenum = ${tripWhereComps['surrogatenum']} and insupcarriercode2 = ` +
                        `${tripWhereComps['insupcarriercode2']} and inflightno = ${tripWhereComps['inflightno']} and inorigin = ` +
                        `${tripWhereComps['inorigin']} and indestination = ${tripWhereComps['indestination']} and inscheddeptdate = ` +
                        `${tripWhereComps['inscheddeptdate']} and staging_creation_timestamp = ${tripWhereComps['sct']} )`;
                } else {
                    tripWhereComps['lineno'] = trip.lineno;
                    if (
                        tripWhereComps['lineno'] !== null &&
                        tripWhereComps['lineno'] !== undefined
                    ) {
                        tripWhereComps['lineno'] = "'" + trip.lineno + "'";
                    }
                    tripWhereComps['cfpno'] = trip.cfpno;
                    if (
                        tripWhereComps['cfpno'] !== null &&
                        tripWhereComps['cfpno'] !== undefined
                    ) {
                        tripWhereComps['cfpno'] = "'" + trip.cfpno + "'";
                    }

                    whereComponent = `(surrogatenum = ${tripWhereComps['surrogatenum']} and insupcarriercode2 = ` +
                        `${tripWhereComps['insupcarriercode2']} and inflightno = ${tripWhereComps['inflightno']} and inorigin = ` +
                        `${tripWhereComps['inorigin']} and indestination = ${tripWhereComps['indestination']} and inscheddeptdate = ` +
                        `${tripWhereComps['inscheddeptdate']} and staging_creation_timestamp = ${tripWhereComps['sct']} and` +
                        ` lineno = ${tripWhereComps['lineno']} and cfpno = ${tripWhereComps['cfpno']} )`;
                }
            }
            return whereComponent;
        };

        this.updateTrip = async (trips, trip, logType) => {
            let whereTripLog = "";
            let newStatus = statusBeingProcessed;
            let rowUpdated = false;
            let statusUpdated = false;
            whereTripLog = this.buildWhereString(trip, whereTripLog, logType, true);
            const tripLogRow = await SELECT.one.from(triplog).where(
                cds.parse.expr(whereTripLog)
            );

            if (tripLogRow && (parseInt(tripLogRow.status) === statusError ||
                parseInt(tripLogRow.status) === statusReady ||
                parseInt(tripLogRow.status) === statusWarning)) {
                statusUpdated = await this.insertTriplogStatus(trip, logType, newStatus);
                if(!statusUpdated) return false;

                const triplogMatchingIndex = trips.findIndex((triplog) => {
                    return (
                        triplog.insupcarriercode2 === trip.insupcarriercode2 &&
                        triplog.inflightno === trip.inflightno &&
                        triplog.inorigin === trip.inorigin &&
                        triplog.indestination === trip.indestination &&
                        triplog.inscheddeptdate === trip.inscheddeptdate &&
                        triplog.surrogatenum === trip.surrogatenum &&
                        triplog.staging_creation_timestamp === trip.staging_creation_timestamp &&
                        triplog.logtype === logType
                    );
                });

                let tailNo = await this.validateTail(trip, logType);

                if (!tailNo) {
                    newStatus = trips[triplogMatchingIndex].status = statusError;
                    trip.statusCode = 3;
                    trip.statusParam1 = trip.tailno;
                    statusUpdated = await this.insertTriplogStatus(trip, logType, newStatus);
                    if(!statusUpdated) return false;
                    return trips;
                }
                
                let legstate = await this.validateLegstate(trip, logType);

                if (!legstate) {
                    newStatus = trips[triplogMatchingIndex].status = statusError;
                    trip.statusCode = 7;
                    trip.statusParam1 = trip.legstate_code;
                    statusUpdated = await this.insertTriplogStatus(trip, logType, newStatus);
                    if(!statusUpdated) return false;
                    return trips;
                }
                
                let repeatno = await this.validateRepeatNo(trip, logType);

                if (repeatno.length) {
                    newStatus = trips[triplogMatchingIndex].status = statusWarning;
                    trip.statusCode = 4;
                    trip.statusParam1 = repeatno[0];
                    trip.statusParam2 = repeatno[1];
                    statusUpdated = await this.insertTriplogStatus(trip, logType, newStatus);
                    if(!statusUpdated) return false;
                    return trips;
                }
                
                let stonr = await this.validateStonr(trip, logType);

                if (stonr.length) {
                    newStatus = trips[triplogMatchingIndex].status = statusWarning;
                    trip.statusCode = 5;
                    trip.statusParam1 = stonr[0];
                    trip.statusParam2 = stonr[1];
                    statusUpdated = await this.insertTriplogStatus(trip, logType, newStatus);
                    if(!statusUpdated) return false;
                    return trips;
                }

                if (trip.legstate_code === "ARR" && !trip.actarrdate) {
                    newStatus = trips[triplogMatchingIndex].status = statusError;
                } else {
                    // delete trip.creation_timestamp;
                    delete trip.modifiedAt;
                    delete trip.modifiedBy;
                    newStatus = trips[triplogMatchingIndex].status = statusProcessed;
                }

                switch (logType) {
                    default:
                    case tripLogType:
                        rowUpdated = await this.updateTripRecord(trip, newStatus);
                        break;
                    case paxLogType:
                        rowUpdated = await this.updatePaxRecord(trip, newStatus);
                        break;
                    case cargoLogType:
                        rowUpdated = await this.updateCargoRecord(trip, newStatus);
                        break;
                    case routeLogType:
                        rowUpdated = await this.updateRouteRecord(trip, newStatus);
                        break;
                    case cateringLogType:
                        rowUpdated = await this.updateCateringRecord(trip, newStatus);
                        break;
                }

                if (rowUpdated !== newStatus) {
                    newStatus = trips[triplogMatchingIndex].status = rowUpdated;
                }
                statusUpdated = await this.insertTriplogStatus(trip, logType, newStatus);
                if(!statusUpdated) return false;
            }

            return trips;
        };

        this.validateRepeatNo = async (trip, logType) => {
            let result = [];
            // Only do the validation in case the row is a trip
            if (logType !== tripLogType)
                return result;

            // Build the tripRecord selection
            let whereString = `(surrogatenum = ${tripWhereComps['surrogatenum']} and insupcarriercode2 = ` +
                `${tripWhereComps['insupcarriercode2']} and inflightno = ${tripWhereComps['inflightno']} and inorigin = ` +
                `${tripWhereComps['inorigin']} and indestination = ${tripWhereComps['indestination']} and inscheddeptdate = ` +
                `${tripWhereComps['inscheddeptdate']} )`;

            let repeatno = await SELECT.one.from(triprecord).columns('repeatno').where(
                cds.parse.expr(whereString)
            );

            if (repeatno && repeatno.repeatno > trip.repeatno) {
                result.push(repeatno.repeatno);
                result.push(trip.repeatno);
            }

            return result;
        };

        this.validateStonr = async (trip, logType) => {
            let result = [];
            // Only do the validation in case the row is a trip
            if (logType !== tripLogType)
                return result;

            // Build the tripRecord selection
            let whereString = `(surrogatenum = ${tripWhereComps['surrogatenum']} and insupcarriercode2 = ` +
                `${tripWhereComps['insupcarriercode2']} and inflightno = ${tripWhereComps['inflightno']} and inorigin = ` +
                `${tripWhereComps['inorigin']} and indestination = ${tripWhereComps['indestination']} and inscheddeptdate = ` +
                `${tripWhereComps['inscheddeptdate']} )`;

            let legstate = await SELECT.one.from(triprecord).columns('legstate_code').where(
                cds.parse.expr(whereString)
            );

            if (!legstate)
                return result;

            // Build the legstates where
            tripWhereComps['old_ls_code'] = "'" + trip.legstate_code + "'";
            tripWhereComps['new_ls_code'] = "'" + legstate.legstate_code + "'";
            whereString = `(code = ${tripWhereComps['old_ls_code']} or code = ${tripWhereComps['new_ls_code']})`;

            let legstates = await SELECT.from(Legstates).columns('code', 'stonr').where(cds.parse.expr(whereString));

            // Get the stonr values of the legstates
            let old_ls_stonr = 0;
            let new_ls_stonr = 0;
            for (let ls of legstates) {
                if (ls.code === legstate.legstate_code)
                    old_ls_stonr = parseInt(ls.stonr);
                if (ls.code === trip.legstate_code)
                    new_ls_stonr = parseInt(ls.stonr);
            }

            // In case the new legstate stonr is smaller than the old one
            if (old_ls_stonr && new_ls_stonr && new_ls_stonr < old_ls_stonr) {
                result.push(tripWhereComps['old_ls_code']);
                result.push(tripWhereComps['new_ls_code']);
            }

            return result;
        };

        this.validateTail = async (trip, logType) => {
            // Only do the tail number validations in case the row is a trip
            if (logType !== tripLogType)
                return true;

            // Build where clause and get the tail number
            let tempTailNo = trip.tailno;
            let resTailNo = '';
            let hasTail = false;
            let maxStonr = '';
            if (
                tempTailNo !== null &&
                tempTailNo !== undefined
            ) {
                for (let char of tempTailNo) {
                    if (char !== '-')
                        resTailNo = resTailNo + char + '%';
                }
                resTailNo = "'" + resTailNo + "'";
            }
            if (resTailNo !== "''")
                hasTail = true;
            let whereTailNo = `( tailNo like ${resTailNo} )`;

            let tailNo = await SELECT.one.from(TailRegistrations).columns('tailNo').where(
                cds.parse.expr(whereTailNo)
            );

            // In case the legstate doesn't exist in the latest legstates, 
            // check if the literal value of tailNo exists in TailRegistrations
            let legstatesL = await SELECT.from(Legstates).orderBy('stonr desc');
            if(legstatesL){
                maxStonr = legstatesL[0].stonr;
            }

            let filteredLS = legstatesL.filter(ls => ls.stonr === maxStonr);

            let legstateFound = false;
            for (let ls of filteredLS) {
                if (trip.legstate_code === ls.code) {
                    legstateFound = true;
                    break;
                }
            }

            if (!legstateFound && hasTail) {
                resTailNo = "'" + trip.tailno + "'";
                whereTailNo = `( tailNo = ${resTailNo} )`;
                tailNo = undefined;
                tailNo = await SELECT.one.from(TailRegistrations).columns('tailNo').where(
                    cds.parse.expr(whereTailNo)
                );
            }

            if (trip.legstate_code === legstateCNL) {
                if (hasTail) {
                    resTailNo = "'" + trip.tailno + "'";
                    whereTailNo = `( tailNo = ${resTailNo} )`;
                    tailNo = undefined;
                    tailNo = await SELECT.one.from(TailRegistrations).columns('tailNo').where(
                        cds.parse.expr(whereTailNo)
                    );
                }

                // In case no row was found, check if the tail number exists in the triprecord
                if (!tailNo) {
                    // Build the tripRecord selection
                    let whereString = `(surrogatenum = ${tripWhereComps['surrogatenum']} and insupcarriercode2 = ` +
                        `${tripWhereComps['insupcarriercode2']} and inflightno = ${tripWhereComps['inflightno']} and inorigin = ` +
                        `${tripWhereComps['inorigin']} and indestination = ${tripWhereComps['indestination']} and inscheddeptdate = ` +
                        `${tripWhereComps['inscheddeptdate']} )`;

                    tailNo = await SELECT.one.from(triprecord).columns('tailno').where(
                        cds.parse.expr(whereString)
                    );

                    // Check if the triprecord tail number exists in the tailregistrations table
                    if (tailNo) {
                        resTailNo = "'" + tailNo.tailno + "'";
                        whereTailNo = `( tailNo = ${resTailNo} )`;
                        tailNo = undefined;
                        tailNo = await SELECT.one.from(TailRegistrations).columns('tailNo').where(
                            cds.parse.expr(whereTailNo)
                        );
                    }

                    if (!tailNo) {
                        trip.tailno = tailNo = legstateDefault;
                    }
                }
            }

            if (tailNo) {
                if (trip.tailno !== tailNo)
                    trip.tailno = tailNo.tailNo;
            } else {
                trip.tailno = '';
            }

            return tailNo;
        };

        this.validateLegstate = async (trip, logType) => {
            // Only do the tail number validations in case the row is a trip
            if (logType !== tripLogType)
                return true;

            // Build where clause and get the tail number
            let tempLsCode = trip.legstate_code;
            let resLsCode = '';
            if (
                tempLsCode !== null &&
                tempLsCode !== undefined
            ) {
                resLsCode = "'" + tempLsCode + "'";
            }

            let whereLsCode = `( code = ${resLsCode} )`;
            let lsCode = await SELECT.one.from(Legstates).columns('code').where(
                cds.parse.expr(whereLsCode)
            );
            
            return lsCode;  
        };

        /**
         * Update in Trip Log DB the trip status according to the log type 
         */
        this.insertTriplogStatus = async (trip, logType, status) => {
            let tx = cds.tx();
            let newTrip = trip;
            newTrip.logtype = logType;
            newTrip.status = status;
            newTrip.status_timestamp = Date.now();
            try {
                const updRes = await tx.run(INSERT([newTrip]).into(triplogAll));
                await tx.commit();
                if (updRes) return true;
            } catch (e) {
                await tx.rollback();
                console.error("Error during insert:", e);
            }

            return false;
            // const updRes = await db.run(
            //     UPDATE(
            //         triplog, {
            //         insupcarriercode2: trip.insupcarriercode2,
            //         inflightno: trip.inflightno,
            //         inorigin: trip.inorigin,
            //         indestination: trip.indestination,
            //         inscheddeptdate: trip.inscheddeptdate,
            //         surrogatenum: trip.surrogatenum,
            //         creation_timestamp: trip.creation_timestamp,
            //         logtype: logType
            //     }
            //     ).with({
            //         status: status,
            //         statusCode: trip.statusCode,
            //         statusParam1: trip.statusParam1,
            //         statusParam2: trip.statusParam2,
            //         statusParam3: trip.statusParam3,
            //         statusParam4: trip.statusParam4
            //     })
            // );
        };

        /**
         * Update trip record according to the trip, and if it doesn't exist, insert the row
         * returns true if a row was updated/inserted, false otherwise
         * TODO: fix upsert so it'll work with scale
         */
        this.updateTripRecord = async (trip, newStatus) => {
            let txUpd = cds.tx();
            let txIns = cds.tx();
            let res = statusError, updFin = false;
            trip.actdeptts = this._calcTimeStamp(trip.actdeptdate, trip.actdepttime);
            trip.scheddeptts = this._calcTimeStamp(trip.scheddeptdate, trip.scheddepttime);
            trip.actarrts = this._calcTimeStamp(trip.actarrdate, trip.actarrtime);
            trip.schedarrts = this._calcTimeStamp(trip.schedarrdate, trip.schedarrtime);

            try {
                let updRes = await txUpd.run(UPDATE(triprecord,
                    {
                        insupcarriercode2: trip.insupcarriercode2,
                        inflightno: trip.inflightno,
                        inorigin: trip.inorigin,
                        indestination: trip.indestination,
                        inscheddeptdate: trip.inscheddeptdate,
                        surrogatenum: trip.surrogatenum
                    }).with({
                        supcarriercode2: trip.supcarriercode2,
                        scheddeptdate: trip.scheddeptdate,
                        flightno: trip.flightno,
                        supcarriercode: trip.supcarriercode,
                        carriercode: trip.carriercode,
                        origin: trip.origin,
                        destination: trip.destination,
                        repeatno: trip.repeatno,
                        idooutc: trip.idooutc,
                        idoo: trip.idoo,
                        doo: trip.doo,
                        dooutc: trip.dooutc,
                        actarrapt: trip.actarrapt,
                        actarrapticao: trip.actarrapticao,
                        actdeptapt: trip.actdeptapt,
                        actdeptapticao: trip.actdeptapticao,
                        legstate_code: trip.legstate_code,
                        aircrafttype: trip.aircrafttype,
                        aircrafttypecpa: trip.aircrafttypecpa,
                        tailno: trip.tailno,
                        flighttype: trip.flighttype,
                        deptparkposn: trip.deptparkposn,
                        actgatetime: trip.actgatetime,
                        servicetype: trip.servicetype,
                        delayreason1: trip.delayreason1,
                        delayreason2: trip.delayreason2,
                        delayreason3: trip.delayreason3,
                        delayreason4: trip.delayreason4,
                        delayreason5: trip.delayreason5,
                        actualflyingdur: trip.actualflyingdur,
                        scheddepttime: trip.scheddepttime,
                        scheddeptts: trip.scheddeptts,
                        actdeptts: trip.actdeptts,
                        takeoffdate: trip.takeoffdate,
                        takeofftime: trip.takeofftime,
                        touchdndate: trip.touchdndate,
                        touchdntime: trip.touchdntime,
                        actdeptdate: trip.actdeptdate,
                        actdepttime: trip.actdepttime,
                        actarrdate: trip.actarrdate,
                        actarrtime: trip.actarrtime,
                        takeoffdateutc: trip.takeoffdateutc,
                        takeofftimeutc: trip.takeofftimeutc,
                        touchdndateutc: trip.touchdndateutc,
                        touchdntimeutc: trip.touchdntimeutc,
                        actdeptdateutc: trip.actdeptdateutc,
                        actdepttimeutc: trip.actdepttimeutc,
                        actarrdateutc: trip.actarrdateutc,
                        actarrtimeutc: trip.actarrtimeutc,
                        scheddeptdateutc: trip.scheddeptdateutc,
                        scheddepttimeutc: trip.scheddepttimeutc,
                        schedarrdateutc: trip.schedarrdateutc,
                        schedarrtimeutc: trip.schedarrtimeutc,
                        schedarrdate: trip.schedarrdate,
                        schedarrtime: trip.schedarrtime,
                        schedarrts: trip.schedarrts,
                        actarrts: trip.actarrts,
                        estdeptdate: trip.estdeptdate,
                        estdepttime: trip.estdepttime,
                        estdeptdateutc: trip.estdeptdateutc,
                        estdepttimeutc: trip.estdepttimeutc,
                        estarrdateutc: trip.estarrdateutc,
                        estarrtimeutc: trip.estarrtimeutc,
                        estarrdate: trip.estarrdate,
                        estarrtime: trip.estarrtime,
                        planblocktime: trip.planblocktime,
                        schedarrapticao: trip.schedarrapticao,
                        schedarrapt: trip.schedarrapt,
                        scheddeptapticao: trip.scheddeptapticao,
                        scheddeptapt: trip.scheddeptapt,
                        flight_tm: trip.flight_tm,
                        arr_stand: trip.arr_stand,
                        dep_terminal: trip.dep_terminal,
                        arr_terminal: trip.arr_terminal,
                        onblockdate: trip.onblockdate,
                        onblocktime: trip.onblocktime,
                        offblockdate: trip.offblockdate,
                        offblocktime: trip.offblocktime,
                        taxi_out_time: trip.taxi_out_time,
                        route: trip.route,
                        cfpno1: trip.cfpno1,
                        cfpno2: trip.cfpno2
                    }));
                await txUpd.commit();
                updFin = true;

                if (!updRes) {
                    updRes = await txIns.run(INSERT.into(triprecord, trip));
                }
                await txIns.commit();

                if (updRes)
                    res = newStatus;
            } catch (e) {
                if (!updFin)
                    await txUpd.rollback();
                await txIns.rollback();
                console.error(`Error in ${e.element}`);
                trip.statusCode = 6;
                trip.statusParam1 = e.element;
            }

            return res;
        };

        /**
         * Update passenger record according to the trip, and if it doesn't exist, insert the row
         * returns true if a row was updated/inserted, false otherwise
         * TODO: fix upsert so it'll work with scale
         */
        this.updatePaxRecord = async (trip, newStatus) => {
            let txUpd = cds.tx();
            let txIns = cds.tx();
            let res = statusError, updFin = false;

            try {
                let updRes = await txUpd.run(UPDATE(pax,
                    {
                        insupcarriercode2: trip.insupcarriercode2,
                        inflightno: trip.inflightno,
                        inorigin: trip.inorigin,
                        indestination: trip.indestination,
                        inscheddeptdate: trip.inscheddeptdate,
                        surrogatenum: trip.surrogatenum
                    }).with({
                        carriercode: trip.carriercode,
                        version: trip.version,
                        user_ind: trip.user_ind,
                        firstclasspax: trip.firstclasspax,
                        busclasspax: trip.busclasspax,
                        premecopax: trip.premecopax,
                        ecopax: trip.ecopax,
                        totalpax: trip.totalpax,
                        revpaxfirst: trip.revpaxfirst,
                        revpaxbus: trip.revpaxbus,
                        revpaxpreco: trip.revpaxpreco,
                        revpaxeco: trip.revpaxeco,
                        revpaxtot: trip.revpaxtot,
                        nrevpaxfirst: trip.nrevpaxfirst,
                        nrevpaxbus: trip.nrevpaxbus,
                        nrevpaxpreco: trip.nrevpaxpreco,
                        nrevpaxeco: trip.nrevpaxeco,
                        nrevpaxtot: trip.nrevpaxtot,
                        chdpax: trip.chdpax,
                        infpax: trip.infpax,
                        wchpax: trip.wchpax,
                        wchc: trip.wchc,
                        wchs: trip.wchs,
                        wchr: trip.wchr,
                        wcbd: trip.wcbd,
                        wcbw: trip.wcbw,
                        wcmp: trip.wcmp,
                        wcob: trip.wcob,
                        wclb: trip.wclb,
                        boardpax: trip.boardpax,
                        transitpax: trip.transitpax,
                        transferpax: trip.transferpax,
                        bagquan: trip.bagquan,
                        bagweight: trip.bagweight,
                        traint: trip.traint,
                        tradom: trip.tradom,
                        creation_timestamp: trip.creation_timestamp,
                        tecnum: trip.tecnum,
                        cabnum: trip.cabnum,
                        capnum: trip.capnum,
                        cocnum: trip.cocnum,
                        ecavml: trip.ecavml,
                        ecbbml: trip.ecbbml,
                        ecblml: trip.ecblml,
                        ecchml: trip.ecchml,
                        ecdbml: trip.ecdbml,
                        ecfpml: trip.ecfpml,
                        ecgfml: trip.ecgfml,
                        echnml: trip.echnml,
                        ecksml: trip.ecksml,
                        eclcml: trip.eclcml,
                        eclfml: trip.eclfml,
                        eclsml: trip.eclsml,
                        ecmoml: trip.ecmoml,
                        ecnlml: trip.ecnlml,
                        ecorml: trip.ecorml,
                        ecrvml: trip.ecrvml,
                        ecsfml: trip.ecsfml,
                        ecvgml: trip.ecvgml,
                        ecvjml: trip.ecvjml,
                        ecvlml: trip.ecvlml,
                        ecvoml: trip.ecvoml,
                        bcavml: trip.bcavml,
                        bcbbml: trip.bcbbml,
                        bcblml: trip.bcblml,
                        bcchml: trip.bcchml,
                        bcdbml: trip.bcdbml,
                        bcfpml: trip.bcfpml,
                        bcgfml: trip.bcgfml,
                        bchnml: trip.bchnml,
                        bcksml: trip.bcksml,
                        bclcml: trip.bclcml,
                        bclfml: trip.bclfml,
                        bclsml: trip.bclsml,
                        bcmoml: trip.bcmoml,
                        bcnlml: trip.bcnlml,
                        bcorml: trip.bcorml,
                        bcrvml: trip.bcrvml,
                        bcsfml: trip.bcsfml,
                        bcvgml: trip.bcvgml,
                        bcvjml: trip.bcvjml,
                        bcvlml: trip.bcvlml,
                        bcvoml: trip.bcvoml,
                        umnr: trip.umnr
                    }));

                await txUpd.commit();
                updFin = true;

                if (!updRes) {
                    updRes = await txIns.run(INSERT.into(pax, trip));
                }
                await txIns.commit();

                if (updRes)
                    res = newStatus;
            } catch (e) {
                if (!updFin)
                    await txUpd.rollback();
                await txIns.rollback();
                console.error(`Error in ${e.element}`);
                trip.statusCode = 6;
                trip.statusParam1 = e.element;
            }

            return res;
        }

        /**
         * Update cargo record according to the trip, and if it doesn't exist, insert the row
         * returns true if a row was updated/inserted, false otherwise
         * TODO: fix upsert so it'll work with scale
         */
        this.updateCargoRecord = async (trip, newStatus) => {
            let txUpd = cds.tx();
            let txIns = cds.tx();
            let res = statusError, updFin = false;

            try {
                let updRes = await txUpd.run(UPDATE(cargorecord,
                    {
                        insupcarriercode2: trip.insupcarriercode2,
                        inflightno: trip.inflightno,
                        inorigin: trip.inorigin,
                        indestination: trip.indestination,
                        inscheddeptdate: trip.inscheddeptdate,
                        surrogatenum: trip.surrogatenum
                    }).with({
                        version: trip.version,
                        user_ind: trip.user_ind,
                        chgtottonn: trip.chgtottonn,
                        acttottonn: trip.acttottonn,
                        tottranstonn: trip.tottranstonn,
                        chgtotimptonn: trip.chgtotimptonn,
                        acttotimptonn: trip.acttotimptonn,
                        chgtotexptonn: trip.chgtotexptonn,
                        acttotexptonn: trip.acttotexptonn,
                        chgimploose: trip.chgimploose,
                        actimploose: trip.actimploose,
                        chgimpprepck: trip.chgimpprepck,
                        actimpprepck: trip.actimpprepck,
                        chgexploose: trip.chgexploose,
                        actexploose: trip.actexploose,
                        chgexpprepack: trip.chgexpprepack,
                        actexpprepack: trip.actexpprepack,
                        chgmailimport: trip.chgmailimport,
                        actmailimport: trip.actmailimport,
                        chgmailexport: trip.chgmailexport,
                        actmailexport: trip.actmailexport,
                        avichgtkg: trip.avichgtkg,
                        aviactkg: trip.aviactkg,
                        avinoawb: trip.avinoawb,
                        dgrchgtkg: trip.dgrchgtkg,
                        dgractkg: trip.dgractkg,
                        dgrnoawb: trip.dgrnoawb,
                        humchgkg: trip.humchgkg,
                        humactkg: trip.humactkg,
                        humnoawb: trip.humnoawb,
                        perchgkg: trip.perchgkg,
                        peractkg: trip.peractkg,
                        pernoawb: trip.pernoawb,
                        valchgkg: trip.valchgkg,
                        valactkg: trip.valactkg,
                        valnoawb: trip.valnoawb,
                        pilchgkg: trip.pilchgkg,
                        pilactkg: trip.pilactkg,
                        pilnoawb: trip.pilnoawb,
                        pefchgkg: trip.pefchgkg,
                        pefactkg: trip.pefactkg,
                        pefnoawb: trip.pefnoawb,
                        temchgkg: trip.temchgkg,
                        temactkg: trip.temactkg,
                        temnoawb: trip.temnoawb,
                        vunchgkg: trip.vunchgkg,
                        vunactkg: trip.vunactkg,
                        vunnoawb: trip.vunnoawb,
                        totawb: trip.totawb,
                        chgtransloose: trip.chgtransloose,
                        acttransloose: trip.acttransloose,
                        chgtransprepack: trip.chgtransprepack,
                        acttransprepack: trip.acttransprepack,
                        chgephloose: trip.chgephloose,
                        actephloose: trip.actephloose,
                        chgephprepack: trip.chgephprepack,
                        actephprepack: trip.actephprepack,
                        chgepdcgo: trip.chgepdcgo,
                        actepdcgo: trip.actepdcgo,
                        creation_timestamp: trip.creation_timestamp,
                        chgimptonn: trip.chgimptonn,
                        chgexptonn: trip.chgexptonn,
                        chgtottranstonn: trip.chgtottranstonn
                    }));

                await txUpd.commit();
                updFin = true;

                if (!updRes) {
                    updRes = await txIns.run(INSERT.into(cargorecord, trip));
                }
                await txIns.commit();

                if (updRes)
                    res = newStatus;
            } catch (e) {
                if (!updFin)
                    await txUpd.rollback();
                await txIns.rollback();
                console.error(`Error in ${e.element}`);
                trip.statusCode = 6;
                trip.statusParam1 = e.element;
            }

            return res;
        }

        /**
         * Update route record according to the trip, and if it doesn't exist, insert the row
         * returns true if a row was updated/inserted, false otherwise
         * TODO: fix upsert so it'll work with scale
         */
        this.updateRouteRecord = async (trip, newStatus) => {
            let txUpd = cds.tx();
            let txIns = cds.tx();
            let res = statusError, updFin = false;

            try {
                let updRes = await txUpd.run(UPDATE(routeplan,
                    {
                        insupcarriercode2: trip.insupcarriercode2,
                        inflightno: trip.inflightno,
                        inorigin: trip.inorigin,
                        indestination: trip.indestination,
                        inscheddeptdate: trip.inscheddeptdate,
                        surrogatenum: trip.surrogatenum,
                        lineno: trip.lineno,
                        cfpno: trip.cfpno
                    }).with({
                        routeno: trip.routeno,
                        countrycode: trip.countrycode,
                        airspdistnm: trip.airspdistnm,
                        airspdistm: trip.airspdistm,
                        airspdistkm: trip.airspdistkm,
                        elapsedtime: trip.elapsedtime,
                        deptapticao: trip.deptapticao,
                        arrapticao: trip.arrapticao,
                        tailno: trip.tailno,
                        entrydatelmt: trip.entrydatelmt,
                        entrytimelmt: trip.entrytimelmt,
                        entrydateutc: trip.entrydateutc,
                        entrytimeutc: trip.entrytimeutc,
                        exitdatelmt: trip.exitdatelmt,
                        exittimelmt: trip.exittimelmt,
                        exitdateutc: trip.exitdateutc,
                        exittimeutc: trip.exittimeutc,
                        amount: trip.amount,
                        rate: trip.rate,
                        currency: trip.currency,
                        entrypoint: trip.entrypoint,
                        exitpoint: trip.exitpoint,
                        entryway: trip.entryway,
                        exitway: trip.exitway,
                        chargetype: trip.chargetype,
                        provid: trip.provid,
                        gcd: trip.gcd
                    }));

                await txUpd.commit();
                updFin = true;

                if (!updRes) {
                    updRes = await txIns.run(INSERT.into(routeplan, trip));
                }
                await txIns.commit();

                if (updRes)
                    res = newStatus;
            } catch (e) {
                if (!updFin)
                    await txUpd.rollback();
                await txIns.rollback();
                console.error(`Error in ${e.element}`);
                trip.statusCode = 6;
                trip.statusParam1 = e.element;
            }

            return res;
        }

        /**
         * Update catering record according to the trip, and if it doesn't exist, insert the row
         * returns true if a row was updated/inserted, false otherwise
         * TODO: fix upsert so it'll work with scale
         */
        this.updateCateringRecord = async (trip, newStatus) => {
            let txUpd = cds.tx();
            let txIns = cds.tx();
            let res = statusError, updFin = false;

            try {
                let updRes = await db.run(UPDATE(catering,
                    {
                        insupcarriercode2: trip.insupcarriercode2,
                        inflightno: trip.inflightno,
                        inorigin: trip.inorigin,
                        indestination: trip.indestination,
                        inscheddeptdate: trip.inscheddeptdate,
                        surrogatenum: trip.surrogatenum
                    }).with({
                        carriercode: trip.carriercode,
                        origin: trip.origin,
                        destination: trip.destination,
                        classtype: trip.classtype,
                        sapmeal: trip.sapmeal,
                        exdescription: trip.exdescription,
                        paxqun: trip.paxqun,
                        unitofmesur: trip.unitofmesur,
                        exmenucode: trip.exmenucode,
                        exmenudesc: trip.exmenudesc,
                        salescat: trip.salescat,
                        pricerel: trip.pricerel,
                        mealfact: trip.mealfact,
                        quant: trip.quant,
                        netprice: trip.netprice,
                        grossgross: trip.grossgross,
                        custdiscount: trip.custdiscount,
                        netamont: trip.netamont,
                        airportfee: trip.airportfee,
                        airportfeevat: trip.airportfeevat,
                        gstvat: trip.gstvat,
                        consumptiontax: trip.consumptiontax,
                        surchargeamount: trip.surchargeamount,
                        vatp: trip.vatp,
                        gipba: trip.gipba,
                        totalamount: trip.totalamount,
                        currency: trip.currency,
                        invoicetype: trip.invoicetype,
                        custdiscount_perc: trip.custdiscount_perc,
                        airportfee_perc: trip.airportfee_perc,
                        gstvat_perc: trip.gstvat_perc,
                        surcharge_perc: trip.surcharge_perc,
                        consumptiontax_perc: trip.consumptiontax_perc
                    }));

                await txUpd.commit();
                updFin = true;

                if (!updRes) {
                    updRes = await txIns.run(INSERT.into(catering, trip));
                }
                await txIns.commit();

                if (updRes)
                    res = newStatus;
            } catch (e) {
                if (!updFin)
                    await txUpd.rollback();
                await txIns.rollback();
                console.error(`Error in ${e.element}`);
                trip.statusCode = 6;
                trip.statusParam1 = e.element;
            }

            return res;
        }

        this.changeStatuses = async (trips, status, caller) => {
            let statusUpdated = false;
            for (let trip of trips) {
                if (caller === manualMessage) {
                    trip.statusCode = 2;
                }
                if (caller === resetMessage) {
                    trip.statusCode = null;
                }

                statusUpdated = await this.insertTriplogStatus(trip, trip.logtype, status);

                // TODO: error handling if there is any to be done
            };
            return true;
        }

        /**
         * this method gets a date and a time, and builds a timestamp from them
         */
        this._calcTimeStamp = (date, time) => {
            let timestamp = "";
            for (let datePart of date.split('-')) {
                timestamp = timestamp + datePart;
            }
            for (let timePart of time.split(':')) {
                timestamp = timestamp + timePart;
            }
            return timestamp;
        }

        await super.init();
    }
}
module.exports = TripService;