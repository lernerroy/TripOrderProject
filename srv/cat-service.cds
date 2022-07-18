using {com.legstate.triporder as trips} from '../db/data-model';
using {sap.common.Countries as commonCountries} from '@sap/cds/common';
using {sap.common.Languages as commonLanguages} from '@sap/cds/common';
using {sap.common.Currencies as commonCurrencies} from '@sap/cds/common';


@path : '/browse'
service TripService {
    entity triprecord
                             // @(restrict: [ { grant: ['*'], to: ['Admin','User']},
                             //              { grant: ['READ','WRITE'], to: ['API_user']} ])
                             as projection on trips.triprecord;

    entity triprecordStaging
                             // @(restrict: [ { grant: ['*'], to: ['Admin','User']},
                             //              { grant: ['READ','WRITE'], to: ['API_user']} ])
                             as projection on trips.triprecordStaging;

    entity triplog
                             // @(restrict: [ { grant: ['*'], to: ['Admin','User']},
                             //              { grant: ['READ','WRITE'], to: ['API_user']} ])
                             as projection on trips.triplogCurrent;

    entity triplogAll
                             // @(restrict: [ { grant: ['*'], to: ['Admin','User']},
                             //              { grant: ['READ','WRITE'], to: ['API_user']} ])
                             as projection on trips.triplogAll;

    entity pax
                             // @(restrict: [ { grant: ['*'], to: ['Admin','User']},
                             //              { grant: ['READ','WRITE'], to: ['API_user']} ])
                             as projection on trips.passenger;

    entity paxStaging
                             // @(restrict: [ { grant: ['*'], to: ['Admin','User']},
                             //              { grant: ['READ','WRITE'], to: ['API_user']} ])
                             as projection on trips.passengerStaging;

    // entity passengerrecord
    // // @(restrict: [ { grant: ['*'], to: ['Admin','User']},
    // //              { grant: ['READ','WRITE'], to: ['API_user']} ])
    // as projection on trips.passengerrecord;

    entity cargorecord
                             // @(restrict: [ { grant: ['*'], to: ['Admin','User']},
                             //              { grant: ['READ','WRITE'], to: ['API_user']} ])
                             as projection on trips.cargorecord;

    entity cargorecordStaging
                             // @(restrict: [ { grant: ['*'], to: ['Admin','User']},
                             //              { grant: ['READ','WRITE'], to: ['API_user']} ])
                             as projection on trips.cargorecordStaging;

    entity routeplan
                             // @(restrict: [ { grant: ['*'], to: ['Admin','User']},
                             //              { grant: ['READ','WRITE'], to: ['API_user']} ])
                             as projection on trips.routeplan;

    entity routeplanStaging
                             // @(restrict: [ { grant: ['*'], to: ['Admin','User']},
                             //              { grant: ['READ','WRITE'], to: ['API_user']} ])
                             as projection on trips.routeplanStaging;

    entity accommodation @(restrict : [
        {
            grant : ['*'],
            to    : [
                'Admin',
                'User'
            ]
        },
        {
            grant : [
                'READ',
                'WRITE'
            ],
            to    : ['API_user']
        }
    ])                       as projection on trips.accommodation;

    entity catering
                             // @(restrict: [ { grant: ['*'], to: ['Admin','User']},
                             //              { grant: ['READ','WRITE'], to: ['API_user']} ])
                             as projection on trips.catering;

    entity cateringStaging
                             // @(restrict: [ { grant: ['*'], to: ['Admin','User']},
                             //              { grant: ['READ','WRITE'], to: ['API_user']} ])
                             as projection on trips.cateringStaging;
    
    entity aircraftTypeGroup 
    // @(restrict: [ { grant: ['*'], to: ['Admin','User']},
    //              { grant: ['READ','WRITE'], to: ['API_user']} ])
    as projection on trips.aircraftTypeGroup;

    // Views
    //////////////////////////////////////////////////////////////////////
    entity cockpitTripsActuals @(restrict : [
        {
            grant : ['*'],
            to    : [
                'Admin',
                'User'
            ]
        },
        {
            grant : ['READ'],
            to    : ['API_user']
        }
    ])                       as projection on TripService.cockpitTrips;
    //////////////////////////////////////////////////////////////////////

    // TripRecord
    //////////////////////////////////////////////////////////////////////
    entity Carriers @(restrict : [
        {
            grant : ['*'],
            to    : [
                'Admin',
                'User'
            ]
        },
        {
            grant : ['READ'],
            to    : ['API_user']
        }
    ])                       as projection on trips.Carriers;

    entity Airports @(restrict : [
        {
            grant : ['*'],
            to    : [
                'Admin',
                'User'
            ]
        },
        {
            grant : ['READ'],
            to    : ['API_user']
        }
    ])                       as projection on trips.Airports;

    entity Legstates @(restrict : [
        {
            grant : ['*'],
            to    : ['Admin']
        },
        {
            grant : ['READ'],
            to    : [
                'API_user',
                'User'
            ]
        }
    ])                       as projection on trips.Legstates;

    entity TailRegistrations @(restrict : [
        {
            grant : ['*'],
            to    : ['Admin']
        },
        {
            grant : ['READ'],
            to    : [
                'API_user',
                'User'
            ]
        }
    ])
    as projection on trips.TailRegistrations;
    //////////////////////////////////////////////////////////////////////


    // Common
    //////////////////////////////////////////////////////////////////////
    entity Languages @(restrict : [
        {
            grant : ['*'],
            to    : ['Admin']
        },
        {
            grant : ['READ'],
            to    : [
                'API_user',
                'User'
            ]
        }
    ])                       as projection on commonLanguages;

    entity Countries @(restrict : [
        {
            grant : ['*'],
            to    : ['Admin']
        },
        {
            grant : ['READ'],
            to    : [
                'API_user',
                'User'
            ]
        }
    ])                       as projection on commonCountries;

    entity Currencies @(restrict : [
        {
            grant : ['*'],
            to    : ['Admin']
        },
        {
            grant : ['READ'],
            to    : [
                'API_user',
                'User'
            ]
        }
    ])                       as projection on commonCurrencies;
    //////////////////////////////////////////////////////////////////////

    action processMessage(trips : array of triplog);
    action processMessagesIn(status : String) returns array of triplog;
    action resetMessage(trips : array of triplog);
};


