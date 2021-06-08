using { com.legstate.triporder as trips } from '../db/data-model';

annotate trips with @(requires: ['system-user','API_user','User']);

annotate trips.triprecord with @(restrict: [
  { grant: ['READ','WRITE'], to: 'API_user' }, 
  { grant: ['READ'], to: 'User' },
  { grant: ['WRITE'], to: 'system-user' }
]);


@path:'/browse'
//@impl: './trip-service.js'    
//@requires: 'authenticated-user'
service TripService 
{
    entity triprecord // @(restrict: [ { grant: ['*'], to: 'trip_order'}]) 
    as projection on trips.triprecord;
    entity cargorecord  //@(restrict: [ { grant: ['*'], to: 'trip_order'}])
    as projection on trips.cargorecord;
    entity catering //@(restrict: [ { grant: ['*'], to: 'trip_order'}]) 
    as projection on trips.catering;
    entity pax //@(restrict: [ { grant: ['*'], to: 'trip_order'}]) 
    as projection on trips.passenger;
    entity routeplan //@(restrict: [ { grant: ['*'], to: 'trip_order'}]) 
    as projection on trips.routeplan;  
    entity accommodation //@(restrict: [ { grant: ['*'], to: 'trip_order'}]) 
    as projection on trips.accommodation;
};

