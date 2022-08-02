namespace com.legstate.triporder;

using {managed} from '@sap/cds/common';
using {Currency} from '@sap/cds/common';
using {Country} from '@sap/cds/common';
using {cuid} from '@sap/cds/common';
using {sap.common.CodeList} from '@sap/cds/common';
using {sap.common.Countries} from '@sap/cds/common';
using {sap.common.Languages} from '@sap/cds/common';
using {sap.common.Currencies} from '@sap/cds/common';


// Domains
//////////////////////////////////////////////////////////////////////
entity LoadingStationCodes : CodeList, managed {
    key code : String(2) @(title : '{i18n>catloadstatcode}');
};

entity Coord_signs : CodeList, managed {
    key code : String(1) @(title : '{i18n>coord_sign_code}');
};
//////////////////////////////////////////////////////////////////////

// Tables
//////////////////////////////////////////////////////////////////////
entity Carriers : CodeList, managed {
    key code : String(2) @title : '{i18n>supcarriercode}';
};

entity Legstates : CodeList, managed {
    key code          : String(3)             @title : '{i18n>legstate}';
        stonr         : String(2)             @title : '{i18n>stonr}';
        finalLegstate : Boolean default false @title : '{i18n>finalLegstate}';
};

entity Airports : CodeList, managed {
    key code           : String(3)                    @title : '{i18n>aptcd}';
        aptcd_icao     : String(4)                    @title : '{i18n>aptcd_icao}';
        online_ind     : Boolean                      @title : '{i18n>online_ind}';
        company_ind    : Boolean                      @title : '{i18n>company_ind}';
        fo_po_days     : Integer                      @title : '{i18n>fo_po_days}';
        country_code   : Association to one Countries @title : '{i18n>country_code}';
        ekgrp          : String(3)                    @title : '{i18n>ekgrp}';
        catloadstat    : loadingStationCode           @title : '{i18n>catloadstatcode}';
        catgroundime   : String(4)                    @title : '{i18n>catgroundime}';
        lat_coord      : Decimal(16, 14)              @title : '{i18n>lat_coord}';
        lon_coord      : Decimal(16, 14)              @title : '{i18n>lon_coord}';
        lat_coord_sign : coord_sign                   @title : '{i18n>lat_coord_sign}';
        lon_coord_sign : coord_sign                   @title : '{i18n>lon_coord_sign}';
};

/**TBD, if tailNo will be switched to a domain
 */
@assert.unique : {tailNo : [tailNo], }
entity TailRegistrations : CodeList, managed {
    key ID                        : UUID @(Core.Computed : true) @title : '{i18n>trid}';
        tailNo                    : String(8) @title : '{i18n>tailNo}';
        aircraftType              : aircraftType @title : '{i18n>aircraft_type}';
        ac_seat_config            : String(30) @title : '{i18n>ac_seat_config}';
        ac_type_iata              : String(10) @title : '{i18n>ac_type_iata}';
        ac_type_iatag             : String(10) @title : '{i18n>ac_type_iatag}';
        ac_type_icao              : String(10) @title : '{i18n>ac_type_icao}';
        mtow_kg                   : Decimal(6,0) @title : '{i18n>mtow_kg}';
        mtow_t                    : String(6) @title : '{i18n>mtow_t}';
        amtow1_kg                 : Decimal(7,0) @title : '{i18n>amtow1_kg}';
        amtow2_kg                 : Decimal(7,0) @title : '{i18n>amtow2_kg}';
        mtw_kg                    : Decimal(6,0) @title : '{i18n>mtw_kg}';
        amtw_kg                   : Decimal(6,0) @title : '{i18n>amtw_kg}';
        mlw_kg                    : Decimal(6,0) @title : '{i18n>mlw_kg}';
        full_cgo_cap              : Decimal(6,0) @title : '{i18n>full_cgo_cap}';
        eev_kg                    : String(7) @title : '{i18n>eev_kg}';
        wingspan_m                : String(6) @title : '{i18n>wingspan_m}';
        length_m                  : String(6) @title : '{i18n>length_m}';
        icao_noise_cat_takeoff    : String(5) @title : '{i18n>icao_noise_cat_takeoff}';
        icao_noise_cat_landing    : String(5) @title : '{i18n>icao_noise_cat_landing}';
        icao_chap3_noise_level    : Decimal(5,2) @title : '{i18n>icao_chap3_noise_level}';
        icao_chap4_noise_level    : Decimal(5,2) @title : '{i18n>icao_chap4_noise_level}';
        icao_annex16_chp          : String(2) @title : '{i18n>icao_annex16_chp}';
        nri_noise_category        : String(4) @title : '{i18n>nri_noise_category}';
        aci_noise_rate_ind_mtow   : String(5) @title : '{i18n>aci_noise_rate_ind_mtow}';
        aci_noise_rate_ind_amtow  : String(5) @title : '{i18n>aci_noise_rate_ind_amtow}';
        engine_app_noise_level    : String(6) @title : '{i18n>engine_app_noise_level}';
        engine_app_noise_limit    : String(6) @title : '{i18n>engine_app_noise_limit}';
        engine_side_noise_level   : String(6) @title : '{i18n>engine_side_noise_level}';
        engine_side_noise_limit   : String(6) @title : '{i18n>engine_side_noise_limit}';
        noise_level_start_takeoff : String(6) @title : '{i18n>noise_level_start_takeoff}';
        noise_limit_start_takeoff : String(6) @title : '{i18n>noise_limit_start_takeoff}';
        pax_or_frt                : String(1) @title : '{i18n>pax_or_frt}';
        fcl_seat_cap              : Decimal(2,0) @title : '{i18n>fcl_seat_cap}';
        jcl_seat_cap              : Decimal(2,0) @title : '{i18n>jcl_seat_cap}';
        pey_seat_cap              : Decimal(3,0) @title : '{i18n>pey_seat_cap}';
        ycl_seat_cap              : Decimal(3,0) @title : '{i18n>ycl_seat_cap}';
        tot_seat_cap              : Decimal(3,0) @title : '{i18n>tot_seat_cap}';
        ac_operator               : String(25) @title : '{i18n>ac_operator}';
        body_type                 : String(1) @title : '{i18n>body_type}';
        number_engines            : Decimal(1,0) @title : '{i18n>number_engines}';
        engine_type               : String(20) @title : '{i18n>engine_type}';
        zero_fuel_weight          : Decimal(6,0) @title : '{i18n>zero_fuel_weight}';
        euwgtfctr1                : String(5) @title : '{i18n>euwgtfctr1}';
        euwgtfctr2                : String(5) @title : '{i18n>euwgtfctr2}';
        acoustic_grp              : String(3) @title : '{i18n>acoustic_grp}';
        bulk_ac                   : String(1) @title : '{i18n>bulk_ac}';
        eev_kg_arn                : String(10) @title : '{i18n>eev_kg_arn}';
        ac_total_arn              : String(10) @title : '{i18n>ac_total_arn}';
        lto_fuel                  : Decimal(8,2) @title : '{i18n>lto_fuel}';
        nox_tp_maint              : Decimal(8,2) @title : '{i18n>nox_tp_maint}';
        amtow1_t                  : Decimal(10,0) @title : '{i18n>amtow1_t}';
        amtow2_t                  : Decimal(10,0) @title : '{i18n>amtow2_t}';
        engine_takeoff_noise_lvl  : Decimal(7,0) @title : '{i18n>engine_takeoff_noise_lvl}';
};


 @assert.unique : {
     aircraftType  : [ aircraftType, aircraftGroup ],
 }
