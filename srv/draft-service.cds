using { com.legstate.triporder as trips } from '../db/data-model';
using { TripService as TripService } from '../srv/cat-service';
using { sap.common.Countries as commonCountries } from '@sap/cds/common';
using { sap.common.Languages as commonLanguages } from '@sap/cds/common';
using { sap.common.Currencies as commonCurrencies } from '@sap/cds/common';


@path : '/browse'
//@impl: './trip-service.js'
//extend service TripService {
//};

annotate trips.legstates with @fiori.draft.enabled;
annotate TripService.legstates with @odata.draft.enabled;

annotate trips.carriers with @fiori.draft.enabled;
annotate TripService.carriers with @odata.draft.enabled;

annotate trips.airports with @fiori.draft.enabled;
annotate TripService.airports with @odata.draft.enabled;



annotate commonLanguages with @fiori.draft.enabled;
annotate TripService.Languages with @odata.draft.enabled;

annotate commonCountries with @fiori.draft.enabled;
annotate TripService.Countries with @odata.draft.enabled;

annotate commonCurrencies with @fiori.draft.enabled;
annotate TripService.Currencies with @odata.draft.enabled;


// Start of Legstate Draft UI
annotate TripService.legstates with @(UI : {
    SelectionFields  :  [
  
        code,
        stonr,
        finalLegstate
    ],

    LineItem         : [
       
        {
            Value : code,
            Label : 'Code'
        },
        {
            Value : stonr,
            Label : 'Stonr'
        },
        {
            Value : name,
            Label : 'Name'
        }
    ],
    Facets           : [{
        $Type  : 'UI.ReferenceFacet',
        Label  : 'Legstate Details',
        Target : '@UI.FieldGroup#Main'
    },

     {$Type: 'UI.ReferenceFacet', Label: '{i18n>Translations}', Target:  'texts/@UI.LineItem'}
    ],
  FieldGroup#Main : {Data : [
        {
            Value : code,
            Label : 'Code'
        },
        {
            Value : stonr,
            Label : 'Stonr'
        },
        {
            Value : finalLegstate,
            Label : 'Final Legstate'
        },
        {
            Value : name,
            Label : 'Name'
        },
        {
            Value : descr,
            Label : 'Description'
        }
    ]},


});

//  Draft for Localized Data
annotate TripService.legstates.texts @(
	UI: {
		Identification: [{Value:name}],
		SelectionFields: [ locale, name ],
		LineItem: [
			{Value: locale, Label: 'Locale'},
			{Value: name, Label: 'Name'},
			{Value: descr, Label: 'Description'}
		]
    });

// Add Value Help for Locales
annotate TripService.legstates.texts {
	locale @ValueList:{entity:'languages_vh',type:#fixed,title:'{i18n>Languages}' }
}
// In addition we need to expose Languages through AdminService as a target for ValueList
 extend service TripService{
 	@readonly entity languages_vh as projection on commonLanguages;
 }

// End of Legstate Draft UI

