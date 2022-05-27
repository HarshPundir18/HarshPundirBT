//Smartgarconstants
var SMG_CONSTANTS = {
    SOME_CONSTS: {
        a: 1,
        b: 2
    },
    SMG_SORT_ORDER:{
        ASC: 1,
        DESC: 2
    },
    SMG_ALERT_TYPE:{
        INFO: 1,
        WARNING: 2,
        ERROR: 3
    },
    SMG_EGAR_STATUS: {
        Finished: 'finished',
        Open: 'open'
    },
    SMG_FEATURE_FLAG_NAMES:{
        FF_Test: 'FF_Test',
    },
    SMG_EGAR_TYPES:{
        PRODUTOR_ESTABELECIMENTO: 'PRODUTOR_ESTABELECIMENTO',
        OLEOS_ALIMENTARES: 'OLEOS_ALIMENTARES',
        OBRAS_RCD: 'OBRAS_RCD',
        VEICULOS_FIM_VIDA: 'VEICULOS_FIM_VIDA',
        EX_SITU: 'EX_SITU',
        PRESTADOR_SERVICOS: 'PRESTADOR_SERVICOS'
    },
    SMG_EGAR_TYPES_ENUM:{
        PRODUTOR_ESTABELECIMENTO: 1,
        ENTIDADE_GESTORA: 2,
        ACORDOS_VOLUNTARIOS: 3,
        OLEOS_ALIMENTARES: 4,
        EX_SITU: 5,
        PRESTADOR_SERVICOS: 6,
        OBRAS_RCD: 7, 
        VEICULOS_FIM_VIDA: 8 
    },
    SMG_ESTABLISHMENT_TYPES:{
        ACCOUNT: 'ACCOUNT',
        CLIENT: 'CLIENT',
        ALL: 'ALL'
    },
    SMG_LEGAL_DEADLINES_TYPES:{
        OriginToAuthorize: 1,
        DestinToActOnNewEgar: 2,
        OriginToReplyRectification: 3,
        AsOrigin: 4,
        AsDestin: 5
    },
    SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES: {
        AllEstablishments: 1,
        AllEstablishmentsWithVat: 2,
        SingleEstablishment: 3
    },
    SMG_INTERVENIENT_TYPES:{
        Unknown: 0,
        Origin: 1,
        Destin: 2,
        Transporter: 3
    },
    SMG_ASYNC_REPORT_STATUS: {
        Waiting: 0,
        FetchingRecords: 1,
        RecordsFetched: 2,
        FileCreated: 3,
        FinishedSuccess: 4,
        ExceptionFetchingRecords: 5,
        ExceptionCreatingFile: 6,
        ExceptionUploadingFile: 7,
    },
    SMG_TEXT_SEARCH_TYPES:{
        Unknown: 0,
        Establishments: 1,
        Tags: 2
    },
    SMG_QUANTITIES_DECLARATION_TYPES:{
        Unknown: 0,
        ExSitu: 1,
        General: 2
    }
};

angular
.module('custom')
.constant('SOME_CONSTS', SMG_CONSTANTS.SOME_CONSTS)
.constant('SMG_SORT_ORDER', SMG_CONSTANTS.SMG_SORT_ORDER)
.constant('SMG_ALERT_TYPE', SMG_CONSTANTS.SMG_ALERT_TYPE)
.constant('SMG_EGAR_STATUS', SMG_CONSTANTS.SMG_EGAR_STATUS)
.constant('SMG_FEATURE_FLAG_NAMES', SMG_CONSTANTS.SMG_FEATURE_FLAG_NAMES)
.constant('SMG_EGAR_TYPES', SMG_CONSTANTS.SMG_EGAR_TYPES)
.constant('SMG_EGAR_TYPES_ENUM', SMG_CONSTANTS.SMG_EGAR_TYPES_ENUM)
.constant('SMG_ESTABLISHMENT_TYPES', SMG_CONSTANTS.SMG_ESTABLISHMENT_TYPES)
.constant('SMG_LEGAL_DEADLINES_TYPES', SMG_CONSTANTS.SMG_LEGAL_DEADLINES_TYPES)
.constant('SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES', SMG_CONSTANTS.SMG_QUANTITIES_DECLARATIONS_EMISSION_TYPES)
.constant('SMG_INTERVENIENT_TYPES', SMG_CONSTANTS.SMG_INTERVENIENT_TYPES)
.constant('SMG_ASYNC_REPORT_STATUS', SMG_CONSTANTS.SMG_ASYNC_REPORT_STATUS)
.constant('SMG_TEXT_SEARCH_TYPES', SMG_CONSTANTS.SMG_TEXT_SEARCH_TYPES)
.constant('SMG_QUANTITIES_DECLARATION_TYPES', SMG_CONSTANTS.SMG_QUANTITIES_DECLARATION_TYPES)

;

