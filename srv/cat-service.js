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
            await db.run(INSERT([tripData]).into(triprecordStaging));
            await db.run(INSERT([triplogdata]).into(triplog));
            return req.reply(tripData);
        });
        this.on("processMessage", async (req) => {
            const isSuccess = await this.pushTripsToActualEntity(
                req.data.trips
            );
            if (!isSuccess) throw req.reject(500, "Message Processing Failed");
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
                let creation_timestamp = "'" + trip.creation_timestamp + "'";
                
        
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
                        triplog.surrogatenum === trip.surrogatenum
                    );
                });
                if (trip.legstate_code === "ARR" && !trip.actarrdate) {
                    trips[triplogMatchingIndex].status_code = 51;
                } else {
                    delete trip.creation_timestamp;
                    delete trip.modifiedAt;
                    delete trip.modifiedBy;
                    tripStagedFiltered.push(trip);
                    trips[triplogMatchingIndex].status_code = 53;
                }
            });
            if (tripStagedFiltered.length > 0) {
               // await db.run(INSERT(tripStagedFiltered).into(triprecord));
               await db.run(UPDATE(triprecord,
                {   
                    insupcarriercode2: tripStagedFiltered.insupcarriercode2,
                    inflightno: tripStagedFiltered.inflightno,
                    inorigin: tripStagedFiltered.inorigin,
                    indestination: tripStagedFiltered.indestination,
                    inscheddeptdate: tripStagedFiltered.inscheddeptdate,
                    surrogatenum: tripStagedFiltered.surrogatenum
                }).with({
                    
                    supcarriercode2     : tripStagedFiltered.supcarriercode2,
                    scheddeptdate       : tripStagedFiltered.scheddeptdate,
                    flightno            : tripStagedFiltered.flightno,
                    supcarriercode      : tripStagedFiltered.supcarriercode,
                    carriercode         : tripStagedFiltered.carriercode,
                    origin              : tripStagedFiltered.origin,
                    destination         : tripStagedFiltered.destination,
                    repeatno            : tripStagedFiltered.repeatno,
                    idooutc             : tripStagedFiltered.idooutc,
                    idoo                : tripStagedFiltered.idoo,
                    doo                 : tripStagedFiltered.doo,
                    dooutc              : tripStagedFiltered.dooutc,
                    actarrapt           : tripStagedFiltered.actarrapt,
                    actarrapticao       : tripStagedFiltered.actarrapticao,
                    actdeptapt          : tripStagedFiltered.actdeptapt,
                    actdeptapticao      : tripStagedFiltered.actdeptapticao,
                    legstate            : tripStagedFiltered.legstate,
                    aircrafttype        : tripStagedFiltered.aircrafttype,
                    aircrafttypecpa     : tripStagedFiltered.aircrafttypecpa,
                    tailno              : tripStagedFiltered.tailno,
                    flighttype          : tripStagedFiltered.flighttype,
                    deptparkposn        : tripStagedFiltered.deptparkposn,
                    actgatetime         : tripStagedFiltered.actgatetime,
                    servicetype         : tripStagedFiltered.servicetype,
                    delayreason1        : tripStagedFiltered.delayreason1,
                    delayreason2        : tripStagedFiltered.delayreason2,
                    delayreason3        : tripStagedFiltered.delayreason3,
                    delayreason4        : tripStagedFiltered.delayreason4,
                    delayreason5        : tripStagedFiltered.delayreason5,
                    actualflyingdur     : tripStagedFiltered.actualflyingdur,
                    scheddepttime       : tripStagedFiltered.scheddepttime,
                    scheddeptts         : tripStagedFiltered.scheddeptts,
                    actdeptts           : tripStagedFiltered.actdeptts,
                    takeoffdate         : tripStagedFiltered.takeoffdate,
                    takeofftime         : tripStagedFiltered.takeofftime,
                    touchdndate         : tripStagedFiltered.touchdndate,
                    touchdntime         : tripStagedFiltered.touchdntime,
                    actdeptdate         : tripStagedFiltered.actdeptdate,
                    actdepttime         : tripStagedFiltered.actdepttime,
                    actarrdate          : tripStagedFiltered.actarrdate,
                    actarrtime          : tripStagedFiltered.actarrtime,
                    takeoffdateutc      : tripStagedFiltered.takeoffdateutc,
                    takeofftimeutc      : tripStagedFiltered.takeofftimeutc,
                    touchdndateutc      : tripStagedFiltered.touchdndateutc,
                    touchdntimeutc      : tripStagedFiltered.touchdntimeutc,
                    actdeptdateutc      : tripStagedFiltered.actdeptdateutc,
                    actdepttimeutc      : tripStagedFiltered.actdepttimeutc,
                    actarrdateutc       : tripStagedFiltered.actarrdateutc,
                    actarrtimeutc       : tripStagedFiltered.actarrtimeutc,
                    scheddeptdateutc    : tripStagedFiltered.scheddeptdateutc,
                    scheddepttimeutc    : tripStagedFiltered.scheddepttimeutc,
                    schedarrdateutc     : tripStagedFiltered.schedarrdateutc,
                    schedarrtimeutc     : tripStagedFiltered.schedarrtimeutc,
                    schedarrdate        : tripStagedFiltered.schedarrdate,
                    schedarrtime        : tripStagedFiltered.schedarrtime,
                    schedarrts          : tripStagedFiltered.schedarrts,
                    actarrts            : tripStagedFiltered.actarrts,
                    estdeptdate         : tripStagedFiltered.estdeptdate,
                    estdepttime         : tripStagedFiltered.estdepttime,
                    estdeptdateutc      : tripStagedFiltered.estdeptdateutc,
                    estdepttimeutc      : tripStagedFiltered.estdepttimeutc,
                    estarrdateutc       : tripStagedFiltered.estarrdateutc,
                    estarrtimeutc       : tripStagedFiltered.estarrtimeutc,
                    estarrdate          : tripStagedFiltered.estarrdate,
                    estarrtime          : tripStagedFiltered.estarrtime,
                    planblocktime       : tripStagedFiltered.planblocktime,
                    schedarrapticao     : tripStagedFiltered.schedarrapticao,
                    schedarrapt         : tripStagedFiltered.schedarrapt,
                    scheddeptapticao    : tripStagedFiltered.scheddeptapticao,
                    scheddeptapt        : tripStagedFiltered.scheddeptapt,
                    flight_tm           : tripStagedFiltered.flight_tm,
                    arr_stand           : tripStagedFiltered.arr_stand,
                    dep_terminal        : tripStagedFiltered.dep_terminal,
                    arr_terminal        : tripStagedFiltered.arr_terminal,
                    onblockdate         : tripStagedFiltered.onblockdate,
                    onblocktime         : tripStagedFiltered.onblocktime,
                    offblockdate        : tripStagedFiltered.offblockdate,
                    offblocktime        : tripStagedFiltered.offblocktime,
                    taxi_out_time       : tripStagedFiltered.taxi_out_time,
                    route               : tripStagedFiltered.route,
                    cfpno1              : tripStagedFiltered.cfpno1,
                    cfpno2              : tripStagedFiltered.cfpno2
                }) );
                    
                    //tripStagedFiltered) );
            }
            await Promise.all(
                trips.map(async (trip) => {
                    await db.run(
                        UPDATE(
                            triplog, {   
                                insupcarriercode2: trip.insupcarriercode2,
                                inflightno: trip.inflightno,
                                inorigin: trip.inorigin,
                                indestination: trip.indestination,
                                inscheddeptdate: trip.inscheddeptdate,
                                surrogatenum: trip.surrogatenum,
                                creation_timestamp: trip.creation_timestamp,
                            }
                        ).with({
                            status_code: trip.status_code
                        })
                    );
                })
            );
            return true;
        };
        await super.init();
    }
}
module.exports = TripService;
