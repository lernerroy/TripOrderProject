using {com.legstate.triporder as trips} from '../db/data-model';
//using { TripDraft as TripDraft } from '../srv/cat-service';
using {sap.common.Countries as commonCountries} from '@sap/cds/common';
using {sap.common.Languages as commonLanguages} from '@sap/cds/common';
using {sap.common.Currencies as commonCurrencies} from '@sap/cds/common';


@path : '/draft'
//@impl: './trip-service.js'
service TripDraft {

    // TripRecord
    //////////////////////////////////////////////////////////////////////
    entity Carriers @(restrict : [{
        grant : ['*'],
        to    : 'Admin'
    }]) as projection on trips.Carriers;

    entity Airports @(restrict : [{
        grant : ['*'],
        to    : 'Admin'
    }]) as projection on trips.Airports;

    entity Legstates @(restrict : [{
        grant : ['*'],
        to    : 'Admin'
    }]) as projection on trips.Legstates;

    // entity airportsCodes
    // @(restrict: [ { grant: ['*'], to: 'Admin'}])
    // as projection on trips.airportsCodes;
    //////////////////////////////////////////////////////////////////////


    // Common
    //////////////////////////////////////////////////////////////////////
    entity Languages @(restrict : [{
        grant : ['*'],
        to    : 'Admin'
    }]) as projection on commonLanguages;

    entity Countries @(restrict : [{
        grant : ['*'],
        to    : 'Admin'
    }]) as projection on commonCountries;

    entity Currencies @(restrict : [{
        grant : ['*'],
        to    : 'Admin'
    }]) as projection on commonCurrencies;
//////////////////////////////////////////////////////////////////////

};

annotate trips.Legstates with @fiori.draft.enabled;
annotate TripDraft.Legstates with @odata.draft.enabled;
annotate trips.Carriers with @fiori.draft.enabled;
annotate TripDraft.Carriers with @odata.draft.enabled;
annotate trips.Airports with @fiori.draft.enabled;
annotate TripDraft.Airports with @odata.draft.enabled;
annotate commonLanguages with @fiori.draft.enabled;
annotate TripDraft.Languages with @odata.draft.enabled;
annotate commonCountries with @fiori.draft.enabled;
annotate TripDraft.Countries with @odata.draft.enabled;
annotate commonCurrencies with @fiori.draft.enabled;
annotate TripDraft.Currencies with @odata.draft.enabled;

// In addition we need to expose Languages through TripDraft as a target for ValueList
extend service TripDraft {
    @readonly
    entity languages_vh as projection on commonLanguages;
}

// Enable MultiLine For Description Field
// Legstate
annotate TripDraft.Legstates with {
    descr @UI.MultiLineText;
}

annotate TripDraft.Legstates.texts with {
    descr @UI.MultiLineText;
}

// Carrier
annotate TripDraft.Carriers with {
    descr @UI.MultiLineText;
}

annotate TripDraft.Carriers.texts with {
    descr @UI.MultiLineText;
}

// Airports
annotate TripDraft.Airports with {
    descr @UI.MultiLineText;
}

annotate TripDraft.Airports.texts with {
    descr @UI.MultiLineText;
}

// Country
annotate TripDraft.Countries with {
    descr @UI.MultiLineText;
}

annotate TripDraft.Countries.texts with {
    descr @UI.MultiLineText;
}

// Languages
annotate TripDraft.Languages with {
    descr @UI.MultiLineText;
}

annotate TripDraft.Languages.texts with {
    descr @UI.MultiLineText;
}

// Currency
annotate TripDraft.Currencies with {
    descr @UI.MultiLineText;
}

annotate TripDraft.Currencies.texts with {
    descr @UI.MultiLineText;
}
// Start of Legstate Draft UI

