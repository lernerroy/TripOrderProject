using {com.legstate.triporder as trips} from '../db/data-model';
//using { TripDraft as TripDraft } from '../srv/cat-service';
using {sap.common.Countries as commonCountries} from '@sap/cds/common';
using {sap.common.Languages as commonLanguages} from '@sap/cds/common';
using {sap.common.Currencies as commonCurrencies} from '@sap/cds/common';


@path : '/draft'
service TripDraft {

    // TripRecord
    //////////////////////////////////////////////////////////////////////
    entity Carriers @(restrict : [
        {
            grant : ['*'],
            to    : ['Admin']
        },
        {
            grant : ['READ'],
            to    : ['User']
        }
    ])                       as projection on trips.Carriers;

    entity Airports @(restrict : [
        {
            grant : ['*'],
            to    : ['Admin']
        },
        {
            grant : ['READ'],
            to    : ['User']
        }
    ])                       as projection on trips.Airports;

    entity Legstates @(restrict : [
        {
            grant : ['*'],
            to    : ['Admin']
        },
        {
            grant : ['READ'],
            to    : ['User']
        }
    ])                       as projection on trips.Legstates;

    entity aircraftTypeGroup
                             // @(restrict: [ { grant: ['*'], to: ['Admin','User']},
                             //              { grant: ['READ','WRITE'], to: ['API_user']} ])
                             as projection on trips.aircraftTypeGroup;

    entity TailRegistrations as projection on trips.TailRegistrations;

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
            to    : ['User']
        }
    ])                       as projection on commonLanguages;

    entity Countries @(restrict : [
        {
            grant : ['*'],
            to    : ['Admin']
        },
        {
            grant : ['READ'],
            to    : ['User']
        }
    ])                       as projection on commonCountries;

    entity Currencies @(restrict : [
        {
            grant : ['*'],
            to    : ['Admin']
        },
        {
            grant : ['READ'],
            to    : ['User']
        }
    ])                       as projection on commonCurrencies;
//////////////////////////////////////////////////////////////////////

};

annotate trips.Legstates with @fiori.draft.enabled;
annotate TripDraft.Legstates with @odata.draft.enabled;
annotate trips.Carriers with @fiori.draft.enabled;
annotate TripDraft.Carriers with @odata.draft.enabled;
annotate trips.Airports with @fiori.draft.enabled;
annotate TripDraft.Airports with @odata.draft.enabled;
annotate trips.aircraftTypeGroup with @odata.draft.enabled;
annotate TripDraft.aircraftTypeGroup with @odata.draft.enabled;
annotate trips.TailRegistrations with @odata.draft.enabled;
annotate TripDraft.TailRegistrations with @odata.draft.enabled;
annotate commonLanguages with @fiori.draft.enabled;
annotate TripDraft.Languages with @odata.draft.enabled;
annotate commonCountries with @fiori.draft.enabled;
annotate TripDraft.Countries with @odata.draft.enabled;
annotate commonCurrencies with @fiori.draft.enabled;
annotate TripDraft.Currencies with @odata.draft.enabled;

////////////////////////////////////////////////////////////////////////////
//
//	Set Header Text
//
annotate TripDraft.Legstates with @(UI : {HeaderInfo : {
    TypeName       : '{i18n>legstate_o}',
    TypeNamePlural : '{i18n>legstate_o}',
    Title          : {Value : code},
    Description    : {Value : name}
}, });

annotate TripDraft.Carriers with @(UI : {HeaderInfo : {
    TypeName       : '{i18n>carriers_o}',
    TypeNamePlural : '{i18n>carriers_o}',
    Title          : {Value : code},
    Description    : {Value : name}
}, });

annotate TripDraft.Airports with @(UI : {HeaderInfo : {
    TypeName       : '{i18n>airports_o}',
    TypeNamePlural : '{i18n>airports_o}',
    Title          : {Value : code},
    Description    : {Value : name}
}, });

annotate TripDraft.aircraftTypeGroup with @(UI : {HeaderInfo : {
    TypeName       : '{i18n>airports_o}',
    TypeNamePlural : '{i18n>airports_o}' //,
// Title: {Value: },
// Description: {Value: name}
}, });