define view TripService.cockpitTrips as(
    select
        flo.surrogatenum    as aufnr,
        flo.tailno          as zztailno,
        flo.flightno        as zzflightno,
        flo.aircrafttype    as zzaircrafttype,
        flo.carriercode     as zzcarriercode,
        flo.supcarriercode  as zzsupcarriercode,
        flo.supcarriercode2 as zzsupcarriercode2,
        flo.actdeptdate     as zzscheddeptdate,
        flo.actdepttime     as zzscheddepttime,
        flo.actarrdate      as zzschedarrdate,
        flo.actarrtime      as zzschedarrtime,
        flo.actdeptapt      as zzscheddeptapt,
        flo.actarrapt       as zzschedarrapt,
        flo.actarrts        as zzschedarrts,
        flo.actdeptts       as zzscheddeptts,
        flo.cfpno1          as zzcfpno1,
        flo.legstate        as zzlegstate,
        flo.origin          as zzorigin,
        flo.destination     as zzdestination,
        flo.scheddeptdate   as zzrealscheddept,
        max(
            user_cargo.creation_timestamp
        )                   as user_creation_timestamp : Decimal(15, 0),
        max(
            intf_cargo.creation_timestamp
        )                   as intf_creation_timestamp : Decimal(15, 0),
        max(
            user_pax.creation_timestamp
        )                   as pax_user_creation_ts    : Decimal(15, 0),
        max(
            intf_pax.creation_timestamp
        )                   as pax_intf_creation_ts    : Decimal(15, 0)
    from TripService.triprecord as flo
    left join TripService.pax as intf_pax
        on  flo.surrogatenum  = intf_pax.surrogatenum
        or (
                flo.supcarriercode2.code = intf_pax.carriercode.code
            and flo.flightno             = intf_pax.inflightno
            and flo.origin.code          = intf_pax.inorigin
            and flo.destination.code     = intf_pax.indestination
            and flo.scheddeptdate        = intf_pax.inscheddeptdate
        )
        and intf_pax.user_ind = false
    left join TripService.pax as user_pax
        on  flo.surrogatenum  = user_pax.surrogatenum
        or (
                flo.supcarriercode2.code = user_pax.carriercode.code
            and flo.flightno             = user_pax.inflightno
            and flo.origin.code          = user_pax.inorigin
            and flo.destination.code     = user_pax.indestination
            and flo.scheddeptdate        = user_pax.inscheddeptdate
        )
        and user_pax.user_ind = true
    left join TripService.cargorecord as user_cargo
        on  flo.surrogatenum    = user_cargo.surrogatenum
        or (
                flo.supcarriercode2.code = user_cargo.insupcarriercode2
            and flo.flightno             = user_cargo.inflightno
            and flo.origin.code          = user_cargo.inorigin
            and flo.destination.code     = user_cargo.indestination
            and flo.scheddeptdate        = user_cargo.inscheddeptdate
        )
        and user_cargo.user_ind = true
    left join TripService.cargorecord as intf_cargo
        on  flo.surrogatenum    = intf_cargo.surrogatenum
        or (
                flo.supcarriercode2.code = intf_cargo.insupcarriercode2
            and flo.flightno             = intf_cargo.inflightno
            and flo.origin.code          = intf_cargo.inorigin
            and flo.destination.code     = intf_cargo.indestination
            and flo.scheddeptdate        = intf_cargo.inscheddeptdate
        )
        and user_cargo.user_ind = false
    group by
        flo.surrogatenum,
        flo.tailno,
        flo.flightno,
        flo.aircrafttype,
        flo.carriercode,
        flo.supcarriercode,
        flo.supcarriercode2,
        flo.actdeptdate,
        flo.actdepttime,
        flo.actarrdate,
        flo.actarrtime,
        flo.actdeptapt,
        flo.actarrapt,
        flo.actarrts,
        flo.actdeptts,
        flo.cfpno1,
        flo.legstate,
        flo.origin,
        flo.destination,
        flo.scheddeptdate
    order by
        zzschedarrdate,
        zzschedarrtime,
        zzschedarrapt
);