entity aircraftTypeGroup : CodeList, managed {

    key ID            : UUID @(Core.Computed : true) @title : '{i18n>actgid}';
        aircraftType  : String(3) @title : '{i18n>aircraft_type}';
        aircraftGroup : String(3) @title: '{i18n>aircraft_group}';
};

//////////////////////////////////////////////////////////////////////

// Types
//////////////////////////////////////////////////////////////////////
type airportCode : Association to Airports {
                       code
                   }; //airportCodes;

type loadingStationCode : Association to LoadingStationCodes;
type coord_sign : Association to Coord_signs;

type legstate : Association to Legstates {
                    code
                };

type carriercode : Association to Carriers {
                       code
                   };

type aircraftType : Association to one aircraftTypeGroup /*{
                        ID
                    }*/;
//////////////////////////////////////////////////////////////////////


// Trip Record Entities
//////////////////////////////////////////////////////////////////////

aspect surrogatenum {
    key surrogatenum : String(23);
};

aspect recordsKey : managed { // key ID to be reused in other entities
    key insupcarriercode2 : String(2);
    key inflightno        : String(4);
    key inorigin          : String(3);
    key indestination     : String(3);
    key inscheddeptdate   : Date;
    fosuffix              : String(2);
};

aspect aufnr {
    aufnr : String(12);
};

aspect statusCode {
    statusCode   : Decimal(3, 0);
    statusParam1 : String(40);
    statusParam2 : String(40);
    statusParam3 : String(40);
    statusParam4 : String(40);

};


//@cds.persistence.exists
aspect triprecorddetails : recordsKey, surrogatenum, aufnr {
    supcarriercode2  : carriercode; //String(2);
    scheddeptdate    : Date;
    flightno         : String(4);
    supcarriercode   : carriercode; //String(2);
    carriercode      : carriercode; //String(2);
    origin           : airportCode; //String(3);
    destination      : airportCode; //String(3);
    repeatno         : String(3);
    idooutc          : Date;
    idoo             : Date;
    doo              : Date;
    dooutc           : Date;
    actarrapt        : airportCode; //String(3);
    actarrapticao    : String(4);
    actdeptapt       : airportCode; //String(3);
    actdeptapticao   : String(4);
    legstate         : legstate; // String(3); // /
    aircrafttype     : String(3);
    aircrafttypecpa  : String(3);
    tailno           : String(8);
    flighttype       : String(1);
    deptparkposn     : String(10);
    actgatetime      : Integer;
    servicetype      : String(1);
    delayreason1     : String(3);
    delayreason2     : String(3);
    delayreason3     : String(3);
    delayreason4     : String(3);
    delayreason5     : String(3);
    actualflyingdur  : Integer;
    scheddepttime    : Time;
    scheddeptts      : Decimal(15, 0);
    actdeptts        : Decimal(15, 0);
    takeoffdate      : Date;
    takeofftime      : Time;
    touchdndate      : Date;
    touchdntime      : Time;
    actdeptdate      : Date;
    actdepttime      : Time;
    actarrdate       : Date;
    actarrtime       : Time;
    takeoffdateutc   : Date;
    takeofftimeutc   : Time;
    touchdndateutc   : Date;
    touchdntimeutc   : Time;
    actdeptdateutc   : Date;
    actdepttimeutc   : Time;
    actarrdateutc    : Date;
    actarrtimeutc    : Time;
    scheddeptdateutc : Date;
    scheddepttimeutc : Time;
    schedarrdateutc  : Date;
    schedarrtimeutc  : Time;
    schedarrdate     : Date;
    schedarrtime     : Time;
    schedarrts       : Decimal(15, 0);
    actarrts         : Decimal(15, 0);
    estdeptdate      : Date;
    estdepttime      : Time;
    estdeptdateutc   : Date;
    estdepttimeutc   : Time;
    estarrdateutc    : Date;
    estarrtimeutc    : Time;
    estarrdate       : Date;
    estarrtime       : Time;
    planblocktime    : Integer;
    schedarrapticao  : String(4);
    schedarrapt      : airportCode; //String(3);String(3);
    scheddeptapticao : String(4);
    scheddeptapt     : airportCode; //String(3);String(3);
    flight_tm        : Integer;
    arr_stand        : String(10);
    dep_terminal     : String(4);
    arr_terminal     : String(4);
    onblockdate      : Date;
    onblocktime      : Time;
    offblockdate     : Date;
    offblocktime     : Time;
    taxi_out_time    : Integer;
    route            : String(10);
    cfpno1           : String(10);
    cfpno2           : String(10);
};

entity triprecord : triprecorddetails {};

