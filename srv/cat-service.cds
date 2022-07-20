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
    entity aircraftTypeGroup @(restrict : [
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
    ]) as projection on trips.aircraftTypeGroup;

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
    action manualProcessMessage(trips: array of triplog);
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