annotate TripService.TailRegistrations with {
    ID /*@title : '{i18n>trID}'*/;
    tailNo @title : '{i18n>tailNo}';
    aircraftType @title : '{i18n>aircraft_type}';
    ac_seat_config @title : '{i18n>ac_seat_config}';
    ac_type_iata @title : '{i18n>ac_type_iata}';
    ac_type_iatag @title : '{i18n>ac_type_iatag}';
    ac_type_icao @title : '{i18n>ac_type_icao}';
    mtow_kg @title : '{i18n>mtow_kg}';
    mtow_t @title : '{i18n>mtow_t}';
    amtow1_kg @title : '{i18n>amtow1_kg}';
    amtow2_kg @title : '{i18n>amtow2_kg}';
    mtw_kg @title : '{i18n>mtw_kg}';
    amtw_kg @title : '{i18n>amtw_kg}';
    mlw_kg @title : '{i18n>mlw_kg}';
    full_cgo_cap @title : '{i18n>full_cgo_cap}';
    eev_kg @title : '{i18n>eev_kg}';
    wingspan_m @title : '{i18n>wingspan_m}';
    length_m @title : '{i18n>length_m}';
    icao_noise_cat_takeoff @title : '{i18n>icao_noise_cat_takeoff}';
    icao_noise_cat_landing @title : '{i18n>icao_noise_cat_landing}';
    icao_chap3_noise_level @title : '{i18n>icao_chap3_noise_level}';
    icao_chap4_noise_level @title : '{i18n>icao_chap4_noise_level}';
    icao_annex16_chp @title : '{i18n>icao_annex16_chp}';
    nri_noise_category @title : '{i18n>nri_noise_category}';
    aci_noise_rate_ind_mtow @title : '{i18n>aci_noise_rate_ind_mtow}';
    aci_noise_rate_ind_amtow @title : '{i18n>aci_noise_rate_ind_amtow}';
    engine_app_noise_level @title : '{i18n>engine_app_noise_level}';
    engine_app_noise_limit @title : '{i18n>engine_app_noise_limit}';
    engine_side_noise_level @title : '{i18n>engine_side_noise_level}';
    engine_side_noise_limit @title : '{i18n>engine_side_noise_limit}';
    noise_level_start_takeoff @title : '{i18n>noise_level_start_takeoff}';
    noise_limit_start_takeoff @title : '{i18n>noise_limit_start_takeoff}';
    pax_or_frt @title : '{i18n>pax_or_frt}';
    fcl_seat_cap @title : '{i18n>fcl_seat_cap}';
    jcl_seat_cap @title : '{i18n>jcl_seat_cap}';
    pey_seat_cap @title : '{i18n>pey_seat_cap}';
    ycl_seat_cap @title : '{i18n>ycl_seat_cap}';
    tot_seat_cap @title : '{i18n>tot_seat_cap}';
    ac_operator @title : '{i18n>ac_operator}';
    body_type @title : '{i18n>body_type}';
    number_engines @title : '{i18n>number_engines}';
    engine_type @title : '{i18n>engine_type}';
    zero_fuel_weight @title : '{i18n>zero_fuel_weight}';
    euwgtfctr1 @title : '{i18n>euwgtfctr1}';
    euwgtfctr2 @title : '{i18n>euwgtfctr2}';
    acoustic_grp @title : '{i18n>acoustic_grp}';
    bulk_ac @title : '{i18n>bulk_ac}';
    eev_kg_arn @title : '{i18n>eev_kg_arn}';
    ac_total_arn @title : '{i18n>ac_total_arn}';
    lto_fuel @title : '{i18n>lto_fuel}';
    nox_tp_maint @title : '{i18n>nox_tp_maint}';
    amtow1_t @title : '{i18n>amtow1_t}';
    amtow2_t @title : '{i18n>amtow2_t}';
    engine_takeoff_noise_lvl @title : '{i18n>engine_takeoff_noise_lvl}';
}

annotate TripService.triprecord with {
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

annotate TripService.pax with {
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

annotate TripService.cargorecord with {
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

annotate TripService.routeplan with {
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

annotate TripService.accommodation with {
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


annotate TripService.catering with {
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

annotate aircraftTypeGroup with {
    aircraft_type @title : '{i18n>aircraft_type}';
    aircraft_group @title: '{i18n>aircraft_group}';
};