entity triprecordStaging : recordsKey, surrogatenum, aufnr {
    supcarriercode2  : carriercode; //String(2);
    scheddeptdate    : Date;
    flightno         : String(4);
    supcarriercode   : carriercode; //String(2);
    carriercode      : carriercode; //String(2);
    origin           : airportCode; //String(3);
    destination      : airportCode; //String(3);
    repeatno         : String(3);
    idooutc          : Date;
    idoo             : Date;
    doo              : Date;
    dooutc           : Date;
    actarrapt        : airportCode; //String(3);
    actarrapticao    : String(4);
    actdeptapt       : airportCode; //String(3);
    actdeptapticao   : String(4);
    legstate         : legstate; // String(3); // /
    aircrafttype     : String(3);
    aircrafttypecpa  : String(3);
    tailno           : String(8);
    flighttype       : String(1);
    deptparkposn     : String(10);
    actgatetime      : Integer;
    servicetype      : String(1);
    delayreason1     : String(3);
    delayreason2     : String(3);
    delayreason3     : String(3);
    delayreason4     : String(3);
    delayreason5     : String(3);
    actualflyingdur  : Integer;
    scheddepttime    : Time;
    scheddeptts      : Decimal(15, 0);
    actdeptts        : Decimal(15, 0);
    takeoffdate      : Date;
    takeofftime      : Time;
    touchdndate      : Date;
    touchdntime      : Time;
    actdeptdate      : Date;
    actdepttime      : Time;
    actarrdate       : Date;
    actarrtime       : Time;
    takeoffdateutc   : Date;
    takeofftimeutc   : Time;
    touchdndateutc   : Date;
    touchdntimeutc   : Time;
    actdeptdateutc   : Date;
    actdepttimeutc   : Time;
    actarrdateutc    : Date;
    actarrtimeutc    : Time;
    scheddeptdateutc : Date;
    scheddepttimeutc : Time;
    schedarrdateutc  : Date;
    schedarrtimeutc  : Time;
    schedarrdate     : Date;
    schedarrtime     : Time;
    schedarrts       : Decimal(15, 0);
    actarrts         : Decimal(15, 0);
    estdeptdate      : Date;
    estdepttime      : Time;
    estdeptdateutc   : Date;
    estdepttimeutc   : Time;
    estarrdateutc    : Date;
    estarrtimeutc    : Time;
    estarrdate       : Date;
    estarrtime       : Time;
    planblocktime    : Integer;
    schedarrapticao  : String(4);
    schedarrapt      : airportCode; //String(3);String(3);
    scheddeptapticao : String(4);
    scheddeptapt     : airportCode; //String(3);String(3);
    flight_tm        : Integer;
    arr_stand        : String(10);
    dep_terminal     : String(4);
    arr_terminal     : String(4);
    onblockdate      : Date;
    onblocktime      : Time;
    offblockdate     : Date;
    offblocktime     : Time;
    taxi_out_time    : Integer;
    route            : String(10);
    cfpno1           : String(10);
    cfpno2           : String(10);
    key staging_creation_timestamp : Timestamp @(title : '{i18n>timestamp}');
};

entity triplog : recordsKey, surrogatenum, statusCode {
        //status : Decimal(2,0) @(title : '{i18n>status}') ;
        status                     : Status    @(title : '{i18n>status}');
        // status: Association to Status @(title : '{i18n>status}');
        //messagetext : String @(title : '{i18n>messagetext}');
    key staging_creation_timestamp : Timestamp @(title : '{i18n>timestamp}');
    key status_timestamp           : Timestamp @cds.on.insert : $now  @(title : '{i18n>timestamp}');
    key logtype                    : logType   @(title : '{i18n>logtype}');
};

view triplogAll as
    select from triplog {
        *
    };

view triplogCurrent as
    select from triplog as triplog1 {
        key insupcarriercode2,
        key inflightno,
        key inorigin,
        key indestination,
        key inscheddeptdate,
        key surrogatenum,
        key staging_creation_timestamp,
            logtype,
            fosuffix,
            status,
            statusCode,
            statusParam1,
            statusParam2,
            statusParam3,
            statusParam4,
        key max(status_timestamp) as status_timestamp     : Timestamp
    }
    group by
        insupcarriercode2,
        inflightno,
        inorigin,
        indestination,
        inscheddeptdate,
        surrogatenum,
        staging_creation_timestamp,
        logtype,
        fosuffix,
        status,
        statusCode,
        statusParam1,
        statusParam2,
        statusParam3,
        statusParam4
    having
        max(status_timestamp) = (
            select from triplog {
                max(status_timestamp) as status_timestamp : Timestamp
            }
            where
                    inflightno                 = triplog1.inflightno
                and inorigin                   = triplog1.inorigin
                and indestination              = triplog1.indestination
                and inscheddeptdate            = triplog1.inscheddeptdate
                and surrogatenum               = triplog1.surrogatenum
                and staging_creation_timestamp = triplog1.staging_creation_timestamp
                and logtype                    = triplog1.logtype
        );

@cds.autoexpose
type Status : Decimal(2, 0) enum {
    ReadyForProcessing = 64;
    BeingProcessed     = 50;
    Error              = 51;
    Warning            = 52;
    Processed          = 53;
};

@cds.autoexpose
type logType : String enum {
    Trip      = '1';
    Passenger = '2';
    Cargo     = '3';
    RoutePlan = '4';
    Catering  = '5';
}

// @cds.autoexpose
// entity Status {
//     key code     : Decimal(2, 0) @title: '{i18n>status}';
//         text     : localized String(255) @title : '{i18n>messagetext}';
//         sequence : Integer;
// };

