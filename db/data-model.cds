namespace com.legstate.triporder;
using { managed } from '@sap/cds/common';
using { Currency } from '@sap/cds/common';
using { Country } from '@sap/cds/common';
using { cuid } from '@sap/cds/common';
using { sap.common.CodeList } from '@sap/cds/common';
using { sap.common.Countries } from '@sap/cds/common';
using { sap.common.Languages } from '@sap/cds/common';
using { sap.common.Currencies } from '@sap/cds/common';


// Domains
//////////////////////////////////////////////////////////////////////
entity LoadingStationCodes : CodeList, managed{
    key code : String(2)      @(title : '{i18n>catloadstatcode}');
};
entity Coord_signs : CodeList, managed{
    key code : String(1)         @(title : '{i18n>coord_sign_code}');
};
//////////////////////////////////////////////////////////////////////

// Tables
//////////////////////////////////////////////////////////////////////
entity Carriers : CodeList, managed {
    key code : String(2)             @title : '{i18n>supcarriercode}';
};

entity Legstates : CodeList, managed {
    key code        : String(3)               @title : '{i18n>legstate}';
    stonr           : String(2)               @title : '{i18n>stonr}';
    finalLegstate   : Boolean  default false  @title : '{i18n>finalLegstate}';
};

entity Airports : CodeList, managed{
    key code         : String(3)             @title : '{i18n>aptcd}';
    aptcd_icao       : String(4)             @title : '{i18n>aptcd_icao}';
    online_ind       : Boolean               @title : '{i18n>online_ind}';
    company_ind      : Boolean               @title : '{i18n>company_ind}';
    fo_po_days       : Integer               @title : '{i18n>fo_po_days}';
    country_code     : association to one Countries              @title : '{i18n>country_code}';
    ekgrp            : String(3)             @title : '{i18n>ekgrp}';
    catloadstat      : loadingStationCode    @title : '{i18n>catloadstatcode}';
    catgroundime     : String(4)             @title : '{i18n>catgroundime}';
    lat_coord        : Decimal(16,14)        @title : '{i18n>lat_coord}';
    lon_coord        : Decimal(16,14)        @title : '{i18n>lon_coord}';
    lat_coord_sign   : coord_sign @title : '{i18n>lat_coord_sign}';
    lon_coord_sign   : coord_sign @title : '{i18n>lon_coord_sign}';
};
//////////////////////////////////////////////////////////////////////

// Types
//////////////////////////////////////////////////////////////////////
type airportCode : Association to Airports { code }; //airportCodes;
type loadingStationCode : Association to LoadingStationCodes;
type coord_sign : Association to Coord_signs;
type legstate : Association to Legstates { code };
type carriercode : Association to Carriers { code };
//////////////////////////////////////////////////////////////////////



// Trip Record Entities
//////////////////////////////////////////////////////////////////////

aspect surrogatenum {
    key surrogatenum      : String(23);
};
aspect recordsKey : managed { // key ID to be reused in other entities 
    Key insupcarriercode2 : String(2);
    Key inflightno        : String(4);
    key inorigin          : String(3);
    key indestination     : String(3);
    key inscheddeptdate   : Date;
    fosuffix              : String(2);
};
aspect aufnr {
    aufnr      : String(12);
};


