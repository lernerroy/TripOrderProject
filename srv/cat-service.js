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
            await db.run(INSERT([triplogdata]).into(triplog));
            await db.run(INSERT([tripData]).into(triprecordStaging));
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
                const whereComponent = `(surrogatenum = '${trip.surrogatenum}' and insupcarriercode2 = '${trip.insupcarriercode2}' and inflightno = '${trip.inflightno}' and inorigin = '${trip.inorigin}' and indestination = '${trip.indestination}' and inscheddeptdate = '${trip.inscheddeptdate}')`;
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
                await db.run(INSERT(tripStagedFiltered).into(triprecord));
            }
            await Promise.all(
                trips.map(async (trip) => {
                    await db.run(
                        UPDATE(
                            triplog,
                            trip.insupcarriercode2,
                            trip.inflightno,
                            trip.inorigin,
                            trip.indestination,
                            trip.inscheddeptdate,
                            trip.surrogatenum
                        ).with({
                            status_code: trip.status_code,
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