//@cds.persistence.exists
entity passengerdetails : recordsKey, surrogatenum {
    carriercode        : carriercode; //String(4);
    version            : Integer;
    user_ind           : String(1);
    firstclasspax      : Decimal(3, 0);
    busclasspax        : Decimal(3, 0);
    premecopax         : Decimal(3, 0);
    ecopax             : Decimal(3, 0);
    totalpax           : Decimal(3, 0);
    revpaxfirst        : Decimal(3, 0);
    revpaxbus          : Decimal(3, 0);
    revpaxpreco        : Decimal(3, 0);
    revpaxeco          : Decimal(3, 0);
    revpaxtot          : Decimal(3, 0);
    nrevpaxfirst       : Decimal(3, 0);
    nrevpaxbus         : Decimal(3, 0);
    nrevpaxpreco       : Decimal(3, 0);
    nrevpaxeco         : Decimal(3, 0);
    nrevpaxtot         : Decimal(3, 0);
    chdpax             : Decimal(3, 0);
    infpax             : Decimal(3, 0);
    wchpax             : Decimal(3, 0);
    wchc               : Decimal(3, 0);
    wchs               : Decimal(3, 0);
    wchr               : Decimal(3, 0);
    wcbd               : Decimal(3, 0);
    wcbw               : Decimal(3, 0);
    wcmp               : Decimal(3, 0);
    wcob               : Decimal(3, 0);
    wclb               : Decimal(3, 0);
    boardpax           : Decimal(3, 0);
    transitpax         : Decimal(3, 0);
    transferpax        : Decimal(3, 0);
    bagquan            : Decimal(8, 0);
    bagweight          : Decimal(8, 2);
    traint             : Decimal(3, 0);
    tradom             : Decimal(3, 0);
    creation_timestamp : Decimal(15, 0);
    tecnum             : Integer;
    cabnum             : Integer;
    capnum             : Integer;
    cocnum             : Integer;
    ecavml             : Integer;
    ecbbml             : Integer;
    ecblml             : Integer;
    ecchml             : Integer;
    ecdbml             : Integer;
    ecfpml             : Integer;
    ecgfml             : Integer;
    echnml             : Integer;
    ecksml             : Integer;
    eclcml             : Integer;
    eclfml             : Integer;
    eclsml             : Integer;
    ecmoml             : Integer;
    ecnlml             : Integer;
    ecorml             : Integer;
    ecrvml             : Integer;
    ecsfml             : Integer;
    ecvgml             : Integer;
    ecvjml             : Integer;
    ecvlml             : Integer;
    ecvoml             : Integer;
    bcavml             : Integer;
    bcbbml             : Integer;
    bcblml             : Integer;
    bcchml             : Integer;
    bcdbml             : Integer;
    bcfpml             : Integer;
    bcgfml             : Integer;
    bchnml             : Integer;
    bcksml             : Integer;
    bclcml             : Integer;
    bclfml             : Integer;
    bclsml             : Integer;
    bcmoml             : Integer;
    bcnlml             : Integer;
    bcorml             : Integer;
    bcrvml             : Integer;
    bcsfml             : Integer;
    bcvgml             : Integer;
    bcvjml             : Integer;
    bcvlml             : Integer;
    bcvoml             : Integer;
    umnr               : Integer;
};

entity passenger : passengerdetails {};

entity passengerStaging : passengerdetails {
    key staging_creation_timestamp : Timestamp @(title : '{i18n>timestamp}');
// triplog : Association to many triplog  on triplog.passengerStaging = $self;
};

//@cds.persistence.exists
entity cargorecorddetails : recordsKey, surrogatenum {
    version            : String(3);
    user_ind           : String(1);
    //flightinddate       : Date;
    chgtottonn         : Decimal(8, 2);
    acttottonn         : Decimal(8, 2);
    tottranstonn       : Decimal(8, 2);
    chgtotimptonn      : Decimal(8, 2);
    acttotimptonn      : Decimal(8, 2);
    chgtotexptonn      : Decimal(8, 2);
    acttotexptonn      : Decimal(8, 2);
    chgimploose        : Decimal(8, 2);
    actimploose        : Decimal(8, 2);
    chgimpprepck       : Decimal(8, 2);
    actimpprepck       : Decimal(8, 2);
    chgexploose        : Decimal(8, 2);
    actexploose        : Decimal(8, 2);
    chgexpprepack      : Decimal(8, 2);
    actexpprepack      : Decimal(8, 2);
    chgmailimport      : Decimal(8, 2);
    actmailimport      : Decimal(8, 2);
    chgmailexport      : Decimal(8, 2);
    actmailexport      : Decimal(8, 2);
    avichgtkg          : Decimal(8, 2);
    aviactkg           : Decimal(8, 2);
    avinoawb           : Decimal(8, 0);
    dgrchgtkg          : Decimal(8, 2);
    dgractkg           : Decimal(8, 2);
    dgrnoawb           : Decimal(8, 2);
    humchgkg           : Decimal(8, 2);
    humactkg           : Decimal(8, 2);
    humnoawb           : Decimal(8, 0);
    perchgkg           : Decimal(8, 2);
    peractkg           : Decimal(8, 2);
    pernoawb           : Decimal(8, 0);
    valchgkg           : Decimal(8, 2);
    valactkg           : Decimal(8, 2);
    valnoawb           : Decimal(8, 0); // last copied
    pilchgkg           : Decimal(8, 2);
    pilactkg           : Decimal(8, 2);
    pilnoawb           : Decimal(8, 0);
    pefchgkg           : Decimal(8, 2);
    pefactkg           : Decimal(8, 2);
    pefnoawb           : Decimal(8, 2);
    temchgkg           : Decimal(8, 2);
    temactkg           : Decimal(8, 2);
    temnoawb           : Decimal(8, 2);
    vunchgkg           : Decimal(8, 2);
    vunactkg           : Decimal(8, 2);
    vunnoawb           : Decimal(8, 2);
    totawb             : Decimal(8, 2);
    chgtransloose      : Decimal(8, 2);
    acttransloose      : Decimal(8, 2);
    chgtransprepack    : Decimal(8, 2);
    acttransprepack    : Decimal(8, 2);
    chgephloose        : Decimal(8, 2);
    actephloose        : Decimal(8, 2);
    chgephprepack      : Decimal(8, 2);
    actephprepack      : Decimal(8, 2);
    chgepdcgo          : Decimal(8, 2);
    actepdcgo          : Decimal(8, 2);
    creation_timestamp : Decimal(15, 0);
    chgimptonn         : Decimal(8, 2);
    chgexptonn         : Decimal(8, 2);
    chgtottranstonn    : Decimal(8, 2);
};

entity cargorecord : cargorecorddetails {};

entity cargorecordStaging : cargorecorddetails {
    key staging_creation_timestamp : Timestamp @(title : '{i18n>timestamp}');
//  triplog : Association to many triplog on triplog.cargorecordStaging = $self;
};