//@cds.persistence.exists
aspect triprecorddetails : recordsKey, surrogatenum, aufnr {
    supcarriercode2     : carriercode; //String(2);
    scheddeptdate       : Date;
    flightno            : String(4);
    supcarriercode      : carriercode; //String(2);
    carriercode         : carriercode; //String(2);
    origin              : airportCode; //String(3);
    destination         : airportCode; //String(3);
    repeatno            : String(3);
    idooutc             : Date;
    idoo                : Date;
    doo                 : Date;
    dooutc              : Date;
    actarrapt           : airportCode; //String(3);
    actarrapticao       : String(4);
    actdeptapt          : airportCode; //String(3);
    actdeptapticao      : String(4);
    legstate            : legstate; // String(3); // / 
    aircrafttype        : String(3);
    aircrafttypecpa     : String(3);
    tailno              : String(8);
    flighttype          : String(1);
    deptparkposn        : String(10);
    actgatetime         : Integer;
    servicetype         : String(1);
    delayreason1        : String(3);
    delayreason2        : String(3);
    delayreason3        : String(3);
    delayreason4        : String(3);
    delayreason5        : String(3);
    actualflyingdur     : Integer;
    scheddepttime       : Time;
    scheddeptts         : Decimal(15,0);
    actdeptts           : Decimal(15,0);
    takeoffdate         : Date;
    takeofftime         : Time;
    touchdndate         : Date;
    touchdntime         : Time;
    actdeptdate         : Date;
    actdepttime         : Time;
    actarrdate          : Date;
    actarrtime          : Time;
    takeoffdateutc      : Date;
    takeofftimeutc      : Time;
    touchdndateutc      : Date;
    touchdntimeutc      : Time;
    actdeptdateutc      : Date;
    actdepttimeutc      : Time;
    actarrdateutc       : Date;
    actarrtimeutc       : Time;
    scheddeptdateutc    : Date;
    scheddepttimeutc    : Time;
    schedarrdateutc     : Date;
    schedarrtimeutc     : Time;
    schedarrdate        : Date;
    schedarrtime        : Time;
    schedarrts          : Decimal(15,0);
    actarrts            : Decimal(15,0);
    estdeptdate         : Date;
    estdepttime         : Time;
    estdeptdateutc      : Date;
    estdepttimeutc      : Time;
    estarrdateutc       : Date;
    estarrtimeutc       : Time;
    estarrdate          : Date;
    estarrtime          : Time;
    planblocktime       : Integer;
    schedarrapticao     : String(4);
    schedarrapt         : airportCode; //String(3);String(3);
    scheddeptapticao    : String(4);
    scheddeptapt        : airportCode; //String(3);String(3);
    flight_tm           : Integer;
    arr_stand           : String(10);
    dep_terminal        : String(4);
    arr_terminal        : String(4);
    onblockdate         : Date;
    onblocktime         : Time;
    offblockdate        : Date;
    offblocktime        : Time;
    taxi_out_time       : Integer;
    route               : String(10);
    cfpno1              : String(10);
    cfpno2              : String(10);
};

entity triprecord : triprecorddetails{};
entity triprecordStaging : triprecorddetails{
    key creation_timestamp : Timestamp @(title : '{i18n>timestamp}');
};

entity triplog : recordsKey, surrogatenum {
    //status : Decimal(2,0) @(title : '{i18n>status}') ;
    status: Status @(title : '{i18n>status}');
    // status: Association to Status @(title : '{i18n>status}');
    //messagetext : String @(title : '{i18n>messagetext}');
    key creation_timestamp : Timestamp @(title : '{i18n>timestamp}');
    key logtype: logType @(title: '{i18n>logtype}');
};

@cds.autoexpose
type Status : Decimal(2,0)
    enum {          
        ReadyForProcessing = 64; 
        Error = 51; 
        Warning = 52; 
        Processed = 53;
        };

@cds.autoexpose
type logType : String
    enum {
        Trip = '1';
        Passenger = '2';
        Cargo = '3';
        RoutePlan = '4';
        Catering = '5';
    }

// @cds.autoexpose
// entity Status {
//     key code     : Decimal(2, 0) @title: '{i18n>status}';
//         text     : localized String(255) @title : '{i18n>messagetext}';
//         sequence : Integer;
// };

