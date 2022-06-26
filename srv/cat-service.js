const cds = require("@sap/cds");
class TripService extends cds.ApplicationService {
    async init() {
        const { triprecord, triprecordStaging, triplog } = this.entities;
        const db = await cds.connect.to("db");
        this.on("CREATE", triprecord, async (req) => {
            let tripData = req.data;
            tripData.creation_timestamp = Date.now();
            const triplogdata = {};
            triplogdata.surrogatenum = req.data.surrogatenum;
            triplogdata.insupcarriercode2 = req.data.insupcarriercode2;
            triplogdata.inflightno = req.data.inflightno;
            triplogdata.inorigin = req.data.inorigin;
            triplogdata.indestination = req.data.indestination;
            triplogdata.inscheddeptdate = req.data.inscheddeptdate;
            triplogdata.fosuffix = req.data.fosuffix;
            triplogdata.status_code = 64;
            triplogdata.creation_timestamp = tripData.creation_timestamp;
            // infinite loop
            await db.run(INSERT([tripData]).into(triprecordStaging));
            await db.run(INSERT([triplogdata]).into(triplog));
            return req.reply(tripData);
        });
        this.on("processMessage", async (req) => {
            const isSuccess = await this.pushTripsToActualEntity(
                req.data.trips
            );
            if (!isSuccess) throw req.reject(500, "Message Processing Failed");
            // else if(isSuccess == "no Rows") throw req.reject(500, 'No Rows were processed');
        });
        this.pushTripsToActualEntity = async (trips) => {
            let whereString = "";
            trips.forEach((trip) => {
                let surrogatenumTemp = trip.surrogatenum;
                if (
                    surrogatenumTemp !== null &&
                    surrogatenumTemp !== undefined
                ) {
                    surrogatenumTemp = "'" + trip.surrogatenum + "'";
                }
                let insupcarriercode2Temp = trip.insupcarriercode2;
                if (
                    insupcarriercode2Temp !== null &&
                    insupcarriercode2Temp !== undefined
                ) {
                    insupcarriercode2Temp = "'" + trip.insupcarriercode2 + "'";
                }
                let inflightnoTemp = trip.inflightno;
                if (inflightnoTemp !== null && inflightnoTemp !== undefined) {
                    inflightnoTemp = "'" + trip.inflightno + "'";
                }
                let inoriginTemp = trip.inorigin;
                if (inoriginTemp !== null && inoriginTemp !== undefined) {
                    inoriginTemp = "'" + trip.inorigin + "'";
                }
                let indestinationTemp = trip.indestination;
                if (
                    indestinationTemp !== null &&
                    indestinationTemp !== undefined
                ) {
                    indestinationTemp = "'" + trip.indestination + "'";
                }
                let inscheddeptdateTemp = trip.inscheddeptdate;
                if (
                    inscheddeptdateTemp !== null &&
                    inscheddeptdateTemp !== undefined
                ) {
                    inscheddeptdateTemp = "'" + trip.inscheddeptdate + "'";
                }
                let creation_timestamp = trip.creation_timestamp;
                if (
                    creation_timestamp !== null &&
                    creation_timestamp !== undefined
                ) {
                    creation_timestamp = "'" + trip.creation_timestamp + "'";
                }

                const whereComponent = `(surrogatenum = ${surrogatenumTemp} and insupcarriercode2 = ${insupcarriercode2Temp} and inflightno = ${inflightnoTemp} and inorigin = ${inoriginTemp} and indestination = ${indestinationTemp} and inscheddeptdate = ${inscheddeptdateTemp} and creation_timestamp = ${creation_timestamp} )`;
                if (whereString === "") {
                    whereString = whereComponent;
                } else {
                    whereString = `${whereString} or ${whereComponent}`;
                }
            });
            const tripsStaged = await SELECT.from(triprecordStaging).where(
                cds.parse.expr(whereString)
            );
            if (!tripsStaged) return false;
            const tripStagedFiltered = [];
            // Validation and Sanitation
            tripsStaged.forEach((trip) => {
                const triplogMatchingIndex = trips.findIndex((triplog) => {
                    return (
                        triplog.insupcarriercode2 === trip.insupcarriercode2 &&
                        triplog.inflightno === trip.inflightno &&
                        triplog.inorigin === trip.inorigin &&
                        triplog.indestination === trip.indestination &&
                        triplog.inscheddeptdate === trip.inscheddeptdate &&
                        triplog.surrogatenum === trip.surrogatenum &&
                        triplog.creation_timestamp === trip.creation_timestamp
                    );
                });
                if (trips[triplogMatchingIndex].status_code != 53) {
                    if (trip.legstate_code === "ARR" && !trip.actarrdate) {
                        trips[triplogMatchingIndex].status_code = 51;
                    } else {
                        delete trip.creation_timestamp;
                        delete trip.modifiedAt;
                        delete trip.modifiedBy;
                        tripStagedFiltered.push(trip);
                        trips[triplogMatchingIndex].status_code = 53;
                    }
                }
            });
            if (tripStagedFiltered.length == 0) {
                return "no Rows";
            } else {
                let rowInserted = false;
                // Update rows, and insert if they do not exist
                tripStagedFiltered.map(async (trip) => {
                    // try {
                        const updRes = await db.run(UPDATE(triprecord,
                        {   
                            insupcarriercode2: trip.insupcarriercode2,
                            inflightno: trip.inflightno,
                            inorigin: trip.inorigin,
                            indestination: trip.indestination,
                            inscheddeptdate: trip.inscheddeptdate,
                            surrogatenum: trip.surrogatenum
                        }).with({
                            supcarriercode2     : trip.supcarriercode2,
                            scheddeptdate       : trip.scheddeptdate,
                            flightno            : trip.flightno,
                            supcarriercode      : trip.supcarriercode,
                            carriercode         : trip.carriercode,
                            origin              : trip.origin,
                            destination         : trip.destination,
                            repeatno            : trip.repeatno,
                            idooutc             : trip.idooutc,
                            idoo                : trip.idoo,
                            doo                 : trip.doo,
                            dooutc              : trip.dooutc,
                            actarrapt           : trip.actarrapt,
                            actarrapticao       : trip.actarrapticao,
                            actdeptapt          : trip.actdeptapt,
                            actdeptapticao      : trip.actdeptapticao,
                            legstate            : trip.legstate,
                            aircrafttype        : trip.aircrafttype,
                            aircrafttypecpa     : trip.aircrafttypecpa,
                            tailno              : trip.tailno,
                            flighttype          : trip.flighttype,
                            deptparkposn        : trip.deptparkposn,
                            actgatetime         : trip.actgatetime,
                            servicetype         : trip.servicetype,
                            delayreason1        : trip.delayreason1,
                            delayreason2        : trip.delayreason2,
                            delayreason3        : trip.delayreason3,
                            delayreason4        : trip.delayreason4,
                            delayreason5        : trip.delayreason5,
                            actualflyingdur     : trip.actualflyingdur,
                            scheddepttime       : trip.scheddepttime,
                            scheddeptts         : trip.scheddeptts,
                            actdeptts           : trip.actdeptts,
                            takeoffdate         : trip.takeoffdate,
                            takeofftime         : trip.takeofftime,
                            touchdndate         : trip.touchdndate,
                            touchdntime         : trip.touchdntime,
                            actdeptdate         : trip.actdeptdate,
                            actdepttime         : trip.actdepttime,
                            actarrdate          : trip.actarrdate,
                            actarrtime          : trip.actarrtime,
                            takeoffdateutc      : trip.takeoffdateutc,
                            takeofftimeutc      : trip.takeofftimeutc,
                            touchdndateutc      : trip.touchdndateutc,
                            touchdntimeutc      : trip.touchdntimeutc,
                            actdeptdateutc      : trip.actdeptdateutc,
                            actdepttimeutc      : trip.actdepttimeutc,
                            actarrdateutc       : trip.actarrdateutc,
                            actarrtimeutc       : trip.actarrtimeutc,
                            scheddeptdateutc    : trip.scheddeptdateutc,
                            scheddepttimeutc    : trip.scheddepttimeutc,
                            schedarrdateutc     : trip.schedarrdateutc,
                            schedarrtimeutc     : trip.schedarrtimeutc,
                            schedarrdate        : trip.schedarrdate,
                            schedarrtime        : trip.schedarrtime,
                            schedarrts          : trip.schedarrts,
                            actarrts            : trip.actarrts,
                            estdeptdate         : trip.estdeptdate,
                            estdepttime         : trip.estdepttime,
                            estdeptdateutc      : trip.estdeptdateutc,
                            estdepttimeutc      : trip.estdepttimeutc,
                            estarrdateutc       : trip.estarrdateutc,
                            estarrtimeutc       : trip.estarrtimeutc,
                            estarrdate          : trip.estarrdate,
                            estarrtime          : trip.estarrtime,
                            planblocktime       : trip.planblocktime,
                            schedarrapticao     : trip.schedarrapticao,
                            schedarrapt         : trip.schedarrapt,
                            scheddeptapticao    : trip.scheddeptapticao,
                            scheddeptapt        : trip.scheddeptapt,
                            flight_tm           : trip.flight_tm,
                            arr_stand           : trip.arr_stand,
                            dep_terminal        : trip.dep_terminal,
                            arr_terminal        : trip.arr_terminal,
                            onblockdate         : trip.onblockdate,
                            onblocktime         : trip.onblocktime,
                            offblockdate        : trip.offblockdate,
                            offblocktime        : trip.offblocktime,
                            taxi_out_time       : trip.taxi_out_time,
                            route               : trip.route,
                            cfpno1              : trip.cfpno1,
                            cfpno2              : trip.cfpno2
                        }) )
                        if (updRes == 0 && !rowInserted) {
                            rowInserted = true;
                            const insRes = await db.run(INSERT(tripStagedFiltered).into(triprecord));
                        }

                        // const triplogMatchingIndex = trips.findIndex((triplog) => {
                        //     return (
                        //         triplog.insupcarriercode2 === trip.insupcarriercode2 &&
                        //         triplog.inflightno === trip.inflightno &&
                        //         triplog.inorigin === trip.inorigin &&
                        //         triplog.indestination === trip.indestination &&
                        //         triplog.inscheddeptdate === trip.inscheddeptdate &&
                        //         triplog.surrogatenum === trip.surrogatenum &&
                        //         triplog.creation_timestamp === trip.creation_timestamp
                        //     );
                        // });

                        // await Promise.all(
                        //     await db.run(
                        //         UPDATE(
                        //             triplog, {   
                        //                 insupcarriercode2: trips[triplogMatchingIndex].insupcarriercode2,
                        //                 inflightno: trips[triplogMatchingIndex].inflightno,
                        //                 inorigin: trips[triplogMatchingIndex].inorigin,
                        //                 indestination: trips[triplogMatchingIndex].indestination,
                        //                 inscheddeptdate: trips[triplogMatchingIndex].inscheddeptdate,
                        //                 surrogatenum: trips[triplogMatchingIndex].surrogatenum,
                        //                 creation_timestamp: trips[triplogMatchingIndex].creation_timestamp
                        //             }
                        //         ).with({
                        //             status_code: trips[triplogMatchingIndex].status_code
                        //         })
                        // ));
                    // } catch (updErr) {
                    //     debugger;
                    // }
                    });
                    await Promise.all(
                        trips.map(async (trip) => {
                            if ( trip.status === null || trip.status.code != 53) {
                                await db.run(
                                    UPDATE(
                                        triplog, {   
                                            insupcarriercode2: trip.insupcarriercode2,
                                            inflightno: trip.inflightno,
                                            inorigin: trip.inorigin,
                                            indestination: trip.indestination,
                                            inscheddeptdate: trip.inscheddeptdate,
                                            surrogatenum: trip.surrogatenum,
                                            creation_timestamp: trip.creation_timestamp
                                        }
                                    ).with({
                                        status_code: trip.status_code
                                    })
                                );
                            }
                        })
                    );
                        // if( successRow == 0){
                        //     await Promise.all(
                        //         await db.run(INSERT(trip).into(triprecord))
                        //     ).then(function(resultInsert){
                        //         debugger;
                        //     });
                        // }
                // );
                // await db.run(INSERT(tripStagedFiltered).into(triprecord));
                    //tripStagedFiltered) );
                }
            // await Promise.all(
            //     trips.map(async (trip) => {
            //         await db.run(
            //             UPDATE(
            //                 triplog, {   
            //                     insupcarriercode2: trip.insupcarriercode2,
            //                     inflightno: trip.inflightno,
            //                     inorigin: trip.inorigin,
            //                     indestination: trip.indestination,
            //                     inscheddeptdate: trip.inscheddeptdate,
            //                     surrogatenum: trip.surrogatenum,
            //                     creation_timestamp: trip.creation_timestamp
            //                 }
            //             ).with({
            //                 status_code: trip.status_code
            //             })
            //         );
            //     })
            // );
            return true;
        };
        await super.init();
    }
}
module.exports = TripService;