//@cds.persistence.exists
entity routeplanDetails : recordsKey, surrogatenum {
    key lineno       : String(3);
    key cfpno        : String(15);
        routeno      : String(4);
        countrycode  : String(250);
        airspdistnm  : String(6);
        airspdistm   : String(12);
        airspdistkm  : String(6);
        elapsedtime  : String(6);
        deptapticao  : String(4);
        arrapticao   : String(4);
        tailno       : String(8);
        entrydatelmt : Date;
        entrytimelmt : Time;
        entrydateutc : Date;
        entrytimeutc : Time;
        exitdatelmt  : Date;
        exittimelmt  : Time;
        exitdateutc  : Date;
        exittimeutc  : Time;
        amount       : Decimal(11, 2);
        rate         : Decimal(11, 2);
        currency     : Currency; //String(5);;
        entrypoint   : String(10);
        exitpoint    : String(10);
        entryway     : String(10);
        exitway      : String(10);
        chargetype   : String(2);
        provid       : String(2);
        gcd          : Decimal(8, 0);
};

entity routeplan : routeplanDetails {};

entity routeplanStaging : routeplanDetails {
    key staging_creation_timestamp : Timestamp @(title : '{i18n>timestamp}');
//  triplog : Association to many triplog  on triplog.routeplanStaging = $self;
};

//@cds.persistence.exists
entity accommodation : recordsKey, surrogatenum {
    carriercode      : carriercode; //String(2);
    flightno         : String(4);
    origin           : airportCode; //String(3);
    destination      : airportCode; //String(3);
    scheddeptdateutc : Date;
    ccsmsgref        : String(23);
    scheddeptdate    : Date;
    vendor           : String(10); // data element->ZEFO_VENDOR ?
    actarrdateutc    : Date;
    actarrdate       : Date;
    servcode         : String(18);
    reservedate      : Date;
    rmntsqty         : Integer;
    allowamt         : Decimal(11, 2);
    currency         : Currency; //String(5);
};


//@cds.persistence.exists
entity cateringdetails : recordsKey, surrogatenum {
    carriercode         : carriercode; //String(2);
    origin              : airportCode; //String(3);
    destination         : airportCode; //String(3);
    classtype           : String(10);
    sapmeal             : String(18);
    exdescription       : String(100);
    paxqun              : Decimal(3, 0);
    unitofmesur         : String(3); // unit
    exmenucode          : String(100); // curr
    exmenudesc          : String(200); // curr
    salescat            : String(50); // curr
    pricerel            : String(1); // curr
    mealfact            : String(1); // curr
    quant               : Decimal(13, 3); // curr
    netprice            : Decimal(11, 2); // curr
    grossgross          : Decimal(11, 2); // curr
    custdiscount        : Decimal(11, 2); // curr
    netamont            : Decimal(11, 2); // curr
    airportfee          : Decimal(11, 2); // curr
    airportfeevat       : Decimal(11, 2); // curr
    gstvat              : Decimal(11, 2); // curr
    consumptiontax      : Decimal(11, 2); // curr
    surchargeamount     : Decimal(11, 2); // curr
    vatp                : Decimal(11, 2); // curr
    gipba               : Decimal(11, 2); // curr
    totalamount         : Decimal(11, 2); // curr
    currency            : Currency; // String(5); // currency key
    invoicetype         : String(2);
    custdiscount_perc   : String(3);
    airportfee_perc     : String(3);
    gstvat_perc         : String(3);
    surcharge_perc      : String(3);
    consumptiontax_perc : String(3);
};

entity catering : cateringdetails {};

entity cateringStaging : cateringdetails {
    key staging_creation_timestamp : Timestamp @(title : '{i18n>timestamp}');
// triplog : Association to many triplog  on triplog.cateringStaging = $self;
};

view LegstatesAll as 
    select from Legstates{
        *
    };

// view LegstatesFinal as
//     select from Legstates as Legstates1 { * } where stonr = ( select max(stonr) as stonr from Legstates );

annotate triprecordStaging with {
    supcarriercode2  @assert.integrity: false;
    supcarriercode   @assert.integrity: false;
    carriercode      @assert.integrity: false;
    origin           @assert.integrity: false;
    destination      @assert.integrity: false;
    actarrapt @assert.integrity: false;
    actdeptapt @assert.integrity: false;
    legstate @assert.integrity: false;
    schedarrapt @assert.integrity: false;
    scheddeptapt @assert.integrity: false;
}


