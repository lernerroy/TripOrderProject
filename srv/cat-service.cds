using {com.legstate.triporder as trips} from '../db/data-model';
using { sap.common.Countries } from '@sap/cds/common';
using { sap.common.Languages } from '@sap/cds/common';
using { sap.common.Currencies } from '@sap/cds/common';


/*annotate trips with @(requires : [
    'system-user',
    'API_user',
    'User'
]);*/

annotate trips.triprecord with @(restrict : [
    {
        grant : [
            'READ',
            'WRITE'
        ],
        to    : 'API_user'
    },
    {
        grant : ['READ'],
        to    : 'User'
    },
    {
        grant : ['WRITE'],
        to    : 'system-user'
    }
]);

@path : '/browse'
//@impl: './trip-service.js'
//@requires: 'authenticated-user'
service TripService {
    entity triprecord // @(restrict: [ { grant: ['*'], to: 'trip_order'}])
    as projection on trips.triprecord;
    entity pax //@(restrict: [ { grant: ['*'], to: 'trip_order'}])
    as projection on trips.passenger;
    entity cargorecord //@(restrict: [ { grant: ['*'], to: 'trip_order'}])
    as projection on trips.cargorecord;
    entity routeplan //@(restrict: [ { grant: ['*'], to: 'trip_order'}])
    as projection on trips.routeplan;
    entity accommodation //@(restrict: [ { grant: ['*'], to: 'trip_order'}])
    as projection on trips.accommodation;
    entity catering //@(restrict: [ { grant: ['*'], to: 'trip_order'}])
    as projection on trips.catering;
    entity findTRbyBusKeys(  p_insupcarriercode2: String(2), p_inflightno: String(4), p_inorigin: String(3), p_indestination: String(3), p_inscheddeptdate: Date, p_fosuffix: String(2) )
    as projection on TRbyBusKeys( p_insupcarriercode2: :p_insupcarriercode2, p_inflightno: :p_inflightno, p_inorigin: :p_inorigin, p_indestination: :p_indestination, p_inscheddeptdate: :p_inscheddeptdate, p_fosuffix: fosuffix );
    
    entity findTRbyLegno( p_surrogatenum: String(23) ) as projection on TRbyLegno( p_legno: :p_surrogatenum );
    entity findTRbyAufnr( p_aufnr: String(12) ) as projection on TRbyAufnr( p_aufnr: :p_aufnr );
    entity findPreviousTR( p_actarrapt:String(3), p_tailno:String(8), p_pre_actdeptts:Decimal(15,0), p_actarrts:Decimal(15,0) ) 
    as projection on PreviousTR( p_actarrapt: :p_actarrapt, p_tailno: :p_tailno, p_pre_actdeptts: :p_pre_actdeptts , p_actarrts: :p_actarrts);
    
    entity carriers as projection on trips.carriers;
    entity airports as projection on trips.airports;
    entity legstates as projection on trips.legStates;
    
    //entity currencies as projection on Currencies;
    entity languages as projection on Languages;
    //entity countries as projection on Countries;
};


define view PreviousTR with parameters 
    p_pre_actdeptts: Decimal(15,0), 
    p_actarrapt: String(3),
    p_tailno: String(8),
    p_actarrts: Decimal(15,0)
    AS SELECT * FROM TripService.triprecord 
        WHERE 
            actarrapt = :p_actarrapt and
            tailno    = :p_tailno and
            actarrts >= :p_pre_actdeptts and
            actarrts <= :p_actarrts
        order by actarrts desc;

define view TRbyAufnr with parameters p_aufnr: String(12)
    AS SELECT * FROM TripService.triprecord
        WHERE 
            aufnr = :p_aufnr;
            
define view TRbyLegno with parameters p_legno:String(23)
    AS SELECT * FROM TripService.triprecord
        WHERE 
            surrogatenum = :p_legno;

define view TRbyBusKeys with parameters 
    p_insupcarriercode2: String(2), 
    p_inflightno: String(4),
    p_inorigin: String(3),
    p_indestination: String(3),
    p_inscheddeptdate: Date,
    p_fosuffix: String(2)
    AS SELECT * FROM TripService.triprecord
        WHERE 
            insupcarriercode2 = :p_insupcarriercode2 and
            inflightno = :p_inflightno and
            inorigin = :p_inorigin and
            indestination = :p_indestination and
            inscheddeptdate = :p_inscheddeptdate and
            fosuffix = :p_fosuffix;


 
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
    entryawy          @title : '{i18n>entryawy}';
    exitawy           @title : '{i18n>exitawy}';
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