//@cds.persistence.exists
entity passengerdetails : recordsKey, surrogatenum {
    carriercode     : carriercode; //String(4);
    version         : Integer;
    user_ind        : String(1);
    firstclasspax   : Decimal(3,0);
    busclasspax     : Decimal(3,0);
    premecopax      : Decimal(3,0);
    ecopax          : Decimal(3,0);
    totalpax        : Decimal(3,0);
    revpaxfirst     : Decimal(3,0);
    revpaxbus       : Decimal(3,0);
    revpaxpreco     : Decimal(3,0);
    revpaxeco       : Decimal(3,0);
    revpaxtot       : Decimal(3,0);
    nrevpaxfirst    : Decimal(3,0);
    nrevpaxbus      : Decimal(3,0);
    nrevpaxpreco    : Decimal(3,0);
    nrevpaxeco      : Decimal(3,0);
    nrevpaxtot      : Decimal(3,0);
    chdpax          : Decimal(3,0);
    infpax          : Decimal(3,0);
    wchpax          : Decimal(3,0);
    wchc            : Decimal(3,0);
    wchs            : Decimal(3,0);
    wchr            : Decimal(3,0);
    wcbd            : Decimal(3,0);
    wcbw            : Decimal(3,0);
    wcmp            : Decimal(3,0);
    wcob            : Decimal(3,0);
    wclb            : Decimal(3,0);
    boardpax        : Decimal(3,0);
    transitpax      : Decimal(3,0);
    transferpax     : Decimal(3,0);
    bagquan         : Decimal(8,0);
    bagweight       : Decimal(8,2);
    traint          : Decimal(3,0);
    tradom          : Decimal(3,0);
    creation_timestamp : Decimal(15,0);
    tecnum          : Integer;
    cabnum          : Integer;
    capnum          : Integer;
    cocnum          : Integer;
    ecavml          : Integer;
    ecbbml          : Integer;
    ecblml          : Integer;
    ecchml          : Integer;
    ecdbml          : Integer;
    ecfpml          : Integer;
    ecgfml          : Integer;
    echnml          : Integer;
    ecksml          : Integer;
    eclcml          : Integer;
    eclfml          : Integer;
    eclsml          : Integer;
    ecmoml          : Integer;
    ecnlml          : Integer;
    ecorml          : Integer;
    ecrvml          : Integer;
    ecsfml          : Integer;
    ecvgml          : Integer;
    ecvjml          : Integer;
    ecvlml          : Integer;
    ecvoml          : Integer;
    bcavml          : Integer;
    bcbbml          : Integer;
    bcblml          : Integer;
    bcchml          : Integer;
    bcdbml          : Integer;
    bcfpml          : Integer;
    bcgfml          : Integer;
    bchnml          : Integer;
    bcksml          : Integer;
    bclcml          : Integer;
    bclfml          : Integer;
    bclsml          : Integer;
    bcmoml          : Integer;
    bcnlml          : Integer;
    bcorml          : Integer;
    bcrvml          : Integer;
    bcsfml          : Integer;
    bcvgml          : Integer;
    bcvjml          : Integer;
    bcvlml          : Integer;
    bcvoml          : Integer;
    umnr            : Integer;
};
entity passenger : passengerdetails{};
entity passengerStaging : passengerdetails{
    key creation_timestamp : Timestamp @(title : '{i18n>timestamp}');
};

//@cds.persistence.exists
entity cargorecorddetails : recordsKey, surrogatenum {
    version             : String(3);
    user_ind            : String(1);
    //flightinddate       : Date;
    chgtottonn          : Decimal(8,2);
    acttottonn          : Decimal(8,2);
    tottranstonn        : Decimal(8,2);
    chgtotimptonn       : Decimal(8,2);
    acttotimptonn       : Decimal(8,2);
    chgtotexptonn       : Decimal(8,2);
    acttotexptonn       : Decimal(8,2);
    chgimploose         : Decimal(8,2);
    actimploose         : Decimal(8,2);
    chgimpprepck        : Decimal(8,2);
    actimpprepck        : Decimal(8,2);
    chgexploose         : Decimal(8,2);
    actexploose         : Decimal(8,2);
    chgexpprepack       : Decimal(8,2);
    actexpprepack       : Decimal(8,2);
    chgmailimport       : Decimal(8,2);
    actmailimport       : Decimal(8,2);
    chgmailexport       : Decimal(8,2);
    actmailexport       : Decimal(8,2);
    avichgtkg           : Decimal(8,2);
    aviactkg            : Decimal(8,2);
    avinoawb            : Decimal(8,0);
    dgrchgtkg           : Decimal(8,2);
    dgractkg            : Decimal(8,2); 
    dgrnoawb            : Decimal(8,2);
    humchgkg            : Decimal(8,2);
    humactkg            : Decimal(8,2);
    humnoawb            : Decimal(8,0);
    perchgkg            : Decimal(8,2);
    peractkg            : Decimal(8,2);
    pernoawb            : Decimal(8,0);
    valchgkg            : Decimal(8,2);
    valactkg            : Decimal(8,2);
    valnoawb            : Decimal(8,0); // last copied
    pilchgkg            : Decimal(8,2);
    pilactkg            : Decimal(8,2);
    pilnoawb            : Decimal(8,0);
    pefchgkg            : Decimal(8,2);
    pefactkg            : Decimal(8,2);
    pefnoawb            : Decimal(8,2);
    temchgkg            : Decimal(8,2);
    temactkg            : Decimal(8,2);
    temnoawb            : Decimal(8,2);
    vunchgkg            : Decimal(8,2);
    vunactkg            : Decimal(8,2);
    vunnoawb            : Decimal(8,2);
    totawb              : Decimal(8,2);
    chgtransloose       : Decimal(8,2);
    acttransloose       : Decimal(8,2);
    chgtransprepack     : Decimal(8,2);
    acttransprepack     : Decimal(8,2);
    chgephloose         : Decimal(8,2);
    actephloose         : Decimal(8,2);
    chgephprepack       : Decimal(8,2);
    actephprepack       : Decimal(8,2);
    chgepdcgo           : Decimal(8,2);
    actepdcgo           : Decimal(8,2);
    creation_timestamp  : Decimal(15,0);
    chgimptonn          : Decimal(8,2);
    chgexptonn          : Decimal(8,2);
    chgtottranstonn     : Decimal(8,2);
};