annotate triprecord with {
    surrogatenum      @title : '{i18n>surrogatenum}';
    aufnr             @title : '{i18n>aufnr}';
    inflightno        @title : '{i18n>inflightno}';
    inorigin          @title : '{i18n>inorigin}';
    indestination     @title : '{i18n>indestination}';
    inscheddeptdate   @title : '{i18n>inscheddeptdate}';
    fosuffix          @title : '{i18n>fosuffix}';
    insupcarriercode2 @title : '{i18n>insupcarriercode2}';
    supcarriercode2   @title : '{i18n>supcarriercode2}';
    scheddeptdate     @title : '{i18n>scheddeptdate}';
    flightno          @title : '{i18n>flightno}';
    supcarriercode    @title : '{i18n>supcarriercode}';
    carriercode       @title : '{i18n>carriercode}';
    origin            @title : '{i18n>origin}';
    destination       @title : '{i18n>destination}';
    repeatno          @title : '{i18n>repeatno}';
    idooutc           @title : '{i18n>idooutc}';
    idoo              @title : '{i18n>idoo}';
    doo               @title : '{i18n>doo}';
    dooutc            @title : '{i18n>dooutc}';
    actarrapt         @title : '{i18n>actarrapt}';
    actarrapticao     @title : '{i18n>actarrapticao}';
    actdeptapt        @title : '{i18n>actdeptapt}';
    actdeptapticao    @title : '{i18n>actdeptapticao}';
    legstate          @title : '{i18n>legstate}';
    aircrafttype      @title : '{i18n>aircrafttype}';
    aircrafttypecpa   @title : '{i18n>aircrafttypecpa}';
    tailno            @title : '{i18n>tailno}';
    flighttype        @title : '{i18n>flighttype}';
    deptparkposn      @title : '{i18n>deptparkposn}';
    actgatetime       @title : '{i18n>actgatetime}';
    servicetype       @title : '{i18n>servicetype}';
    delayreason1      @title : '{i18n>delayreason1}';
    delayreason2      @title : '{i18n>delayreason2}';
    delayreason3      @title : '{i18n>delayreason3}';
    delayreason4      @title : '{i18n>delayreason4}';
    delayreason5      @title : '{i18n>delayreason5}';
    actualflyingdur   @title : '{i18n>actualflyingdur}';
    scheddepttime     @title : '{i18n>scheddepttime}';
    scheddeptts       @title : '{i18n>scheddeptts}';
    actdeptts         @title : '{i18n>actdeptts}';
    takeoffdate       @title : '{i18n>takeoffdate}';
    takeofftime       @title : '{i18n>takeofftime}';
    touchdndate       @title : '{i18n>touchdndate}';
    touchdntime       @title : '{i18n>touchdntime}';
    actdeptdate       @title : '{i18n>actdeptdate}';
    actdepttime       @title : '{i18n>actdepttime}';
    actarrdate        @title : '{i18n>actarrdate}';
    actarrtime        @title : '{i18n>actarrtime}';
    takeoffdateutc    @title : '{i18n>takeoffdateutc}';
    takeofftimeutc    @title : '{i18n>takeofftimeutc}';
    touchdndateutc    @title : '{i18n>touchdndateutc}';
    touchdntimeutc    @title : '{i18n>touchdntimeutc}';
    actdeptdateutc    @title : '{i18n>actdeptdateutc}';
    actdepttimeutc    @title : '{i18n>actdepttimeutc}';
    actarrdateutc     @title : '{i18n>actarrdateutc}';
    actarrtimeutc     @title : '{i18n>actarrtimeutc}';
    scheddeptdateutc  @title : '{i18n>scheddeptdateutc}';
    scheddepttimeutc  @title : '{i18n>scheddepttimeutc}';
    schedarrdateutc   @title : '{i18n>schedarrdateutc}';
    schedarrtimeutc   @title : '{i18n>schedarrtimeutc}';
    schedarrdate      @title : '{i18n>schedarrdate}';
    schedarrtime      @title : '{i18n>schedarrtime}';
    schedarrts        @title : '{i18n>schedarrts}';
    actarrts          @title : '{i18n>actarrts}';
    estdeptdate       @title : '{i18n>estdeptdate}';
    estdepttime       @title : '{i18n>estdepttime}';
    estdeptdateutc    @title : '{i18n>estdeptdateutc}';
    estdepttimeutc    @title : '{i18n>estdepttimeutc}';
    estarrdateutc     @title : '{i18n>estarrdateutc}';
    estarrtimeutc     @title : '{i18n>estarrtimeutc}';
    estarrdate        @title : '{i18n>estarrdate}';
    estarrtime        @title : '{i18n>estarrtime}';
    planblocktime     @title : '{i18n>planblocktime}';
    schedarrapticao   @title : '{i18n>schedarrapticao}';
    schedarrapt       @title : '{i18n>schedarrapt}';
    scheddeptapticao  @title : '{i18n>scheddeptapticao}';
    scheddeptapt      @title : '{i18n>scheddeptapt}';
    flight_tm         @title : '{i18n>flight_tm}';
    arr_stand         @title : '{i18n>arr_stand}';
    dep_terminal      @title : '{i18n>dep_terminal}';
    arr_terminal      @title : '{i18n>arr_terminal}';
    onblockdate       @title : '{i18n>onblockdate}';
    onblocktime       @title : '{i18n>onblocktime}';
    offblockdate      @title : '{i18n>offblockdate}';
    offblocktime      @title : '{i18n>offblocktime}';
    taxi_out_time     @title : '{i18n>taxi_out_time}';
    route             @title : '{i18n>Route}';
    cfpno1            @title : '{i18n>cfpno1}';
    cfpno2            @title : '{i18n>cfpno2}';
}

annotate passenger with {
    surrogatenum       @title : '{i18n>surrogatenum}';
    inflightno         @title : '{i18n>inflightno}';
    inorigin           @title : '{i18n>inorigin}';
    indestination      @title : '{i18n>indestination}';
    inscheddeptdate    @title : '{i18n>inscheddeptdate}';
    fosuffix           @title : '{i18n>fosuffix}';
    insupcarriercode2  @title : '{i18n>insupcarriercode2}';
    carriercode        @title : '{i18n>carriercode}';
    version            @title : '{i18n>version}';
    user_ind           @title : '{i18n>user_ind}';
    firstclasspax      @title : '{i18n>firstclasspax}';
    busclasspax        @title : '{i18n>busclasspax}';
    premecopax         @title : '{i18n>premecopax}';
    ecopax             @title : '{i18n>ecopax}';
    totalpax           @title : '{i18n>totalpax}';
    revpaxfirst        @title : '{i18n>revpaxfirst}';
    revpaxbus          @title : '{i18n>revpaxbus}';
    revpaxpreco        @title : '{i18n>revpaxpreco}';
    revpaxeco          @title : '{i18n>revpaxeco}';
    revpaxtot          @title : '{i18n>revpaxtot}';
    nrevpaxfirst       @title : '{i18n>nrevpaxfirst}';
    nrevpaxbus         @title : '{i18n>nrevpaxbus}';
    nrevpaxpreco       @title : '{i18n>nrevpaxpreco}';
    nrevpaxeco         @title : '{i18n>nrevpaxeco}';
    nrevpaxtot         @title : '{i18n>nrevpaxtot}';
    chdpax             @title : '{i18n>chdpax}';
    infpax             @title : '{i18n>infpax}';
    wchpax             @title : '{i18n>wchpax}';
    wchc               @title : '{i18n>wchc}';
    wchs               @title : '{i18n>wchs}';
    wchr               @title : '{i18n>wchr}';
    wcbd               @title : '{i18n>wcbd}';
    wcbw               @title : '{i18n>wcbw}';
    wcmp               @title : '{i18n>wcmp}';
    wcob               @title : '{i18n>wcob}';
    wclb               @title : '{i18n>wclb}';
    boardpax           @title : '{i18n>boardpax}';
    transitpax         @title : '{i18n>transitpax}';
    transferpax        @title : '{i18n>transferpax}';
    bagquan            @title : '{i18n>bagquan}';
    bagweight          @title : '{i18n>bagweight}';
    traint             @title : '{i18n>traint}';
    tradom             @title : '{i18n>tradom}';
    creation_timestamp @title : '{i18n>creation_timestamp}';
    tecnum             @title : '{i18n>tecnum}';
    cabnum             @title : '{i18n>cabnum}';
    capnum             @title : '{i18n>capnum}';
    cocnum             @title : '{i18n>cocnum}';
    ecavml             @title : '{i18n>ecavml}';
    ecbbml             @title : '{i18n>ecbbml}';
    ecblml             @title : '{i18n>ecblml}';
    ecchml             @title : '{i18n>ecchml}';
    ecdbml             @title : '{i18n>ecdbml}';
    ecfpml             @title : '{i18n>ecfpml}';
    ecgfml             @title : '{i18n>ecgfml}';
    echnml             @title : '{i18n>echnml}';
    ecksml             @title : '{i18n>ecksml}';
    eclcml             @title : '{i18n>eclcml}';
    eclfml             @title : '{i18n>eclfml}';
    eclsml             @title : '{i18n>eclsml}';
    ecmoml             @title : '{i18n>ecmoml}';
    ecnlml             @title : '{i18n>ecnlml}';
    ecorml             @title : '{i18n>ecorml}';
    ecrvml             @title : '{i18n>ecrvml}';
    ecsfml             @title : '{i18n>ecsfml}';
    ecvgml             @title : '{i18n>ecvgml}';
    ecvjml             @title : '{i18n>ecvjml}';
    ecvlml             @title : '{i18n>ecvlml}';
    ecvoml             @title : '{i18n>ecvoml}';
    bcavml             @title : '{i18n>bcavml}';
    bcbbml             @title : '{i18n>bcbbml}';
    bcblml             @title : '{i18n>bcblml}';
    bcchml             @title : '{i18n>bcchml}';
    bcdbml             @title : '{i18n>bcdbml}';
    bcfpml             @title : '{i18n>bcfpml}';
    bcgfml             @title : '{i18n>bcgfml}';
    bchnml             @title : '{i18n>bchnml}';
    bcksml             @title : '{i18n>bcksml}';
    bclcml             @title : '{i18n>bclcml}';
    bclfml             @title : '{i18n>bclfml}';
    bclsml             @title : '{i18n>bclsml}';
    bcmoml             @title : '{i18n>bcmoml}';
    bcnlml             @title : '{i18n>bcnlml}';
    bcorml             @title : '{i18n>bcorml}';
    bcrvml             @title : '{i18n>bcrvml}';
    bcsfml             @title : '{i18n>bcsfml}';
    bcvgml             @title : '{i18n>bcvgml}';
    bcvjml             @title : '{i18n>bcvjml}';
    bcvlml             @title : '{i18n>bcvlml}';
    bcvoml             @title : '{i18n>bcvoml}';
    umnr               @title : '{i18n>umnr}';
}