// Legstates
annotate TripDraft.Legstates with @(
Common.SemanticKey: [name],
UI : {
Identification: [{Value:name}],
title: name,
    SelectionFields     : [

        code,
        stonr,
        finalLegstate
    ],

    LineItem            : [

        {Value : code, },
        {Value : stonr, },
        {Value : name, }
    ],
    Facets              : [
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>General}',
            Target : '@UI.FieldGroup#General'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>Translations}',
            Target : 'texts/@UI.LineItem'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>Admin}',
            Target : '@UI.FieldGroup#Admin'
        },
    ],
    FieldGroup #General : {Data : [
        {Value : code, },
        {Value : stonr, },
        {Value : finalLegstate, },
        {Value : name, },
        {Value : descr, }

    ]},

    FieldGroup #Admin   : {Data : [
        {Value : createdBy},
        {Value : createdAt},
        {Value : modifiedBy},
        {Value : modifiedAt}
    ]},
}, );

//  Draft for Localized Data
annotate TripDraft.Legstates.texts @(UI : {
    // Identification  : [{Value : code}],
    SelectionFields : [
        locale,
        name
    ],
    LineItem        : [
        {Value : locale, },
        {Value : name, },
        {Value : descr, }
    ]
});

// Add Value Help for Locales

annotate TripDraft.Legstates.texts {
    locale @Common.ValueListWithFixedValues : true  @ValueList : {
        entity : 'languages_vh',
        type   : #fixed,
        title  : '{i18n>Languages}'
    }
}


// Carrier
annotate TripDraft.Carriers with @(UI : {
    SelectionFields   : [
        code,
        name
    ],

    LineItem          : [
        {Value : code, },
        {Value : name, },
        {Value : descr, },
    ],
    Facets            : [
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>general}',
            Target : '@UI.FieldGroup#Main'
        },

        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>Translations}',
            Target : 'texts/@UI.LineItem'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>Admin}',
            Target : '@UI.FieldGroup#Admin'
        }
    ],
    FieldGroup #Main  : {Data : [
        {Value : code, },
        {Value : name, },
        {Value : descr, }
    ]},
    FieldGroup #Admin : {Data : [
        {Value : createdBy},
        {Value : createdAt},
        {Value : modifiedBy},
        {Value : modifiedAt}
    ]},
});

//  Draft for Localized Data
annotate TripDraft.Carriers.texts @(UI : {
    Identification  : [{Value : name}],
    SelectionFields : [
        locale,
        name
    ],
    LineItem        : [
        {Value : locale, },
        {Value : name, },
        {Value : descr, }
    ]
});

// Add Value Help for Locales
annotate TripDraft.Carriers.texts {
    locale @Common.ValueListWithFixedValues : true  @ValueList : {
        entity : 'languages_vh',
        type   : #fixed,
        title  : '{i18n>Languages}'
    }
}

// Airports
annotate TripDraft.Airports with @(UI : {

    SelectionFields   : [

        code,
        aptcd_icao
    ],

    LineItem          : [

        {Value : code, },
        {Value : aptcd_icao, },
        {Value : name, },
        {Value : descr, },
    ],
    Facets            : [
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>general}',
            Target : '@UI.FieldGroup#Main'
        },

        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>Translations}',
            Target : 'texts/@UI.LineItem'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>Admin}',
            Target : '@UI.FieldGroup#Admin'
        }
    ],
    FieldGroup #Main  : {Data : [

        {Value : code, },
        {Value : aptcd_icao, },
        {Value : online_ind, },
        {Value : company_ind, },
        {Value : fo_po_days, },
        {Value : country_code.code, },
        {Value : ekgrp, },
        {Value : catloadstat.code, },
        {Value : catgroundime, },
        {Value : lat_coord, },
        {Value : lon_coord, },
        {Value : lat_coord_sign.code, },
        {Value : lon_coord_sign.code, },
        {Value : name, },
        {Value : descr, }
    ]},
    FieldGroup #Admin : {Data : [
        {Value : createdBy},
        {Value : createdAt},
        {Value : modifiedBy},
        {Value : modifiedAt}
    ]},

});