entity cargorecord : cargorecorddetails{};
entity cargorecordStaging : cargorecorddetails{
    key creation_timestamp : Timestamp @(title : '{i18n>timestamp}');
};

//@cds.persistence.exists
entity routeplanDetails : recordsKey, surrogatenum {
    key lineno              : String(3);
    key cfpno               : String(15);
    routeno                 : String(4);
    countrycode             : String(250);
    airspdistnm             : String(6);
    airspdistm              : String(12);
    airspdistkm             : String(6);
    elapsedtime             : String(6);
    deptapticao             : String(4);
    arrapticao              : String(4);
    tailno                  : String(8);
    entrydatelmt            : Date;
    entrytimelmt            : Time;
    entrydateutc            : Date;
    entrytimeutc            : Time;
    exitdatelmt             : Date;
    exittimelmt             : Time;
    exitdateutc             : Date;
    exittimeutc             : Time;
    amount                  : Decimal(11,2);
    rate                    : Decimal(11,2);
    currency                : Currency; //String(5);;
    entrypoint              : String(10);
    exitpoint               : String(10);
    entryway                : String(10);
    exitway                 : String(10);
    chargetype              : String(2);
    provid                  : String(2);
    gcd                     : Decimal(8,0);
};

entity routeplan : routeplanDetails{};
entity routeplanStaging : routeplanDetails{
    key creation_timestamp : Timestamp @(title : '{i18n>timestamp}');
};

//@cds.persistence.exists
entity accommodation : recordsKey, surrogatenum {
    carriercode         : carriercode; //String(2);
    flightno            : String(4);
    origin              : airportCode; //String(3);
    destination         : airportCode; //String(3);
    scheddeptdateutc    : Date;
    ccsmsgref           : String(23);
    scheddeptdate       : Date;           
    vendor              : String(10); // data element->ZEFO_VENDOR ?
    actarrdateutc       : Date;
    actarrdate          : Date;
    servcode            : String(18);
    reservedate         : Date;
    rmntsqty            : Integer;
    allowamt            : Decimal(11,2);
    currency            : Currency; //String(5);
};


//@cds.persistence.exists
entity cateringdetails : recordsKey, surrogatenum {
    carriercode     : carriercode; //String(2);
    origin          : airportCode; //String(3);
    destination     : airportCode; //String(3);
    classtype       : String(10);
    sapmeal         : String(18);
    exdescription   : String(100);
    paxqun          : Decimal(3,0);
    unitofmesur     : String(3); // unit 
    exmenucode      : String(100); // curr 
    exmenudesc      : String(200); // curr 
    salescat        : String(50); // curr
    pricerel        : String(1); // curr 
    mealfact        : String(1);// curr 
    quant           : Decimal(13,3);// curr 
    netprice        : Decimal(11,2);// curr 
    grossgross      : Decimal(11,2);// curr 
    custdiscount    : Decimal(11,2);// curr 
    netamont        : Decimal(11,2);// curr 
    airportfee      : Decimal(11,2);// curr 
    airportfeevat   : Decimal(11,2);// curr
    gstvat          : Decimal(11,2);// curr 
    consumptiontax  : Decimal(11,2);// curr 
    surchargeamount : Decimal(11,2);// curr 
    vatp            : Decimal(11,2);// curr 
    gipba           : Decimal(11,2);// curr 
    totalamount     : Decimal(11,2);// curr 
    currency        : Currency; // String(5); // currency key
    invoicetype     : String(2);
    custdiscount_perc : String(3);
    airportfee_perc : String(3);
    gstvat_perc     : String(3);
    surcharge_perc  : String(3);
    consumptiontax_perc : String(3);
};

entity catering : cateringdetails{};
entity cateringStaging : cateringdetails{
    key creation_timestamp : Timestamp @(title : '{i18n>timestamp}');
};