annotate cargorecord with {
    surrogatenum       @title : '{i18n>surrogatenum}';
    inflightno         @title : '{i18n>inflightno}';
    inorigin           @title : '{i18n>inorigin}';
    indestination      @title : '{i18n>indestination}';
    inscheddeptdate    @title : '{i18n>inscheddeptdate}';
    fosuffix           @title : '{i18n>fosuffix}';
    insupcarriercode2  @title : '{i18n>insupcarriercode2}';
    version            @title : '{i18n>version}';
    user_ind           @title : '{i18n>user_ind}';
    chgtottonn         @title : '{i18n>chgtottonn}';
    acttottonn         @title : '{i18n>acttottonn}';
    tottranstonn       @title : '{i18n>tottranstonn}';
    chgtotimptonn      @title : '{i18n>chgtotimptonn}';
    acttotimptonn      @title : '{i18n>acttotimptonn}';
    chgtotexptonn      @title : '{i18n>chgtotexptonn}';
    acttotexptonn      @title : '{i18n>acttotexptonn}';
    chgimploose        @title : '{i18n>chgimploose}';
    actimploose        @title : '{i18n>actimploose}';
    chgimpprepck       @title : '{i18n>chgimpprepck}';
    actimpprepck       @title : '{i18n>actimpprepck}';
    chgexploose        @title : '{i18n>chgexploose}';
    actexploose        @title : '{i18n>actexploose}';
    chgexpprepack      @title : '{i18n>chgexpprepack}';
    actexpprepack      @title : '{i18n>actexpprepack}';
    chgmailimport      @title : '{i18n>chgmailimport}';
    actmailimport      @title : '{i18n>actmailimport}';
    chgmailexport      @title : '{i18n>chgmailexport}';
    actmailexport      @title : '{i18n>actmailexport}';
    avichgtkg          @title : '{i18n>avichgtkg}';
    aviactkg           @title : '{i18n>aviactkg}';
    avinoawb           @title : '{i18n>avinoawb}';
    dgrchgtkg          @title : '{i18n>dgrchgtkg}';
    dgractkg           @title : '{i18n>dgractkg}';
    dgrnoawb           @title : '{i18n>dgrnoawb}';
    humchgkg           @title : '{i18n>humchgkg}';
    humactkg           @title : '{i18n>humactkg}';
    humnoawb           @title : '{i18n>humnoawb}';
    perchgkg           @title : '{i18n>perchgkg}';
    peractkg           @title : '{i18n>peractkg}';
    pernoawb           @title : '{i18n>pernoawb}';
    valchgkg           @title : '{i18n>valchgkg}';
    valactkg           @title : '{i18n>valactkg}';
    valnoawb           @title : '{i18n>valnoawb}';
    pilchgkg           @title : '{i18n>pilchgkg}';
    pilactkg           @title : '{i18n>pilactkg}';
    pilnoawb           @title : '{i18n>pilnoawb}';
    pefchgkg           @title : '{i18n>pefchgkg}';
    pefactkg           @title : '{i18n>pefactkg}';
    pefnoawb           @title : '{i18n>pefnoawb}';
    temchgkg           @title : '{i18n>temchgkg}';
    temactkg           @title : '{i18n>temactkg}';
    temnoawb           @title : '{i18n>temnoawb}';
    vunchgkg           @title : '{i18n>vunchgkg}';
    vunactkg           @title : '{i18n>vunactkg}';
    vunnoawb           @title : '{i18n>vunnoawb}';
    totawb             @title : '{i18n>totawb}';
    chgtransloose      @title : '{i18n>chgtransloose}';
    acttransloose      @title : '{i18n>acttransloose}';
    chgtransprepack    @title : '{i18n>chgtransprepack}';
    acttransprepack    @title : '{i18n>acttransprepack}';
    chgephloose        @title : '{i18n>chgephloose}';
    actephloose        @title : '{i18n>actephloose}';
    chgephprepack      @title : '{i18n>chgephprepack}';
    actephprepack      @title : '{i18n>actephprepack}';
    chgepdcgo          @title : '{i18n>chgepdcgo}';
    actepdcgo          @title : '{i18n>actepdcgo}';
    creation_timestamp @title : '{i18n>creation_timestamp}';
    chgimptonn         @title : '{i18n>chgimptonn}';
    chgexptonn         @title : '{i18n>chgexptonn}';
    chgtottranstonn    @title : '{i18n>chgtottranstonn}';
}

