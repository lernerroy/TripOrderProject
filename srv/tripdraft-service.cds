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
    entity carriers @(restrict : [{
        grant : ['*'],
        to    : 'Admin'
    }]) as projection on trips.carriers;

    entity airports @(restrict : [{
        grant : ['*'],
        to    : 'Admin'
    }]) as projection on trips.airports;

    entity legstates @(restrict : [{
        grant : ['*'],
        to    : 'Admin'
    }]) as projection on trips.legstates;

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

annotate trips.legstates with @fiori.draft.enabled;
annotate TripDraft.legstates with @odata.draft.enabled;
annotate trips.carriers with @fiori.draft.enabled;
annotate TripDraft.carriers with @odata.draft.enabled;
annotate trips.airports with @fiori.draft.enabled;
annotate TripDraft.airports with @odata.draft.enabled;
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
annotate TripDraft.legstates with {
    descr @UI.MultiLineText;
}

annotate TripDraft.legstates.texts with {
    descr @UI.MultiLineText;
}

// Carrier
annotate TripDraft.carriers with {
    descr @UI.MultiLineText;
}

annotate TripDraft.carriers.texts with {
    descr @UI.MultiLineText;
}

// Airports
annotate TripDraft.airports with {
    descr @UI.MultiLineText;
}

annotate TripDraft.airports.texts with {
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
annotate TripDraft.legstates with @(
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
annotate TripDraft.legstates.texts @(UI : {
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

annotate TripDraft.legstates.texts {
    locale @Common.ValueListWithFixedValues : true  @ValueList : {
        entity : 'languages_vh',
        type   : #fixed,
        title  : '{i18n>Languages}'
    }
}


// Carrier
annotate TripDraft.carriers with @(UI : {
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
annotate TripDraft.carriers.texts @(UI : {
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
annotate TripDraft.carriers.texts {
    locale @Common.ValueListWithFixedValues : true  @ValueList : {
        entity : 'languages_vh',
        type   : #fixed,
        title  : '{i18n>Languages}'
    }
}

// Airports
annotate TripDraft.airports with @(UI : {

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
        {Value : country_code, },
        {Value : ekgrp, },
        {Value : catloadstat, },
        {Value : catgroundime, },
        {Value : lat_coord, },
        {Value : lon_coord, },
        {Value : lat_coord_sign, },
        {Value : lon_coord_sign, },
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
annotate TripDraft.airports.texts @(UI : {
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
annotate TripDraft.airports.texts {
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