annotate TripDraft.Languages with @(UI : {HeaderInfo : {
    TypeName       : '{i18n>languages_o}',
    TypeNamePlural : '{i18n>languages_o}',
    Title          : {Value : code},
    Description    : {Value : name}
}, });

annotate TripDraft.Countries with @(UI : {HeaderInfo : {
    TypeName       : '{i18n>countries_o}',
    TypeNamePlural : '{i18n>countries_o}',
    Title          : {Value : code},
    Description    : {Value : name}
}, });

annotate TripDraft.Currencies with @(UI : {HeaderInfo : {
    TypeName       : '{i18n>currencies_o}',
    TypeNamePlural : '{i18n>currencies_o}',
    Title          : {Value : code},
    Description    : {Value : name}
}, });

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
    ID_texts @Core.Computed;
    descr    @UI.MultiLineText;
}

// Carrier
annotate TripDraft.Carriers with {
    descr @UI.MultiLineText;
}

annotate TripDraft.Carriers.texts with {
    ID_texts @Core.Computed;
    descr    @UI.MultiLineText;
}

// Airports
annotate TripDraft.Airports with {
    descr @UI.MultiLineText;
}

annotate TripDraft.Airports.texts with {
    ID_texts @Core.Computed;
    descr    @UI.MultiLineText;
}

// TailRegistrations
annotate TripDraft.TailRegistrations with {
    descr @UI.MultiLineText;
}

annotate TripDraft.TailRegistrations.texts with {
    ID_texts @Core.Computed;
    descr    @UI.MultiLineText;
}


// Country
annotate TripDraft.Countries with {
    descr @UI.MultiLineText;
}

annotate TripDraft.Countries.texts with {
    ID_texts @Core.Computed;
    descr    @UI.MultiLineText;
}

// Languages
annotate TripDraft.Languages with {
    descr @UI.MultiLineText;
}

annotate TripDraft.Languages.texts with {
    ID_texts @Core.Computed;
    descr    @UI.MultiLineText;
}

// Currency
annotate TripDraft.Currencies with {
    descr @UI.MultiLineText;
}

annotate TripDraft.Currencies.texts with {
    ID_texts @Core.Computed;
    descr    @UI.MultiLineText;
}
// Start of Legstate Draft UI

// Legstates
annotate TripDraft.Legstates with @(
    Common.SemanticKey : [code],
    UI                 : {
        Identification      : [{Value : code}],
        title               : name,
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
    },
);

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
annotate TripDraft.Carriers with @(
    Common.SemanticKey : [code],
    UI                 : {
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
    }
);

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
annotate TripDraft.Airports with @(
    Common.SemanticKey : [code],
    UI                 : {

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
            {Value : country_code_code, },
            {Value : ekgrp, },
            {Value : catloadstat_code, },
            {Value : catgroundime, },
            {Value : lat_coord, },
            {Value : lat_coord_sign_code, },
            {Value : lon_coord, },
            {Value : lon_coord_sign_code, },
            {Value : name, },
            {Value : descr, }
        ]},
        FieldGroup #Admin : {Data : [
            {Value : createdBy},
            {Value : createdAt},
            {Value : modifiedBy},
            {Value : modifiedAt}
        ]},

    }
);

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

// Add Value Help for Coord Sign
annotate TripDraft.Airports {
    lat_coord_sign @Common.ValueListWithFixedValues : true  @ValueList : {
        entity : 'trips.Coord_signs',
        type   : #fixed,
        title  : '{i18n>lat_coord_sign}'
    };
    lon_coord_sign @Common.ValueListWithFixedValues : true  @ValueList : {
        entity : 'trips.Coord_signs',
        type   : #fixed,
        title  : '{i18n>lon_coord_sign}'
    }
}