annotate routeplan with {
    surrogatenum      @title : '{i18n>surrogatenum}';
    inflightno        @title : '{i18n>inflightno}';
    inorigin          @title : '{i18n>inorigin}';
    indestination     @title : '{i18n>indestination}';
    inscheddeptdate   @title : '{i18n>inscheddeptdate}';
    fosuffix          @title : '{i18n>fosuffix}';
    insupcarriercode2 @title : '{i18n>insupcarriercode2}';
    lineno            @title : '{i18n>lineno}';
    cfpno             @title : '{i18n>cfpno}';
    routeno           @title : '{i18n>routeno}';
    countrycode       @title : '{i18n>countrycode}';
    airspdistnm       @title : '{i18n>airspdistnm}';
    airspdistm        @title : '{i18n>airspdistm}';
    airspdistkm       @title : '{i18n>airspdistkm}';
    deptapticao       @title : '{i18n>deptapticao}';
    arrapticao        @title : '{i18n>arrapticao}';
    tailno            @title : '{i18n>tailno}';
    entrydatelmt      @title : '{i18n>entrydatelmt}';
    entrytimelmt      @title : '{i18n>entrytimelmt}';
    entrydateutc      @title : '{i18n>entrydateutc}';
    entrytimeutc      @title : '{i18n>entrytimeutc}';
    exitdatelmt       @title : '{i18n>exitdatelmt}';
    exittimelmt       @title : '{i18n>exittimelmt}';
    exitdateutc       @title : '{i18n>exitdateutc}';
    exittimeutc       @title : '{i18n>exittimeutc}';
    amount            @title : '{i18n>amount}';
    rate              @title : '{i18n>rate}';
    currency          @title : '{i18n>currency}';
    entrypoint        @title : '{i18n>entrypoint}';
    exitpoint         @title : '{i18n>exitpoint}';
    entryway          @title : '{i18n>entryway}';
    exitway           @title : '{i18n>exitway}';
    chargetype        @title : '{i18n>chargetype}';
    provid            @title : '{i18n>provid}';
    gcd               @title : '{i18n>gcd}';
}

annotate accommodation with {
    surrogatenum      @title : '{i18n>surrogatenum}';
    inflightno        @title : '{i18n>inflightno}';
    inorigin          @title : '{i18n>inorigin}';
    indestination     @title : '{i18n>indestination}';
    inscheddeptdate   @title : '{i18n>inscheddeptdate}';
    fosuffix          @title : '{i18n>fosuffix}';
    insupcarriercode2 @title : '{i18n>insupcarriercode2}';
    carriercode       @title : '{i18n>carriercode}';
    flightno          @title : '{i18n>flightno}';
    origin            @title : '{i18n>origin}';
    destination       @title : '{i18n>destination}';
    scheddeptdateutc  @title : '{i18n>scheddeptdateutc}';
    ccsmsgref         @title : '{i18n>ccsmsgref}';
    scheddeptdate     @title : '{i18n>scheddeptdate}';
    vendor            @title : '{i18n>vendor}';
    actarrdateutc     @title : '{i18n>actarrdateutc}';
    actarrdate        @title : '{i18n>actarrdate}';
    servcode          @title : '{i18n>servcode}';
    reservedate       @title : '{i18n>reservedate}';
    rmntsqty          @title : '{i18n>rmntsqty}';
    allowamt          @title : '{i18n>allowamt}';
    currency          @title : '{i18n>currency}';
}


annotate catering with {
    surrogatenum        @title : '{i18n>surrogatenum}';
    inflightno          @title : '{i18n>inflightno}';
    inorigin            @title : '{i18n>inorigin}';
    indestination       @title : '{i18n>indestination}';
    inscheddeptdate     @title : '{i18n>inscheddeptdate}';
    fosuffix            @title : '{i18n>fosuffix}';
    insupcarriercode2   @title : '{i18n>insupcarriercode2}';
    carriercode         @title : '{i18n>carriercode}';
    origin              @title : '{i18n>origin}';
    destination         @title : '{i18n>destination}';
    classtype           @title : '{i18n>classtype}';
    sapmeal             @title : '{i18n>sapmeal}';
    exdescription       @title : '{i18n>exdescription}';
    paxqun              @title : '{i18n>paxqun}';
    unitofmesur         @title : '{i18n>unitofmesur}';
    exmenucode          @title : '{i18n>exmenucode}';
    exmenudesc          @title : '{i18n>exmenudesc}';
    salescat            @title : '{i18n>salescat}';
    pricerel            @title : '{i18n>pricerel}';
    mealfact            @title : '{i18n>mealfact}';
    quant               @title : '{i18n>quant}';
    netprice            @title : '{i18n>netprice}';
    grossgross          @title : '{i18n>grossgross}';
    custdiscount        @title : '{i18n>custdiscount}';
    netamont            @title : '{i18n>netamont}';
    airportfee          @title : '{i18n>airportfee}';
    airportfeevat       @title : '{i18n>airportfeevat}';
    gstvat              @title : '{i18n>gstvat}';
    consumptiontax      @title : '{i18n>consumptiontax}';
    surchargeamount     @title : '{i18n>surchargeamount}';
    vatp                @title : '{i18n>vatp}';
    gipba               @title : '{i18n>gipba}';
    totalamount         @title : '{i18n>totalamount}';
    currency            @title : '{i18n>currency}';
    invoicetype         @title : '{i18n>invoicetype}';
    custdiscount_perc   @title : '{i18n>custdiscount_perc}';
    airportfee_perc     @title : '{i18n>airportfee_perc}';
    gstvat_perc         @title : '{i18n>gstvat_perc}';
    surcharge_perc      @title : '{i18n>surcharge_perc}';
    consumptiontax_perc @title : '{i18n>consumptiontax_perc}';
}
 