//  Draft for Localized Data
annotate TripDraft.Airports.texts @(UI : {
    Identification  : [{Value : name}],
    SelectionFields : [
        locale,
        name
    ],
    LineItem        : [
        {Value : locale, },
        {Value : name, },
        {Value : descr, }
    ]
});

// Add Value Help for Locales
annotate TripDraft.Airports.texts {
    locale @Common.ValueListWithFixedValues : true  @ValueList : {
        entity : 'languages_vh',
        type   : #fixed,
        title  : '{i18n>Languages}'
    }
}

// Languages
annotate TripDraft.Languages with @(UI : {
    SelectionFields  : [

        code,
        name
    ],

    LineItem         : [

        {Value : code, },
        {Value : name, },
        {Value : descr, },
    ],
    Facets           : [
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>general}',
            Target : '@UI.FieldGroup#Main'
        },

        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>Translations}',
            Target : 'texts/@UI.LineItem'
        },

    ],
    FieldGroup #Main : {Data : [
        {Value : code, },
        {Value : name, },
        {Value : descr, }
    ]},


});

//  Draft for Localized Data
annotate TripDraft.Languages.texts @(UI : {
    Identification  : [{Value : name}],
    SelectionFields : [
        locale,
        name
    ],
    LineItem        : [
        {Value : locale, },
        {Value : name, },
        {Value : descr, }
    ]
});

// Add Value Help for Locales
annotate TripDraft.Languages.texts {
    locale @Common.ValueListWithFixedValues : true  @ValueList : {
        entity : 'languages_vh',
        type   : #fixed,
        title  : '{i18n>Languages}'
    }
}

// Currencies
annotate TripDraft.Currencies with @(UI : {
    SelectionFields  : [

        code,
        name
    ],

    LineItem         : [

        {Value : code, },
        {Value : symbol, },
        {Value : name, },
        {Value : descr, },

    ],
    Facets           : [
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>general}',
            Target : '@UI.FieldGroup#Main'
        },

        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>Translations}',
            Target : 'texts/@UI.LineItem'
        },

    ],
    FieldGroup #Main : {Data : [
        {Value : code, },
        {Value : symbol, },
        {Value : name, },
        {Value : descr, }
    ]},


});

//  Draft for Localized Data
annotate TripDraft.Currencies.texts @(UI : {
    Identification  : [{Value : name}],
    SelectionFields : [
        locale,
        name
    ],
    LineItem        : [
        {Value : locale, },
        {Value : name, },
        {Value : descr, }
    ]
});

// Add Value Help for Locales
annotate TripDraft.Currencies.texts {
    locale @Common.ValueListWithFixedValues : true  @ValueList : {
        entity : 'languages_vh',
        type   : #fixed,
        title  : '{i18n>Languages}'
    }
}

// Countries
annotate TripDraft.Countries with @(UI : {
    SelectionFields  : [

    code],

    LineItem         : [

    {Value : code, },

    ],
    Facets           : [
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>general}',
            Target : '@UI.FieldGroup#Main'
        },

        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>Translations}',
            Target : 'texts/@UI.LineItem'
        },

    ],
    FieldGroup #Main : {Data : [
        {Value : code, },
        {Value : name, },
        {Value : descr, }
    ]},


});

//  Draft for Localized Data
annotate TripDraft.Countries.texts @(UI : {
    Identification  : [{Value : name}],
    SelectionFields : [
        locale,
        name
    ],
    LineItem        : [
        {Value : locale, },
        {Value : name, },
        {Value : descr, }
    ]
});

// Add Value Help for Locales
annotate TripDraft.Countries.texts {
    locale @Common.ValueListWithFixedValues : true  @ValueList : {
        entity : 'languages_vh',
        type   : #fixed,
        title  : '{i18n>Languages}'
    }
}


// End of Legstate Draft UI