// Tail Registrations
annotate TripDraft.TailRegistrations with @(
    Common.SemanticKey : [tailNo],
    UI                 : {

        SelectionFields   : [
            ID,
            tailNo
        ],

        LineItem          : [

            {Value : tailNo, },
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
            {Value : tailNo, },
            {Value : aircraftType_ID, },
            {Value : ac_seat_config, },
            {Value : ac_type_iata, },
            {Value : ac_type_iatag, },
            {Value : ac_type_icao, },
            {Value : mtow_kg, },
            {Value : mtow_t, },
            {Value : amtow1_kg, },
            {Value : amtow2_kg, },
            {Value : mtw_kg, },
            {Value : amtw_kg, },
            {Value : mlw_kg, },
            {Value : full_cgo_cap, },
            {Value : eev_kg, },
            {Value : wingspan_m, },
            {Value : length_m, },
            {Value : icao_noise_cat_takeoff, },
            {Value : icao_noise_cat_landing, },
            {Value : icao_chap3_noise_level, },
            {Value : icao_chap4_noise_level, },
            {Value : icao_annex16_chp, },
            {Value : nri_noise_category, },
            {Value : aci_noise_rate_ind_mtow, },
            {Value : aci_noise_rate_ind_amtow, },
            {Value : engine_app_noise_level, },
            {Value : engine_app_noise_limit, },
            {Value : engine_side_noise_level, },
            {Value : engine_side_noise_limit, },
            {Value : noise_level_start_takeoff, },
            {Value : noise_limit_start_takeoff, },
            {Value : pax_or_frt, },
            {Value : fcl_seat_cap, },
            {Value : jcl_seat_cap, },
            {Value : pey_seat_cap, },
            {Value : ycl_seat_cap, },
            {Value : tot_seat_cap, },
            {Value : ac_operator, },
            {Value : body_type, },
            {Value : number_engines, },
            {Value : engine_type, },
            {Value : zero_fuel_weight, },
            {Value : euwgtfctr1, },
            {Value : euwgtfctr2, },
            {Value : acoustic_grp, },
            {Value : bulk_ac, },
            {Value : eev_kg_arn, },
            {Value : ac_total_arn, },
            {Value : lto_fuel, },
            {Value : nox_tp_maint, },
            {Value : amtow1_t, },
            {Value : amtow2_t, },
            {Value : engine_takeoff_noise_lvl, },
            {Value : name, },
            {Value : descr, }
        ]},
        FieldGroup #Admin : {Data : [
            {Value : ID},
            {Value : createdBy},
            {Value : createdAt},
            {Value : modifiedBy},
            {Value : modifiedAt}
        ]},

    }
);

//  Draft for Localized Data
annotate TripDraft.TailRegistrations.texts @(UI : {
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
annotate TripDraft.TailRegistrations.texts {
    locale @Common.ValueListWithFixedValues : true  @ValueList : {
        entity : 'languages_vh',
        type   : #fixed,
        title  : '{i18n>Languages}'
    }
}

// Add Value Help for aircraft Type
annotate TripDraft.TailRegistrations {
    aircraftType
    @Common.ValueListWithFixedValues : false
    @ValueList : {
        entity : 'trips.aircraftTypeGroup',
        type   : #fixed,
        title  : '{i18n>aircraft_type}'
    }
}

// aircraft Type Group
annotate TripDraft.aircraftTypeGroup with @(
    Common.SemanticKey : [aircraftType],
    UI                 : {

        SelectionFields   : [
            ID,
            aircraftType,
            aircraftGroup
        ],

        LineItem          : [
            {Value : aircraftType, },
            {Value : aircraftGroup, },
        ],
        Facets            : [
            {
                $Type  : 'UI.ReferenceFacet',
                Label  : '{i18n>general}',
                Target : '@UI.FieldGroup#Main'
            },
            {
                $Type  : 'UI.ReferenceFacet',
                Label  : '{i18n>Admin}',
                Target : '@UI.FieldGroup#Admin'
            }
        ],
        FieldGroup #Main  : {Data : [
            {Value : aircraftType, },
            {Value : aircraftGroup, }
        ]},
        FieldGroup #Admin : {Data : [
            {Value : ID},
            {Value : createdBy},
            {Value : createdAt},
            {Value : modifiedBy},
            {Value : modifiedAt}
        ]},

    }
);

// Languages
annotate TripDraft.Languages with @(
    Common.SemanticKey : [code],
    UI                 : {
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


    }
);

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
annotate TripDraft.Currencies with @(
    Common.SemanticKey : [code],
    UI                 : {
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


    }
);

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
annotate TripDraft.Countries with @(
    Common.SemanticKey : [code],
    UI                 : {
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


    }
);

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
