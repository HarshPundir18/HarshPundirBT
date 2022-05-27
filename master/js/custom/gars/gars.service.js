(function(){
    'use strict';

    angular
        .module('custom')
        .service('garsService', garsService);

    garsService.$inject = ['$http', '$window', '$filter', '$q', '$log', 'SMG_EGAR_TYPES'];
    function garsService ($http, $window, $filter, $q, $log, SMG_EGAR_TYPES) {

        var baseUrl = '/api/egar';

        var _groupCodes = function(){
             return [
                    {key: '', value: 'Selecionar'},
                    {key: 'II', value: 'Grupo II'},
                    {key: 'III', value: 'Grupo III'},
                    {key: 'IV', value: 'Grupo IV'}
                ];
        };

        var _groups = function(){
            return [
                   {key: 'II', value: 'Grupo II'},
                   {key: 'III', value: 'Grupo III'},
                   {key: 'IV', value: 'Grupo IV'}
               ];
       };

        var _shouldSelectGroupBeEnabled = function (lerCode){
            return $.inArray(lerCode, this.groupCodeForLerCode()) > -1;
        }

        var _operationCodes = function(){
            return [
                    //{ key:"", value:"--Selecione--"},
                    {key: "D1", value:"D1 - DEPÓSITO NO SOLO, EM PROFUNDIDADE OU À SUPERFÍCIE (P.E. EM ATERROS, ETC.)"},
                    {key: "D2", value:"D2 - TRATAMENTO NO SOLO (P.E. BIODEGRADAÇÃO DE EFLUENTES LÍQUIDOS OU DE LAMAS DE DEPURAÇÃO NOS SOLOS, ETC.)"},
                    {key: "D3", value:"D3 - INJEÇÃO EM PROFUNDIDADE (P.E. INJEÇÃO DE RESÍDUOS POR BOMBAGEM EM POÇOS, CUPULAS, SALINAS OU DEPÓSITOS NATURAIS, ETC)"},
                    {key: "D4", value:"D4 - LAGUNAGEM (P.E. DESCARGA DE RESÍDUOS LÍQUIDOS OU DE LAMAS DE DEPURAÇÃO EM POÇOS, LAGOS NATURAIS OU ARTIFICIAIS, ETC.)"},
                    {key: "D5", value:"D5 - DEPÓSITOS SUBTERRÂNEOS ESPECIALMENTE CONCEBIDOS (P.E. DEPOSIÇÃO EM ALINHAMENTOS DE CÉLULAS QUE SÃO SELADAS E ISOLADAS UMAS DAS OUTRAS E DO AMBIENTE, ETC.)"},
                    {key: "D6", value:"D6 - DESCARGA PARA MASSAS DE ÁGUA, COM EXCEÇÃO DOS MARES E DOS OCEANOS"},
                    {key: "D7", value:"D7 - DESCARGAS PARA OS MARES E OU OCEANOS, INCLUINDO INSERCAO NOS FUNDOS MARINHOS"},
                    {key: "D8", value:"D8 - TRATAMENTO BIOLÓGICO NÃO ESPECIFICADO EM QUALQUER OUTRA PARTE DO PRESENTE ANEXO QUE PRODUZA COMPOSTOS OU MISTURAS FINAIS REJEITADOS POR MEIO DE QUALQUER DAS OPERAÇÕES ENUMERADAS DE D01 A D12"},
                    {key: "D9", value:"D9 - TRATAMENTO FÍSICO -QUÍMICO NÃO ESPECIFICADO EM QUALQUER OUTRA PARTE DO PRESENTE ANEXO QUE PRODUZA COMPOSTOS OU MISTURAS FINAIS REJEITADOS POR MEIO DE QUALQUER DAS OPERAÇÕES ENUMERADAS DE D01 A D12 (P.E. EVAPORAÇÃO, SECAGEM, CALCINAÇÃO, ETC.)"},
                    {key: "D10", value:"D10 - INCINERAÇÃO EM TERRA"},
                    {key: "D11", value:"D11 - INCINERAÇÃO NO MAR"},
                    {key: "D12", value:"D12 - ARMAZENAMENTO PERMANENTE (P.E., ARMAZENAMENTO DE CONTENTORES NUMA MINA, ETC.)"},
                    {key: "D13", value:"D13 - MISTURA ANTERIOR À EXECUÇÃO DE UMA DAS OPERAÇÕES ENUMERADAS DE D01 A D12"},
                    {key: "D14", value:"D14 - REEMBALAGEM ANTERIOR A UMA DAS OPERAÇÕES ENUMERADAS DE D01 A D13"},
                    {key: "D15", value:"D15 - ARMAZENAMENTO ANTES DE UMA DAS OPERAÇÕES ENUMERADAS DE D01 A D014 (COM EXCLUSÃO DO ARMAZENAMENTO TEMPORÁRIO, ANTES DA RECOLHA, NO LOCAL ONDE OS RESÍDUOS FORAM PRODUZIDOS)"},
                    {key: "R1", value:"R1 - UTILIZAÇÃO PRINCIPAL COMO COMBUSTÍVEL OU OUTROS MEIOS DE PRODUÇÃO DE ENERGIA"},
                    {key: "R2", value:"R2 - RECUPERAÇÃO/REGENERAÇÃO DE SOLVENTES"},
                    {key: "R3", value:"R3 - RECICLAGEM/RECUPERAÇÃO DE SUBSTÂNCIAS ORGÂNICAS NÃO UTILIZADAS COMO SOLVENTES (INCLUINDO DIGESTÃO ANAERÓBIA E OU COMPOSTAGEM E OUTROS PROCESSOS DE TRANSFORMAÇÃO BIOLÓGICA)"},
                    {key: "R4", value:"R4 - RECICLAGEM/RECUPERAÇÃO DE METAIS E COMPOSTOS METÁLICOS"},
                    {key: "R5", value:"R5 - RECICLAGEM/RECUPERAÇÃO DE OUTROS MATERIAIS INORGÂNICOS"},
                    {key: "R6", value:"R6 - REGENERAÇÃO DE ÁCIDOS OU DE BASES"},
                    {key: "R7", value:"R7 - VALORIZAÇÃO DE COMPONENTES UTILIZADOS NA REDUÇÃO DA POLUIÇÃO"},
                    {key: "R8", value:"R8 - VALORIZAÇÃO DE COMPONENTES DE CATALISADORES"},
                    {key: "R9", value:"R9 - REFINAÇÃO DE ÓLEOS E OUTRAS REUTILIZAÇÕES DE ÓLEOS"},
                    {key: "R10", value:"R10 - TRATAMENTO DO SOLO PARA BENEFÍCIO AGRÍCOLA OU MELHORAMENTO AMBIENTAL"},
                    {key: "R11", value:"R11 - UTILIZAÇÃO DE RESÍDUOS OBTIDOS A PARTIR DE QUALQUER DAS OPERAÇÕES ENUMERADAS DE R01 A R10"},
                    {key: "R12", value:"R12 - TROCA DE RESÍDUOS COM VISTA A SUBMETÊ-LOS A UMA DAS OPERAÇÕES ENUMERADAS DE R01 A R11"},
                    {key: "R13", value:"R13 - ARMAZENAMENTO DE RESÍDUOS DESTINADOS A UMA DAS OPERAÇÕES ENUMERADAS DE R01 A R12 (COM EXCLUSÃO DO ARMAZENAMENTO TEMPORÁRIO, ANTES DA RECOLHA, NO LOCAL ONDE OS RESÍDUOS FORAM PRODUZIDOS)"},
                    {key: "AP", value:"AP - ARMAZENAMENTO PRELIMINAR"}
                ]
        };

        var _operationCodesPage = function(offset, limit, search){
            var operationCodes = this.operationCodes();
            var startIndex = offset;
            var endIndex = offset + limit;
            if(search){
                operationCodes = $filter('filter')(operationCodes, function (item) { 
                    return item.value && item.value.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                });
            }

            var page = operationCodes.slice(startIndex, endIndex);

            return $q.resolve(page);
        };

        var _lerCodes = function(){
            return [
                    //{ key:"", value:"--Selecione--"},
                    { key:"010101", value:"	010101 - RESÍDUOS DA EXTRACÇÃO DE MINÉRIOS METÁLICOS																									                                                    "},
                    { key:"010102", value:"	010102 - RESÍDUOS DA EXTRACÇÃO DE MINÉRIOS NÃO METÁLICOS                                                                                                                                                    "},
                    { key:"010304", value:" 010304 - REJEITADOS GERADORES DE ÁCIDOS, RESULTANTES DA TRANSFORMAÇÃO DE SULFURETOS                                                                                                                         "},
                    { key:"010305", value:" 010305 - OUTROS REJEITADOS CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                                   "},
                    { key:"010306", value:" 010306 - REJEITADOS NÃO ABRANGIDOS EM 010304 E 010305                                                                                                                                                       "},
                    { key:"010307", value:" 010307 - OUTROS RESÍDUOS CONTENDO SUBSTÂNCIAS PERIGOSAS, RESULTANTES DA TRANSFORMAÇÃO FÍSICA E QUÍMICA DE MINÉRIOS METÁLICOS                                                                                "},
                    { key:"010308", value:" 010308 - POEIRAS E PÓS NÃO ABRANGIDOS EM 010307                                                                                                                                                             "},
                    { key:"010309", value:" 010309 - LAMAS VERMELHAS DA PRODUÇÃO DE ALUMINA NÃO ABRANGIDAS EM 010307                                                                                                                                    "},
                    { key:"010399", value:" 010399 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"010407", value:" 010407 - RESÍDUOS CONTENDO SUBSTÂNCIAS PERIGOSAS, RESULTANTES DA TRANSFORMAÇÃO FÍSICA E QUÍMICA DE MINÉRIOS NÃO METÁLICOS                                                                                   "},
                    { key:"010408", value:" 010408 - GRAVILHAS E FRAGMENTOS DE ROCHA NÃO ABRANGIDOS EM 010407                                                                                                                                           "},
                    { key:"010409", value:" 010409 - AREIAS E ARGILAS                                                                                                                                                                                   "},
                    { key:"010410", value:" 010410 - POEIRAS E PÓS NÃO ABRANGIDOS EM 010407                                                                                                                                                             "},
                    { key:"010411", value:" 010411 - RESÍDUOS DA PREPARAÇÃO DE MINÉRIOS DE POTÁSSIO E DE SAL-GEMA NÃO ABRANGIDOS EM 010407                                                                                                              "},
                    { key:"010412", value:" 010412 - REJEITADOS E OUTROS RESÍDUOS, RESULTANTES DA LAVAGEM E LIMPEZA DE MINÉRIOS, NÃO ABRANGIDOS EM 010407 E 010411                                                                                      "},
                    { key:"010413", value:" 010413 - RESÍDUOS DO CORTE E SERRAGEM DE PEDRA NÃO ABRANGIDOS EM 010407                                                                                                                                     "},
                    { key:"010499", value:" 010499 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"010504", value:" 010504 - LAMAS E OUTROS RESÍDUOS DE PERFURAÇÃO CONTENDO ÁGUA DOCE                                                                                                                                           "},
                    { key:"010505", value:" 010505 - LAMAS E OUTROS RESÍDUOS DE PERFURAÇÃO CONTENDO HIDROCARBONETOS                                                                                                                                     "},
                    { key:"010506", value:" 010506 - LAMAS E OUTROS RESÍDUOS DE PERFURAÇÃO CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                               "},
                    { key:"010507", value:" 010507 - LAMAS E OUTROS RESÍDUOS DE PERFURAÇÃO CONTENDO SAIS DE BÁRIO NÃO ABRANGIDOS EM 010505 E 010506                                                                                                     "},
                    { key:"010508", value:" 010508 - LAMAS E OUTROS RESÍDUOS DE PERFURAÇÃO CONTENDO CLORETOS NÃO ABRANGIDOS EM 010505 E 010506                                                                                                          "},
                    { key:"010599", value:" 010599 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"020101", value:" 020101 - LAMAS PROVENIENTES DA LAVAGEM E LIMPEZA                                                                                                                                                            "},
                    { key:"020102", value:" 020102 - RESÍDUOS DE TECIDOS ANIMAIS                                                                                                                                                                        "},
                    { key:"020103", value:" 020103 - RESÍDUOS DE TECIDOS VEGETAIS                                                                                                                                                                       "},
                    { key:"020104", value:" 020104 - RESÍDUOS DE PLÁSTICOS (EXCLUINDO EMBALAGENS)                                                                                                                                                       "},
                    { key:"020106", value:" 020106 - FEZES, URINA E ESTRUME DE ANIMAIS (INCLUINDO PALHA SUJA), EFLUENTES RECOLHIDOS SEPARADAMENTE E TRATADOS NOUTRO LOCAL                                                                               "},
                    { key:"020107", value:" 020107 - RESÍDUOS SILVÍCOLAS                                                                                                                                                                                "},
                    { key:"020108", value:" 020108 - RESÍDUOS AGROQUÍMICOS CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                               "},
                    { key:"020109", value:" 020109 - RESÍDUOS AGROQUÍMICOS NÃO ABRANGIDOS EM 020108                                                                                                                                                     "},
                    { key:"020110", value:" 020110 - RESÍDUOS METÁLICOS                                                                                                                                                                                 "},
                    { key:"020199", value:" 020199 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"020201", value:" 020201 - LAMAS PROVENIENTES DA LAVAGEM E LIMPEZA                                                                                                                                                            "},
                    { key:"020202", value:" 020202 - RESÍDUOS DE TECIDOS ANIMAIS                                                                                                                                                                        "},
                    { key:"020203", value:" 020203 - MATERIAIS IMPRÓPRIOS PARA CONSUMO OU PROCESSAMENTO                                                                                                                                                 "},
                    { key:"020204", value:" 020204 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES                                                                                                                                                             "},
                    { key:"020299", value:" 020299 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"020301", value:" 020301 - LAMAS DE LAVAGEM, LIMPEZA, DESCASQUE, CENTRIFUGAÇÃO E SEPARAÇÃO                                                                                                                                    "},
                    { key:"020302", value:" 020302 - RESÍDUOS DE AGENTES CONSERVANTES                                                                                                                                                                   "},
                    { key:"020303", value:" 020303 - RESÍDUOS DA EXTRACÇÃO POR SOLVENTES                                                                                                                                                                "},
                    { key:"020304", value:" 020304 - MATERIAIS IMPRÓPRIOS PARA CONSUMO OU PROCESSAMENTO                                                                                                                                                 "},
                    { key:"020304", value:" 020304 - MATERIAIS IMPRÓPRIOS PARA CONSUMO OU PROCESSAMENTO                                                                                                                                                 "},
                    { key:"020305", value:" 020305 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES                                                                                                                                                             "},
                    { key:"020399", value:" 020399 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"020401", value:" 020401 - TERRA PROVENIENTE DA LIMPEZA E LAVAGEM DA BETERRABA                                                                                                                                                "},
                    { key:"020402", value:" 020402 - CARBONATO DE CÁLCIO FORA DE ESPECIFICAÇÃO                                                                                                                                                          "},
                    { key:"020403", value:" 020403 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES                                                                                                                                                             "},
                    { key:"020499", value:" 020499 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"020501", value:" 020501 - MATERIAIS IMPRÓPRIOS PARA CONSUMO OU PROCESSAMENTO                                                                                                                                                 "},
                    { key:"020502", value:" 020502 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES                                                                                                                                                             "},
                    { key:"020599", value:" 020599 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"020601", value:" 020601 - MATERIAIS IMPRÓPRIOS PARA CONSUMO OU PROCESSAMENTO                                                                                                                                                 "},
                    { key:"020602", value:" 020602 - RESÍDUOS DE AGENTES CONSERVANTES                                                                                                                                                                   "},
                    { key:"020603", value:" 020603 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES                                                                                                                                                             "},
                    { key:"020699", value:" 020699 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"020701", value:" 020701 - RESÍDUOS DA LAVAGEM, LIMPEZA E REDUÇÃO MECÂNICA DAS MATÉRIAS PRIMAS                                                                                                                                "},
                    { key:"020702", value:" 020702 - RESÍDUOS DA DESTILAÇÃO DE ÁLCOOL                                                                                                                                                                   "},
                    { key:"020703", value:" 020703 - RESÍDUOS DE TRATAMENTOS QUÍMICOS                                                                                                                                                                   "},
                    { key:"020704", value:" 020704 - MATERIAIS IMPRÓPRIOS PARA CONSUMO OU PROCESSAMENTO                                                                                                                                                 "},
                    { key:"020705", value:" 020705 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES                                                                                                                                                             "},
                    { key:"020799", value:" 020799 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"030101", value:" 030101 - RESÍDUOS DO DESCASQUE DE MADEIRA E DE CORTIÇA                                                                                                                                                      "},
                    { key:"030104", value:" 030104 - SERRADURA, APARAS, FITAS DE APLAINAMENTO, MADEIRA, AGLOMERADOS E FOLHEADOS, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                         "},
                    { key:"030105", value:" 030105 - SERRADURA, APARAS, FITAS DE APLAINAMENTO, MADEIRA, AGLOMERADOS E FOLHEADOS NÃO ABRANGIDOS EM 030104                                                                                                "},
                    { key:"030199", value:" 030199 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"030201", value:" 030201 - PRODUTOS ORGÂNICOS NÃO HALOGENADOS DE PRESERVAÇÃO DA MADEIRA                                                                                                                                       "},
                    { key:"030202", value:" 030202 - AGENTES ORGANOCLORADOS DE PRESERVAÇÃO DA MADEIRA                                                                                                                                                   "},
                    { key:"030203", value:" 030203 - AGENTES ORGANOMETÁLICOS DE PRESERVAÇÃO DA MADEIRA                                                                                                                                                  "},
                    { key:"030204", value:" 030204 - AGENTES INORGÂNICOS DE PRESERVAÇÃO DA MADEIRA                                                                                                                                                      "},
                    { key:"030205", value:" 030205 - OUTROS AGENTES DE PRESERVAÇÃO DA MADEIRA CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                            "},
                    { key:"030299", value:" 030299 - AGENTES DE PRESERVAÇÃO DA MADEIRA NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                  "},
                    { key:"030301", value:" 030301 - RESÍDUOS DO DESCASQUE DE MADEIRA E DE MADEIRA                                                                                                                                                      "},
                    { key:"030302", value:" 030302 - LAMAS DA LIXÍVIA VERDE (PROVENIENTES DA VALORIZAÇÃO DA LIXÍVIA DE COZIMENTO)                                                                                                                       "},
                    { key:"030305", value:" 030305 - LAMAS DE DESTINTAGEM, PROVENIENTES DA RECICLAGEM DE PAPEL                                                                                                                                          "},
                    { key:"030307", value:" 030307 - REJEITADOS MECANICAMENTE SEPARADOS DO FABRICO DE PASTA A PARTIR DE PAPEL E CARTÃO USADO                                                                                                            "},
                    { key:"030308", value:" 030308 - RESÍDUOS DA TRIAGEM DE PAPEL E CARTÃO DESTINADOS A RECICLAGEM                                                                                                                                      "},
                    { key:"030309", value:" 030309 - RESÍDUOS DE LAMAS DE CAL                                                                                                                                                                           "},
                    { key:"030310", value:" 030310 - REJEITADOS DE FIBRAS E LAMAS DE FIBRAS, FILLERS E REVESTIMENTOS, PROVENIENTES DA SEPARAÇÃO MECÂNICA                                                                                                "},
                    { key:"030311", value:" 030311 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES NÃO ABRANGIDAS EM 030310                                                                                                                                    "},
                    { key:"030399", value:" 030399 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"040101", value:" 040101 - RESÍDUOS DAS OPERAÇÕES DE DESCARNA E DIVISÃO DE TRIPA                                                                                                                                              "},
                    { key:"040102", value:" 040102 - RESÍDUOS DA OPERAÇÃO DE CALAGEM                                                                                                                                                                    "},
                    { key:"040103", value:" 040103 - RESÍDUOS DE DESENGORDURAMENTO CONTENDO SOLVENTES SEM FASE AQUOSA                                                                                                                                   "},
                    { key:"040104", value:" 040104 - LICORES DE CURTIMENTA CONTENDO CRÓMIO                                                                                                                                                              "},
                    { key:"040105", value:" 040105 - LICORES DE CURTIMENTA SEM CRÓMIO                                                                                                                                                                   "},
                    { key:"040106", value:" 040106 - LAMAS, EM ESPECIAL DO TRATAMENTO LOCAL DE EFLUENTES, CONTENDO CRÓMIO                                                                                                                               "},
                    { key:"040107", value:" 040107 - LAMAS, EM ESPECIAL DO TRATAMENTO LOCAL DE EFLUENTES SEM CRÓMIO                                                                                                                                     "},
                    { key:"040108", value:" 040108 - RESÍDUOS DE PELE CURTIDA (APARAS AZUIS, SURRAGEM, POEIRAS) CONTENDO CRÓMIO                                                                                                                         "},
                    { key:"040109", value:" 040109 - RESÍDUOS DA CONFECÇÃO E ACABAMENTOS                                                                                                                                                                "},
                    { key:"040199", value:" 040199 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"040209", value:" 040209 - RESÍDUOS DE MATERIAIS COMPÓSITOS (TÊXTEIS IMPREGNADOS, ELASTÓMEROS, PLASTÓMEROS)                                                                                                                   "},
                    { key:"040210", value:" 040210 - MATÉRIA ORGÂNICA DE PRODUTOS NATURAIS (POR EXEMPLO, GORDURA, CERA)                                                                                                                                 "},
                    { key:"040214", value:" 040214 - RESÍDUOS DOS ACABAMENTOS, CONTENDO SOLVENTES ORGÂNICOS                                                                                                                                             "},
                    { key:"040215", value:" 040215 - RESÍDUOS DOS ACABAMENTOS NÃO ABRANGIDOS EM 040214                                                                                                                                                  "},
                    { key:"040216", value:" 040216 - CORANTES E PIGMENTOS CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                                "},
                    { key:"040217", value:" 040217 - CORANTES E PIGMENTOS NÃO ABRANGIDOS EM 040216                                                                                                                                                      "},
                    { key:"040219", value:" 040219 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                              "},
                    { key:"040220", value:" 040220 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES NÃO ABRANGIDAS EM 040219                                                                                                                                    "},
                    { key:"040221", value:" 040221 - RESÍDUOS DE FIBRAS TÊXTEIS NÃO PROCESSADAS                                                                                                                                                         "},
                    { key:"040222", value:" 040222 - RESÍDUOS DE FIBRAS TÊXTEIS PROCESSADAS                                                                                                                                                             "},
                    { key:"040299", value:" 040299 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"050102", value:" 050102 - LAMAS DE DESSALINIZAÇÃO                                                                                                                                                                            "},
                    { key:"050103", value:" 050103 - LAMAS DE FUNDO DOS DEPÓSITOS                                                                                                                                                                       "},
                    { key:"050104", value:" 050104 - LAMAS ALQUÍLICAS ÁCIDAS                                                                                                                                                                            "},
                    { key:"050105", value:" 050105 - DERRAMES DE HIDROCARBONETOS                                                                                                                                                                        "},
                    { key:"050106", value:" 050106 - LAMAS CONTENDO HIDROCARBONETOS PROVENIENTES DE OPERAÇÕES DE MANUTENÇÃO DAS INSTALAÇÕES OU EQUIPAMENTOS                                                                                             "},
                    { key:"050107", value:" 050107 - ALCATRÕES ÁCIDOS                                                                                                                                                                                   "},
                    { key:"050108", value:" 050108 - OUTROS ALCATRÕES                                                                                                                                                                                   "},
                    { key:"050109", value:" 050109 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                              "},
                    { key:"050110", value:" 050110 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES NÃO ABRANGIDAS EM 050109                                                                                                                                    "},
                    { key:"050111", value:" 050111 - RESÍDUOS DA LIMPEZA DE COMBUSTÍVEIS COM BASES                                                                                                                                                      "},
                    { key:"050112", value:" 050112 - HIDROCARBONETOS CONTENDO ÁCIDOS                                                                                                                                                                    "},
                    { key:"050113", value:" 050113 - LAMAS DO TRATAMENTO DE ÁGUA PARA ABASTECIMENTO DE CALDEIRAS                                                                                                                                        "},
                    { key:"050114", value:" 050114 - RESÍDUOS DE COLUNAS DE ARREFECIMENTO                                                                                                                                                               "},
                    { key:"050115", value:" 050115 - ARGILAS DE FILTRAÇÃO USADAS                                                                                                                                                                        "},
                    { key:"050116", value:" 050116 - RESÍDUOS CONTENDO ENXOFRE DA DESSULFURAÇÃO DE PETRÓLEO                                                                                                                                             "},
                    { key:"050117", value:" 050117 - BETUMES                                                                                                                                                                                            "},
                    { key:"050199", value:" 050199 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"050601", value:" 050601 - ALCATRÕES ÁCIDOS                                                                                                                                                                                   "},
                    { key:"050603", value:" 050603 - OUTROS ALCATRÕES                                                                                                                                                                                   "},
                    { key:"050604", value:" 050604 - RESÍDUOS DE COLUNAS DE ARREFECIMENTO                                                                                                                                                               "},
                    { key:"050699", value:" 050699 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"050701", value:" 050701 - RESÍDUOS CONTENDO MERCÚRIO                                                                                                                                                                         "},
                    { key:"050702", value:" 050702 - RESÍDUOS CONTENDO ENXOFRE                                                                                                                                                                          "},
                    { key:"050799", value:" 050799 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"060101", value:" 060101 - ÁCIDO SULFÚRICO E ÁCIDO SULFUROSO                                                                                                                                                                  "},
                    { key:"060102", value:" 060102 - ÁCIDO CLORÍDRICO                                                                                                                                                                                   "},
                    { key:"060103", value:" 060103 - ÁCIDO FLUORÍDRICO                                                                                                                                                                                  "},
                    { key:"060104", value:" 060104 - ÁCIDO FOSFÓRICO E ÁCIDO FOSFOROSO                                                                                                                                                                  "},
                    { key:"060105", value:" 060105 - ÁCIDO NITRICO E ÁCIDO NITROSO                                                                                                                                                                      "},
                    { key:"060106", value:" 060106 - OUTROS ÁCIDOS                                                                                                                                                                                      "},
                    { key:"060199", value:" 060199 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"060201", value:" 060201 - HIDRÓXIDO DE CÁLCIO                                                                                                                                                                                "},
                    { key:"060203", value:" 060203 - HIDRÓXIDO DE AMÓNIO                                                                                                                                                                                "},
                    { key:"060204", value:" 060204 - HIDRÓXIDOS DE SÓDIO E DE POTÁSSIO                                                                                                                                                                  "},
                    { key:"060205", value:" 060205 - OUTRAS BASES                                                                                                                                                                                       "},
                    { key:"060299", value:" 060299 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"060311", value:" 060311 - SAIS NO ESTADO SÓLIDO E EM SOLUÇÕES CONTENDO CIANETOS                                                                                                                                              "},
                    { key:"060313", value:" 060313 - SAIS NO ESTADO SÓLIDO E EM SOLUÇÕES CONTENDO METAIS PESADOS                                                                                                                                        "},
                    { key:"060314", value:" 060314 - SAIS NO ESTADO SÓLIDO E EM SOLUÇÕES NÃO ABRANGIDOS EM 060311 E 060313                                                                                                                              "},
                    { key:"060315", value:" 060315 - ÓXIDOS METÁLICOS CONTENDO METAIS PESADOS                                                                                                                                                           "},
                    { key:"060316", value:" 060316 - ÓXIDOS METÁLICOS NÃO ABRANGIDOS EM 060315                                                                                                                                                          "},
                    { key:"060399", value:" 060399 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"060403", value:" 060403 - RESÍDUOS CONTENDO ARSÉNIO,1                                                                                                                                                                        "},
                    { key:"060404", value:" 060404 - RESÍDUOS CONTENDO MERCÚRIO                                                                                                                                                                         "},
                    { key:"060405", value:" 060405 - RESÍDUOS CONTENDO OUTROS METAIS PESADOS                                                                                                                                                            "},
                    { key:"060499", value:" 060499 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"060502", value:" 060502 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                              "},
                    { key:"060503", value:" 060503 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES NÃO ABRANGIDAS EM 060502                                                                                                                                    "},
                    { key:"060602", value:" 060602 - RESÍDUOS CONTENDO SULFURETOS PERIGOSOS                                                                                                                                                             "},
                    { key:"060603", value:" 060603 - RESÍDUOS CONTENDO SULFURETOS NÃO ABRANGIDOS EM 060602                                                                                                                                              "},
                    { key:"060699", value:" 060699 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"060701", value:" 060701 - RESÍDUOS DE ELECTRÓLISE CONTENDO AMIANTO                                                                                                                                                           "},
                    { key:"060702", value:" 060702 - RESÍDUOS DE CARVÃO ACTIVADO UTILIZADO NA PRODUÇÃO DE CLORO                                                                                                                                         "},
                    { key:"060703", value:" 060703 - LAMAS DE SULFATO DE BÁRIO CONTENDO MERCÚRIO                                                                                                                                                        "},
                    { key:"060704", value:" 060704 - SOLUÇÕES E ÁCIDOS, POR EXEMPLO, ÁCIDO DE CONTACTO                                                                                                                                                  "},
                    { key:"060799", value:" 060799 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"060802", value:" 060802 - RESÍDUOS CONTENDO CLOROSSILANOS PERIGOSOS                                                                                                                                                          "},
                    { key:"060899", value:" 060899 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"060902", value:" 060902 - ESCÓRIAS COM FÓSFORO                                                                                                                                                                               "},
                    { key:"060903", value:" 060903 - RESÍDUOS CÁLCICOS DE REACÇÃO CONTENDO OU CONTAMINADOS COM SUBSTÂNCIAS PERIGOSAS                                                                                                                    "},
                    { key:"060904", value:" 060904 - RESÍDUOS CÁLCICOS DE REACÇÃO NÃO ABRANGIDOS EM 060903                                                                                                                                              "},
                    { key:"060999", value:" 060999 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"061002", value:" 061002 - RESÍDUOS CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                                            "},
                    { key:"061099", value:" 061099 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"061101", value:" 061101 - RESÍDUOS CÁLCICOS DE REACÇÃO, DA PRODUÇÃO DE DIÓXIDO DE TITÂNIO                                                                                                                                    "},
                    { key:"061199", value:" 061199 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"061301", value:" 061301 - PRODUTOS INORGÂNICOS DE PROTECÇÃO DAS PLANTAS, AGENTES DE PRESERVAÇÃO DA MADEIRA E OUTROS BIOCIDAS                                                                                                 "},
                    { key:"061302", value:" 061302 - CARVÃO ACTIVADO USADO (EXCEPTO 060702)                                                                                                                                                             "},
                    { key:"061303", value:" 061303 - NEGRO DE FUMO                                                                                                                                                                                      "},
                    { key:"061304", value:" 061304 - RESÍDUOS DO PROCESSAMENTO DO AMIANTO                                                                                                                                                               "},
                    { key:"061305", value:" 061305 - FULIGEM                                                                                                                                                                                            "},
                    { key:"061399", value:" 061399 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"070101", value:" 070101 - LÍQUIDOS DE LAVAGEM E LICORES MÃE AQUOSOS                                                                                                                                                          "},
                    { key:"070103", value:" 070103 - SOLVENTES, LÍQUIDOS DE LAVAGEM E LICORES MÃE ORGÂNICOS HALOGENADOS                                                                                                                                 "},
                    { key:"070104", value:" 070104 - OUTROS SOLVENTES, LÍQUIDOS DE LAVAGEM E LICORES MÃE ORGÂNICOS                                                                                                                                      "},
                    { key:"070107", value:" 070107 - RESÍDUOS DE DESTILAÇÃO E RESÍDUOS DE REACÇÃO HALOGENADOS                                                                                                                                           "},
                    { key:"070108", value:" 070108 - OUTROS RESÍDUOS DE DESTILAÇÃO E RESÍDUOS DE REACÇÃO                                                                                                                                                "},
                    { key:"070109", value:" 070109 - ABSORVENTES USADOS E BOLOS DE FILTRAÇÃO HALOGENADOS                                                                                                                                                "},
                    { key:"070110", value:" 070110 - OUTROS ABSORVENTES USADOS E BOLOS DE FILTRAÇÃO                                                                                                                                                     "},
                    { key:"070111", value:" 070111 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                             "},
                    { key:"070112", value:" 070112 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES NÃO ABRANGIDAS EM 070111                                                                                                                                    "},
                    { key:"070199", value:" 070199 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"070201", value:" 070201 - LÍQUIDOS DE LAVAGEM E LICORES MÃE AQUOSOS                                                                                                                                                          "},
                    { key:"070203", value:" 070203 - SOLVENTES, LÍQUIDOS DE LAVAGEM E LICORES MÃE ORGÂNICOS HALOGENADOS                                                                                                                                 "},
                    { key:"070204", value:" 070204 - OUTROS SOLVENTES, LÍQUIDOS DE LAVAGEM E LICORES MÃE ORGÂNICOS                                                                                                                                      "},
                    { key:"070207", value:" 070207 - RESÍDUOS DE DESTILAÇÃO E RESÍDUOS DE REACÇÃO HALOGENADOS                                                                                                                                           "},
                    { key:"070208", value:" 070208 - OUTROS RESÍDUOS DE DESTILAÇÃO E RESÍDUOS DE REACÇÃO                                                                                                                                                "},
                    { key:"070209", value:" 070209 - ABSORVENTES USADOS E BOLOS DE FILTRAÇÃO HALOGENADOS                                                                                                                                                "},
                    { key:"070210", value:" 070210 - OUTROS ABSORVENTES USADOS E BOLOS DE FILTRAÇÃO                                                                                                                                                     "},
                    { key:"070211", value:" 070211 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                             "},
                    { key:"070212", value:" 070212 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES NÃO ABRANGIDAS EM 070211                                                                                                                                    "},
                    { key:"070213", value:" 070213 - RESÍDUOS DE PLÁSTICOS                                                                                                                                                                              "},
                    { key:"070214", value:" 070214 - RESÍDUOS DE ADITIVOS CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                                "},
                    { key:"070215", value:" 070215 - RESÍDUOS DE ADITIVOS NÃO ABRANGIDOS EM 070214                                                                                                                                                      "},
                    { key:"070216", value:" 070216 - RESÍDUOS CONTENDO SILICONES PERIGOSOS                                                                                                                                                              "},
                    { key:"070217", value:" 070217 - RESÍDUOS CONTENDO SILICONES QUE NÃO OS MENCIONADOS NA RUBRICA 070216                                                                                                                               "},
                    { key:"070299", value:" 070299 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"070301", value:" 070301 - LÍQUIDOS DE LAVAGEM E LICORES MÃE AQUOSOS                                                                                                                                                          "},
                    { key:"070303", value:" 070303 - SOLVENTES, LÍQUIDOS DE LAVAGEM E LICORES MÃE ORGÂNICOS HALOGENADOS                                                                                                                                 "},
                    { key:"070304", value:" 070304 - OUTROS SOLVENTES, LÍQUIDOS DE LAVAGEM E LICORES MÃE ORGÂNICOS                                                                                                                                      "},
                    { key:"070307", value:" 070307 - RESÍDUOS DE DESTILAÇÃO E RESÍDUOS DE REACÇÃO HALOGENADOS                                                                                                                                           "},
                    { key:"070308", value:" 070308 - OUTROS RESÍDUOS DE DESTILAÇÃO E RESÍDUOS DE REACÇÃO                                                                                                                                                "},
                    { key:"070309", value:" 070309 - ABSORVENTES USADOS E BOLOS DE FILTRAÇÃO HALOGENADOS                                                                                                                                                "},
                    { key:"070310", value:" 070310 - OUTROS ABSORVENTES USADOS E BOLOS DE FILTRAÇÃO                                                                                                                                                     "},
                    { key:"070311", value:" 070311 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                             "},
                    { key:"070312", value:" 070312 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES NÃO ABRANGIDAS EM 070311                                                                                                                                    "},
                    { key:"070399", value:" 070399 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"070401", value:" 070401 - LÍQUIDOS DE LAVAGEM E LICORES MÃE AQUOSOS                                                                                                                                                          "},
                    { key:"070403", value:" 070403 - SOLVENTES, LÍQUIDOS DE LAVAGEM E LICORES MÃE ORGÂNICOS HALOGENADOS                                                                                                                                 "},
                    { key:"070404", value:" 070404 - OUTROS SOLVENTES, LÍQUIDOS DE LAVAGEM E LICORES MÃE ORGÂNICOS                                                                                                                                      "},
                    { key:"070407", value:" 070407 - RESÍDUOS DE DESTILAÇÃO E RESÍDUOS DE REACÇÃO HALOGENADOS                                                                                                                                           "},
                    { key:"070408", value:" 070408 - OUTROS RESÍDUOS DE DESTILAÇÃO E RESÍDUOS DE REACÇÃO                                                                                                                                                "},
                    { key:"070409", value:" 070409 - ABSORVENTES USADOS E BOLOS DE FILTRAÇÃO HALOGENADOS                                                                                                                                                "},
                    { key:"070410", value:" 070410 - OUTROS ABSORVENTES USADOS E BOLOS DE FILTRAÇÃO                                                                                                                                                     "},
                    { key:"070411", value:" 070411 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                              "},
                    { key:"070412", value:" 070412 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES NÃO ABRANGIDAS EM 070411                                                                                                                                    "},
                    { key:"070413", value:" 070413 - RESÍDUOS SÓLIDOS CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                                    "},
                    { key:"070499", value:" 070499 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"070501", value:" 070501 - LÍQUIDOS DE LAVAGEM E LICORES-MÃE AQUOSOS                                                                                                                                                          "},
                    { key:"070503", value:" 070503 - SOLVENTES, LÍQUIDOS DE LAVAGEM E LICORES MÃE ORGÂNICOS HALOGENADOS                                                                                                                                 "},
                    { key:"070504", value:" 070504 - OUTROS SOLVENTES, LÍQUIDOS DE LAVAGEM E LICORES MÃE ORGÂNICOS                                                                                                                                      "},
                    { key:"070507", value:" 070507 - RESÍDUOS DE DESTILAÇÃO E RESÍDUOS DE REACÇÃO HALOGENADOS                                                                                                                                           "},
                    { key:"070508", value:" 070508 - OUTROS RESÍDUOS DE DESTILAÇÃO E RESÍDUOS DE REACÇÃO                                                                                                                                                "},
                    { key:"070509", value:" 070509 - ABSORVENTES USADOS E BOLOS DE FILTRAÇÃO HALOGENADOS                                                                                                                                                "},
                    { key:"070510", value:" 070510 - OUTROS ABSORVENTES USADOS E BOLOS DE FILTRAÇÃO                                                                                                                                                     "},
                    { key:"070511", value:" 070511 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                              "},
                    { key:"070512", value:" 070512 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES NÃO ABRANGIDAS EM 070511                                                                                                                                    "},
                    { key:"070513", value:" 070513 - RESÍDUOS SÓLIDOS CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                                    "},
                    { key:"070514", value:" 070514 - RESÍDUOS SÓLIDOS NÃO ABRANGIDOS EM 070513                                                                                                                                                          "},
                    { key:"070599", value:" 070599 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"070601", value:" 070601 - LÍQUIDOS DE LAVAGEM E LICORES MÃE AQUOSOS                                                                                                                                                          "},
                    { key:"070603", value:" 070603 - SOLVENTES, LÍQUIDOS DE LAVAGEM E LICORES MÃE ORGÂNICOS HALOGENADOS                                                                                                                                 "},
                    { key:"070604", value:" 070604 - OUTROS SOLVENTES, LÍQUIDOS DE LAVAGEM E LICORES MÃE ORGÂNICOS                                                                                                                                      "},
                    { key:"070607", value:" 070607 - RESÍDUOS DE DESTILAÇÃO E RESÍDUOS DE REACÇÃO HALOGENADOS                                                                                                                                           "},
                    { key:"070608", value:" 070608 - OUTROS RESÍDUOS DE DESTILAÇÃO E RESÍDUOS DE REACÇÃO                                                                                                                                                "},
                    { key:"070609", value:" 070609 - ABSORVENTES USADOS E BOLOS DE FILTRAÇÃO HALOGENADOS                                                                                                                                                "},
                    { key:"070610", value:" 070610 - OUTROS ABSORVENTES USADOS E BOLOS DE FILTRAÇÃO                                                                                                                                                     "},
                    { key:"070611", value:" 070611 - LAMAS TRATAMENTO LOCAL DE EFLUENTES, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                "},
                    { key:"070612", value:" 070612 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES NÃO ABRANGIDAS EM 070611                                                                                                                                    "},
                    { key:"070699", value:" 070699 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"070701", value:" 070701 - LÍQUIDOS DE LAVAGEM E LICORES MÃE AQUOSOS                                                                                                                                                          "},
                    { key:"070703", value:" 070703 - SOLVENTES, LÍQUIDOS DE LAVAGEM E LICORES MÃE ORGÂNICOS HALOGENADOS                                                                                                                                 "},
                    { key:"070704", value:" 070704 - OUTROS SOLVENTES, LÍQUIDOS DE LAVAGEM E LICORES MÃE ORGÂNICOS                                                                                                                                      "},
                    { key:"070707", value:" 070707 - RESÍDUOS DE DESTILAÇÃO E RESÍDUOS DE REACÇÃO HALOGENADOS                                                                                                                                           "},
                    { key:"070708", value:" 070708 - OUTROS RESÍDUOS DE DESTILAÇÃO E RESÍDUOS DE REACÇÃO                                                                                                                                                "},
                    { key:"070709", value:" 070709 - ABSORVENTES USADOS E BOLOS DE FILTRAÇÃO HALOGENADOS                                                                                                                                                "},
                    { key:"070710", value:" 070710 - OUTROS ABSORVENTES USADOS E BOLOS DE FILTRAÇÃO                                                                                                                                                     "},
                    { key:"070711", value:" 070711 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                             "},
                    { key:"070712", value:" 070712 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES NÃO ABRANGIDAS EM 070711                                                                                                                                    "},
                    { key:"070799", value:" 070799 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"080111", value:" 080111 - RESÍDUOS DE TINTAS E VERNIZES CONTENDO SOLVENTES ORGÂNICOS OU OUTRAS SUBSTÂNCIAS PERIGOSAS                                                                                                         "},
                    { key:"080112", value:" 080112 - RESÍDUOS DE TINTAS E VERNIZES, NÃO ABRANGIDOS EM 080111                                                                                                                                            "},
                    { key:"080113", value:" 080113 - LAMAS DE TINTAS E VERNIZES, CONTENDO SOLVENTES ORGÂNICOS OU OUTRAS SUBSTÂNCIAS PERIGOSAS                                                                                                           "},
                    { key:"080114", value:" 080114 - LAMAS DE TINTAS E VERNIZES NÃO ABRANGIDAS EM 080113                                                                                                                                                "},
                    { key:"080115", value:" 080115 - LAMAS AQUOSAS CONTENDO TINTAS E VERNIZES COM SOLVENTES ORGÂNICOS OU OUTRAS SUBSTÂNCIAS PERIGOSAS                                                                                                   "},
                    { key:"080116", value:" 080116 - LAMAS AQUOSAS CONTENDO TINTAS E VERNIZES NÃO ABRANGIDAS EM 080115                                                                                                                                  "},
                    { key:"080117", value:" 080117 - RESÍDUOS DA REMOÇÃO DE TINTAS E VERNIZES CONTENDO SOLVENTES ORGÂNICOS OU OUTRAS SUBSTÂNCIAS PERIGOSAS                                                                                              "},
                    { key:"080118", value:" 080118 - RESÍDUOS DA REMOÇÃO DE TINTAS E VERNIZES, NÃO ABRANGIDOS EM 080117                                                                                                                                 "},
                    { key:"080119", value:" 080119 - SUSPENSÕES AQUOSAS CONTENDO TINTAS OU VERNIZES, COM SOLVENTES ORGÂNICOS OU OUTRAS SUBSTÂNCIAS PERIGOSAS                                                                                            "},
                    { key:"080120", value:" 080120 - SUSPENSÕES AQUOSAS CONTENDO TINTAS E VERNIZES, NÃO ABRANGIDAS EM 080119                                                                                                                            "},
                    { key:"080121", value:" 080121 - RESÍDUOS DE PRODUTOS DE REMOÇÃO DE TINTAS E VERNIZES                                                                                                                                               "},
                    { key:"080199", value:" 080199 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"080201", value:" 080201 - RESÍDUOS DE REVESTIMENTOS NA FORMA PULVERULENTA                                                                                                                                                    "},
                    { key:"080202", value:" 080202 - LAMAS AQUOSAS CONTENDO MATERIAIS CERÂMICOS                                                                                                                                                         "},
                    { key:"080203", value:" 080203 - SUSPENSÕES AQUOSAS CONTENDO MATERIAIS CERÂMICOS                                                                                                                                                    "},
                    { key:"080299", value:" 080299 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"080307", value:" 080307 - LAMAS AQUOSAS CONTENDO TINTAS DE IMPRESSÃO                                                                                                                                                         "},
                    { key:"080308", value:" 080308 - RESÍDUOS DE LÍQUIDOS AQUOSOS CONTENDO TINTAS DE IMPRESSÃO                                                                                                                                          "},
                    { key:"080312", value:" 080312 - RESÍDUOS DE TINTAS DE IMPRESSÃO CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                     "},
                    { key:"080313", value:" 080313 - RESÍDUOS DE TINTAS NÃO ABRANGIDOS EM 030312                                                                                                                                                        "},
                    { key:"080314", value:" 080314 - LAMAS DE TINTAS DE IMPRESSÃO CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                        "},
                    { key:"080315", value:" 080315 - LAMAS DE TINTAS DE IMPRESSÃO NÃO ABRANGIDAS EM 080314                                                                                                                                              "},
                    { key:"080316", value:" 080316 - RESÍDUOS DE SOLUÇÕES DE ÁGUAS FORTES                                                                                                                                                               "},
                    { key:"080317", value:" 080317 - RESÍDUOS DE TONNER DE IMPRESSÃO CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                     "},
                    { key:"080318", value:" 080318 - RESÍDUOS DE TONNER DE IMPRESSÃO NÃO ABRANGIDOS EM 080317                                                                                                                                           "},
                    { key:"080319", value:" 080319 - ÓLEOS DE DISPERSÃO                                                                                                                                                                                 "},
                    { key:"080399", value:" 080399 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"080409", value:" 080409 - RESÍDUOS DE COLAS OU VEDANTES CONTENDO SOLVENTES ORGÂNICOS OU OUTRAS SUBSTÂNCIAS PERIGOSAS                                                                                                         "},
                    { key:"080410", value:" 080410 - RESÍDUOS DE COLAS OU VEDANTES NÃO ABRANGIDOS EM 080409                                                                                                                                             "},
                    { key:"080411", value:" 080411 - LAMAS DE COLAS OU VEDANTES CONTENDO SOLVENTES ORGÂNICOS OU OUTRAS SUBSTÂNCIAS PERIGOSAS                                                                                                            "},
                    { key:"080412", value:" 080412 - LAMAS DE COLAS OU VEDANTES NÃO ABRANGIDAS EM 080411                                                                                                                                                "},
                    { key:"080413", value:" 080413 - LAMAS AQUOSAS CONTENDO COLAS OU VEDANTES COM SOLVENTES ORGÂNICOS OU OUTRAS SUBSTÂNCIAS PERIGOSAS                                                                                                   "},
                    { key:"080414", value:" 080414 - LAMAS AQUOSAS CONTENDO COLAS OU VEDANTES NÃO ABRANGIDAS EM 080413                                                                                                                                  "},
                    { key:"080415", value:" 080415 - RESÍDUOS LÍQUIDOS AQUOSOS CONTENDO COLAS OU VEDANTES COM SOLVENTES ORGÂNICOS OU OUTRAS SUBSTÂNCIAS PERIGOSAS                                                                                       "},
                    { key:"080416", value:" 080416 - RESÍDUOS LÍQUIDOS AQUOSOS CONTENDO COLAS OU VEDANTES NÃO ABRANGIDOS EM 080415                                                                                                                      "},
                    { key:"080417", value:" 080417 - ÓLEO DE RESINA                                                                                                                                                                                     "},
                    { key:"080499", value:" 080499 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"080501", value:" 080501 - RESÍDUOS DE ISOCIANATOS                                                                                                                                                                            "},
                    { key:"090101", value:" 090101 - BANHOS DE REVELAÇÃO E ACTIVAÇÃO DE BASE AQUOSA                                                                                                                                                     "},
                    { key:"090102", value:" 090102 - BANHOS DE REVELAÇÃO DE CHAPAS LITOGRÁFICAS DE IMPRESSÃO DE BASE AQUOSA                                                                                                                             "},
                    { key:"090103", value:" 090103 - BANHOS DE REVELAÇÃO À BASE DE SOLVENTES                                                                                                                                                            "},
                    { key:"090104", value:" 090104 - BANHOS DE FIXAÇÃO                                                                                                                                                                                  "},
                    { key:"090105", value:" 090105 - BANHOS DE BRANQUEAMENTO E DE FIXADORES DE BRANQUEAMENTO                                                                                                                                            "},
                    { key:"090106", value:" 090106 - RESÍDUOS CONTENDO PRATA DO TRATAMENTO LOCAL DE RESÍDUOS FOTOGRÁFICOS                                                                                                                               "},
                    { key:"090107", value:" 090107 - PELÍCULA E PAPEL FOTOGRÁFICO COM PRATA OU COMPOSTOS DE PRATA                                                                                                                                       "},
                    { key:"090108", value:" 090108 - PELÍCULA E PAPEL FOTOGRÁFICO SEM PRATA OU COMPOSTOS DE PRATA                                                                                                                                       "},
                    { key:"090110", value:" 090110 - MÁQUINAS FOTOGRÁFICAS DESCARTÁVEIS SEM PILHAS                                                                                                                                                      "},
                    { key:"090111", value:" 090111 - MÁQUINAS FOTOGRÁFICAS DESCARTÁVEIS COM PILHAS INCLUÍDAS EM 16060160602 OU 160603                                                                                                                   "},
                    { key:"090112", value:" 090112 - MÁQUINAS FOTOGRÁFICAS DESCARTÁVEIS COM PILHAS NÃO ABRANGIDAS EM 090111                                                                                                                             "},
                    { key:"090113", value:" 090113 - RESÍDUOS LÍQUIDOS AQUOSOS DA RECUPERAÇÃO LOCAL DE PRATA NÃO ABRANGIDOS EM 090106                                                                                                                   "},
                    { key:"090199", value:" 090199 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"100101", value:" 100101 - CINZAS, ESCÓRIAS E POEIRAS DE CALDEIRAS (EXCLUINDO AS POEIRAS DE CALDEIRAS ABRANGIDAS EM 100104)                                                                                                   "},
                    { key:"100102", value:" 100102 - CINZAS VOLANTES DA COMBUSTÃO DE CARVÃO                                                                                                                                                             "},
                    { key:"100103", value:" 100103 - CINZAS VOLANTES DA COMBUSTÃO DE TURFA OU MADEIRA NÃO TRATADA                                                                                                                                       "},
                    { key:"100104", value:" 100104 - CINZAS VOLANTES E POEIRAS DE CALDEIRAS DA COMBUSTÃO DE HIDROCARBONETOS                                                                                                                             "},
                    { key:"100105", value:" 100105 - RESÍDUOS CÁLCICOS DE REACÇÃO, NA FORMA SÓLIDA, PROVENIENTES DA DESSULFURAÇÃO DE GASES DE COMBUSTÃO                                                                                                 "},
                    { key:"100107", value:" 100107 - RESÍDUOS CÁLCICOS DE REACÇÃO, NA FORMA DE LAMAS, PROVENIENTES DA DESSULFURAÇÃO DE GASES DE COMBUSTÃO                                                                                               "},
                    { key:"100109", value:" 100109 - ÁCIDO SULFÚRICO                                                                                                                                                                                    "},
                    { key:"100113", value:" 100113 - CINZAS VOLANTES DA COMBUSTÃO DE HIDROCARBONETOS EMULSIONADOS UTILIZADOS COMO COMBUSTÍVEL                                                                                                           "},
                    { key:"100114", value:" 100114 - CINZAS, ESCÓRIAS E POEIRAS DE CALDEIRAS DE CO-INCINERAÇÃO CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                           "},
                    { key:"100115", value:" 100115 - CINZAS, ESCÓRIAS E POEIRAS DE CALDEIRAS DE CO-INCINERAÇÃO NÃO ABRANGIDAS EM 100114                                                                                                                 "},
                    { key:"100116", value:" 100116 - CINZAS VOLANTES DE CO-INCINERAÇÃO CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                   "},
                    { key:"100117", value:" 100117 - CINZAS VOLANTES DE CO-INCINERAÇÃO NÃO ABRANGIDAS EM 100116                                                                                                                                         "},
                    { key:"100118", value:" 100118 - RESÍDUOS DE LIMPEZA DE GASES CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                        "},
                    { key:"100119", value:" 100119 - RESÍDUOS DE LIMPEZA DE GASES NÃO ABRANGIDOS EM 100105, 100107 E 100118                                                                                                                             "},
                    { key:"100120", value:" 100120 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                              "},
                    { key:"100121", value:" 100121 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES NÃO ABRANGIDAS EM 100120                                                                                                                                    "},
                    { key:"100122", value:" 100122 - LAMAS AQUOSAS PROVENIENTES DA LIMPEZA DE CALDEIRAS CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                  "},
                    { key:"100123", value:" 100123 - LAMAS AQUOSAS PROVENIENTES DA LIMPEZA DE CALDEIRAS NÃO ABRANGIDAS EM 100122                                                                                                                        "},
                    { key:"100124", value:" 100124 - AREIAS DE LEITOS FLUIDIZADOS                                                                                                                                                                       "},
                    { key:"100125", value:" 100125 - RESÍDUOS DO ARMAZENAMENTO DE COMBUSTÍVEIS E DA PREPARAÇÃO DE CENTRAIS ELÉCTRICAS A CARVÃO                                                                                                          "},
                    { key:"100126", value:" 100126 - RESÍDUOS DO TRATAMENTO DA ÁGUA DE ARREFECIMENTO                                                                                                                                                    "},
                    { key:"100199", value:" 100199 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"100201", value:" 100201 - RESÍDUOS DO PROCESSAMENTO DE ESCÓRIAS                                                                                                                                                              "},
                    { key:"100202", value:" 100202 - ESCÓRIAS NÃO PROCESSADAS                                                                                                                                                                           "},
                    { key:"100207", value:" 100207 - RESÍDUOS SÓLIDOS DO TRATAMENTO DE GASES CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                             "},
                    { key:"100208", value:" 100208 - RESÍDUOS SÓLIDOS DO TRATAMENTO DE GASES, NÃO ABRANGIDOS EM 100207                                                                                                                                  "},
                    { key:"100210", value:" 100210 - ESCAMAS DE LAMINAGEM                                                                                                                                                                               "},
                    { key:"100211", value:" 100211 - RESÍDUOS DO TRATAMENTO DA ÁGUA DE ARREFECIMENTO CONTENDO HIDROCARBONETOS                                                                                                                           "},
                    { key:"100212", value:" 100212 - RESÍDUOS DO TRATAMENTO DA ÁGUA DE ARREFECIMENTO NÃO ABRANGIDOS EM 100211                                                                                                                           "},
                    { key:"100213", value:" 100213 - LAMAS E BOLOS DE FILTRAÇÃO DO TRATAMENTO DE GASES CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                   "},
                    { key:"100214", value:" 100214 - LAMAS E BOLOS DE FILTRAÇÃO DO TRATAMENTO DE GASES NÃO ABRANGIDOS EM 100213                                                                                                                         "},
                    { key:"100215", value:" 100215 - OUTRAS LAMAS E BOLOS DE FILTRAÇÃO                                                                                                                                                                  "},
                    { key:"100299", value:" 100299 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"100302", value:" 100302 - RESÍDUOS DE ÂNODOS                                                                                                                                                                                 "},
                    { key:"100304", value:" 100304 - ESCÓRIAS DA PRODUÇÃO PRIMÁRIA                                                                                                                                                                      "},
                    { key:"100305", value:" 100305 - RESÍDUOS DE ALUMINA                                                                                                                                                                                "},
                    { key:"100308", value:" 100308 - ESCÓRIAS SALINAS DA PRODUÇÃO SECUNDÁRIA                                                                                                                                                            "},
                    { key:"100309", value:" 100309 - IMPUREZAS NEGRAS DA PRODUÇÃO SECUNDÁRIA                                                                                                                                                            "},
                    { key:"100315", value:" 100315 - ESCUMAS INFLAMÁVEIS OU QUE, EM CONTACTO COM A ÁGUA, LIBERTAM GASES INFLAMÁVEIS EM QUANTIDADES PERIGOSAS                                                                                            "},
                    { key:"100316", value:" 100316 - ESCUMAS NÃO ABRANGIDAS EM 100315                                                                                                                                                                   "},
                    { key:"100317", value:" 100317 - RESÍDUOS DO FABRICO DE ÂNODOS CONTENDO ALCATRÃO                                                                                                                                                    "},
                    { key:"100318", value:" 100318 - RESÍDUOS DO FABRICO DE ÂNODOS CONTENDO CARBONO, NÃO ABRANGIDOS EM 100317                                                                                                                           "},
                    { key:"100319", value:" 100319 - POEIRAS DE GASES DE COMBUSTÃO CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                       "},
                    { key:"100320", value:" 100320 - POEIRAS DE GASES DE COMBUSTÃO NÃO ABRANGIDAS EM 100319                                                                                                                                             "},
                    { key:"100321", value:" 100321 - OUTRAS PARTÍCULAS E POEIRAS (INCLUINDO POEIRAS DA TRITURAÇÃO DE ESCÓRIAS) CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                           "},
                    { key:"100322", value:" 100322 - OUTRAS PARTÍCULAS E POEIRAS (INCLUINDO POEIRAS DA TRITURAÇÃO DE ESCÓRIAS) NÃO ABRANGIDAS EM 100321                                                                                                 "},
                    { key:"100323", value:" 100323 - RESÍDUOS SÓLIDOS DO TRATAMENTO DE GASES CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                             "},
                    { key:"100324", value:" 100324 - RESÍDUOS SÓLIDOS DO TRATAMENTO DE GASES NÃO ABRANGIDOS EM 1003023                                                                                                                                  "},
                    { key:"100325", value:" 100325 - LAMAS E BOLOS DE FILTRAÇÃO DO TRATAMENTO DE GASES CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                   "},
                    { key:"100326", value:" 100326 - LAMAS E BOLOS DE FILTRAÇÃO DO TRATAMENTO DE GASES NÃO ABRANGIDOS EM 100325                                                                                                                         "},
                    { key:"100327", value:" 100327 - RESÍDUOS DO TRATAMENTO DA ÁGUA DE ARREFECIMENTO CONTENDO HIDROCARBONETOS                                                                                                                           "},
                    { key:"100328", value:" 100328 - RESÍDUOS DO TRATAMENTO DA ÁGUA DE ARREFECIMENTO NÃO ABRANGIDOS EM 100327                                                                                                                           "},
                    { key:"100329", value:" 100329 - RESÍDUOS DO TRATAMENTO DAS ESCÓRIAS SALINAS E DO TRATAMENTO DAS IMPUREZAS NEGRAS CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                    "},
                    { key:"100330", value:" 100330 - RESÍDUOS DO TRATAMENTO DAS ESCÓRIAS SALINAS E DO TRATAMENTO DAS IMPUREZAS NEGRAS NÃO ABRANGIDOS EM 100329                                                                                          "},
                    { key:"100399", value:" 100399 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"100401", value:" 100401 - ESCÓRIAS DA PRODUÇÃO PRIMÁRIA E SECUNDÁRIA                                                                                                                                                         "},
                    { key:"100402", value:" 100402 - IMPUREZAS E ESCUMAS DA PRODUÇÃO PRIMÁRIA E SECUNDÁRIA                                                                                                                                              "},
                    { key:"100403", value:" 100403 - ARSENIATO DE CÁLCIO                                                                                                                                                                                "},
                    { key:"100404", value:" 100404 - POEIRAS DE GASES DE COMBUSTÃO                                                                                                                                                                      "},
                    { key:"100405", value:" 100405 - OUTRAS PARTÍCULAS E POEIRAS                                                                                                                                                                        "},
                    { key:"100406", value:" 100406 - RESÍDUOS SÓLIDOS DO TRATAMENTO DE GASES                                                                                                                                                            "},
                    { key:"100407", value:" 100407 - LAMAS E BOLOS DE FILTRAÇÃO DO TRATAMENTO DE GASES                                                                                                                                                  "},
                    { key:"100409", value:" 100409 - RESÍDUOS DO TRATAMENTO DA ÁGUA DE ARREFECIMENTO, CONTENDO HIDROCARBONETOS                                                                                                                          "},
                    { key:"100410", value:" 100410 - RESÍDUOS DO TRATAMENTO DA ÁGUA DE ARREFECIMENTO NÃO ABRANGIDOS EM 100409                                                                                                                           "},
                    { key:"100499", value:" 100499 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"100501", value:" 100501 - ESCÓRIAS DA PRODUÇÃO PRIMÁRIA E SECUNDÁRIA                                                                                                                                                         "},
                    { key:"100503", value:" 100503 - POEIRAS DE GASES DE COMBUSTÃO                                                                                                                                                                      "},
                    { key:"100504", value:" 100504 - OUTRAS PARTÍCULAS E POEIRAS                                                                                                                                                                        "},
                    { key:"100505", value:" 100505 - RESÍDUOS SÓLIDOS DO TRATAMENTO DE GASES                                                                                                                                                            "},
                    { key:"100506", value:" 100506 - LAMAS E BOLOS DE FILTRAÇÃO DO TRATAMENTO DE GASES                                                                                                                                                  "},
                    { key:"100508", value:" 100508 - RESÍDUOS DO TRATAMENTO DA ÁGUA DE ARREFECIMENTO, CONTENDO HIDROCARBONETOS                                                                                                                          "},
                    { key:"100509", value:" 100509 - RESÍDUOS DO TRATAMENTO DA ÁGUA DE ARREFECIMENTO NÃO ABRANGIDOS EM 100508                                                                                                                           "},
                    { key:"100510", value:" 100510 - IMPUREZAS E ESCUMAS INFLAMÁVEIS OU QUE, EM CONTACTO COM A ÁGUA, LIBERTAM GASES INFLAMÁVEIS EM QUANTIDADES PERIGOSAS                                                                                "},
                    { key:"100511", value:" 100511 - IMPUREZAS E ESCUMAS NÃO ABRANGIDAS EM 100510                                                                                                                                                       "},
                    { key:"100599", value:" 100599 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"100601", value:" 100601 - ESCÓRIAS DA PRODUÇÃO PRIMÁRIA E SECUNDÁRIA                                                                                                                                                         "},
                    { key:"100602", value:" 100602 - IMPUREZAS E ESCUMAS DA PRODUÇÃO PRIMÁRIA E SECUNDÁRIA                                                                                                                                              "},
                    { key:"100603", value:" 100603 - POEIRAS DE GASES DE COMBUSTÃO                                                                                                                                                                      "},
                    { key:"100604", value:" 100604 - OUTRAS PARTÍCULAS E POEIRAS                                                                                                                                                                        "},
                    { key:"100606", value:" 100606 - RESÍDUOS SÓLIDOS DO TRATAMENTO DE GASES                                                                                                                                                            "},
                    { key:"100607", value:" 100607 - LAMAS E BOLOS DE FILTRAÇÃO DO TRATAMENTO DE GASES                                                                                                                                                  "},
                    { key:"100609", value:" 100609 - RESÍDUOS DO TRATAMENTO DA ÁGUA DE ARREFECIMENTO, CONTENDO HIDROCARBONETOS                                                                                                                          "},
                    { key:"100610", value:" 100610 - RESÍDUOS DO TRATAMENTO DA ÁGUA DE ARREFECIMENTO NÃO ABRANGIDOS EM 100609                                                                                                                           "},
                    { key:"100699", value:" 100699 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"100701", value:" 100701 - ESCÓRIAS DA PRODUÇÃO PRIMÁRIA E SECUNDÁRIA                                                                                                                                                         "},
                    { key:"100702", value:" 100702 - IMPUREZAS E ESCUMAS DA PRODUÇÃO PRIMÁRIA E SECUNDÁRIA                                                                                                                                              "},
                    { key:"100703", value:" 100703 - RESÍDUOS SÓLIDOS DO TRATAMENTO DE GASES                                                                                                                                                            "},
                    { key:"100704", value:" 100704 - OUTRAS PARTÍCULAS E POEIRAS                                                                                                                                                                        "},
                    { key:"100705", value:" 100705 - LAMAS E BOLOS DE FILTRAÇÃO DO TRATAMENTO DE GASES                                                                                                                                                  "},
                    { key:"100707", value:" 100707 - RESÍDUOS DO TRATAMENTO DA ÁGUA DE ARREFECIMENTO, CONTENDO HIDROCARBONETOS                                                                                                                          "},
                    { key:"100708", value:" 100708 - RESÍDUOS DO TRATAMENTO DA ÁGUA DE ARREFECIMENTO NÃO ABRANGIDOS EM 100707                                                                                                                           "},
                    { key:"100799", value:" 100799 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"100804", value:" 100804 - PARTÍCULAS E POEIRAS                                                                                                                                                                               "},
                    { key:"100808", value:" 100808 - ESCÓRIAS SALINAS DA PRODUÇÃO PRIMÁRIA E SECUNDÁRIA                                                                                                                                                 "},
                    { key:"100809", value:" 100809 - OUTRAS ESCÓRIAS                                                                                                                                                                                    "},
                    { key:"100810", value:" 100810 - IMPUREZAS E ESCUMAS INFLAMÁVEIS OU QUE, EM CONTACTO COM A ÁGUA, LIBERTAM GASES INFLAMÁVEIS EM QUANTIDADES PERIGOSAS                                                                                "},
                    { key:"100811", value:" 100811 - IMPUREZAS E ESCUMAS NÃO ABRANGIDAS EM 100810                                                                                                                                                       "},
                    { key:"100812", value:" 100812 - RESÍDUOS DO FABRICO DE ÂNODOS, CONTENDO ALCATRÃO                                                                                                                                                   "},
                    { key:"100813", value:" 100813 - RESÍDUOS DO FABRICO DE ÂNODOS CONTENDO CARBONO NÃO ABRANGIDOS EM 100812                                                                                                                            "},
                    { key:"100814", value:" 100814 - RESÍDUOS DE ÂNODOS                                                                                                                                                                                 "},
                    { key:"100815", value:" 100815 - POEIRAS DE GASES DE COMBUSTÃO, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                      "},
                    { key:"100816", value:" 100816 - POEIRAS DE GASES DE COMBUSTÃO NÃO ABRANGIDAS EM 100815                                                                                                                                             "},
                    { key:"100817", value:" 100817 - LAMAS E BOLOS DE FILTRAÇÃO DO TRATAMENTO DE GASES DE COMBUSTÃO, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                     "},
                    { key:"100818", value:" 100818 - LAMAS E BOLOS DE FILTRAÇÃO DO TRATAMENTO DE GASES DE COMBUSTÃO NÃO ABRANGIDOS EM 100817                                                                                                            "},
                    { key:"100819", value:" 100819 - RESÍDUOS DO TRATAMENTO DA ÁGUA DE ARREFECIMENTO, CONTENDO HIDROCARBONETOS                                                                                                                          "},
                    { key:"100820", value:" 100820 - RESÍDUOS DO TRATAMENTO DA ÁGUA DE ARREFECIMENTO NÃO ABRANGIDOS EM 100819                                                                                                                           "},
                    { key:"100899", value:" 100899 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"100903", value:" 100903 - ESCÓRIAS DO FORNO                                                                                                                                                                                  "},
                    { key:"100905", value:" 100905 - MACHOS E MOLDES DE FUNDIÇÃO NÃO VAZADOS, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                            "},
                    { key:"100906", value:" 100906 - MACHOS E MOLDES DE FUNDIÇÃO NÃO VAZADOS NÃO ABRANGIDOS EM 100905                                                                                                                                   "},
                    { key:"100907", value:" 100907 - MACHOS E MOLDES DE FUNDIÇÃO VAZADOS, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                "},
                    { key:"100908", value:" 100908 - MACHOS E MOLDES DE FUNDIÇÃO VAZADOS NÃO ABRANGIDOS EM 100907                                                                                                                                       "},
                    { key:"100909", value:" 100909 - POEIRAS DE GASES DE COMBUSTÃO, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                      "},
                    { key:"100910", value:" 100910 - POEIRAS DE GASES DE COMBUSTÃO NÃO ABRANGIDAS EM 100909                                                                                                                                             "},
                    { key:"100911", value:" 100911 - OUTRAS PARTÍCULAS CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                                   "},
                    { key:"100912", value:" 100912 - OUTRAS PARTÍCULAS NÃO ABRANGIDAS EM 100911                                                                                                                                                         "},
                    { key:"100913", value:" 100913 - RESÍDUOS DE AGLUTINANTES, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                           "},
                    { key:"100914", value:" 100914 - RESÍDUOS DE AGLUTINANTES NÃO ABRANGIDOS EM 100913                                                                                                                                                  "},
                    { key:"100915", value:" 100915 - RESÍDUOS DE AGENTES INDICADORES DE FENDILHAÇÃO, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                     "},
                    { key:"100916", value:" 100916 - RESÍDUOS DE AGENTES INDICADORES DE FENDILHAÇÃO NÃO ABRANGIDOS EM 100915                                                                                                                            "},
                    { key:"100999", value:" 100999 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"101003", value:" 101003 - ESCÓRIAS DO FORNO                                                                                                                                                                                  "},
                    { key:"101005", value:" 101005 - MACHOS E MOLDES DE FUNDIÇÃO NÃO VAZADOS, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                            "},
                    { key:"101006", value:" 101006 - MACHOS E MOLDES DE FUNDIÇÃO NÃO VAZADOS NÃO ABRANGIDOS EM 101005                                                                                                                                   "},
                    { key:"101007", value:" 101007 - MACHOS E MOLDES DE FUNDIÇÃO VAZADOS, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                "},
                    { key:"101008", value:" 101008 - MACHOS E MOLDES DE FUNDIÇÃO VAZADOS NÃO ABRANGIDOS EM 101007                                                                                                                                       "},
                    { key:"101009", value:" 101009 - POEIRAS DE GASES DE COMBUSTÃO, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                      "},
                    { key:"101010", value:" 101010 - POEIRAS DE GASES DE COMBUSTÃO NÃO ABRANGIDAS EM 101009                                                                                                                                             "},
                    { key:"101011", value:" 101011 - OUTRAS PARTÍCULAS CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                                   "},
                    { key:"101012", value:" 101012 - OUTRAS PARTÍCULAS NÃO ABRANGIDAS EM 101011                                                                                                                                                         "},
                    { key:"101013", value:" 101013 - RESÍDUOS DE AGLUTINANTES, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                           "},
                    { key:"101014", value:" 101014 - RESÍDUOS DE AGLUTINANTES NÃO ABRANGIDOS EM 101013                                                                                                                                                  "},
                    { key:"101015", value:" 101015 - RESÍDUOS DE AGENTES INDICADORES DE FENDILHAÇÃO, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                     "},
                    { key:"101016", value:" 101016 - RESÍDUOS DE AGENTES INDICADORES DE FENDILHAÇÃO NÃO ABRANGIDOS EM 101015                                                                                                                            "},
                    { key:"101099", value:" 101099 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"101103", value:" 101103 - RESÍDUOS DE MATERIAIS FIBROSOS À BASE DE VIDRO                                                                                                                                                     "},
                    { key:"101105", value:" 101105 - PARTÍCULAS E POEIRAS                                                                                                                                                                               "},
                    { key:"101109", value:" 101109 - RESÍDUOS DA PREPARAÇÃO DA MISTURA (ANTES DO PROCESSO TÉRMICO), CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                      "},
                    { key:"101110", value:" 101110 - RESÍDUOS DA PREPARAÇÃO DA MISTURA (ANTES DO PROCESSO TÉRMICO) NÃO ABRANGIDOS EM 101109                                                                                                             "},
                    { key:"101111", value:" 101111 - RESÍDUOS DE VIDRO EM PEQUENAS PARTÍCULAS E EM PÓ DE VIDRO, CONTENDO METAIS PESADOS (POR EXEMPLO, TUBOS CATÓDICOS)                                                                                  "},
                    { key:"101112", value:" 101112 - RESÍDUOS DE VIDRO NÃO ABRANGIDOS EM 101111                                                                                                                                                         "},
                    { key:"101113", value:" 101113 - LAMAS DE POLIMENTO E RECTIFICAÇÃO, DE VIDRO, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                        "},
                    { key:"101114", value:" 101114 - LAMAS DE POLIMENTO E RECTIFICAÇÃO DE VIDRO NÃO ABRANGIDAS EM 101113                                                                                                                                "},
                    { key:"101115", value:" 101115 - RESÍDUOS SÓLIDOS DO TRATAMENTO DE GASES DE COMBUSTÃO, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                               "},
                    { key:"101116", value:" 101116 - RESÍDUOS SÓLIDOS DO TRATAMENTO DE GASES DE COMBUSTÃO NÃO ABRANGIDOS EM 101115                                                                                                                      "},
                    { key:"101117", value:" 101117 - LAMAS E BOLOS DE FILTRAÇÃO DO TRATAMENTO DE GASES DE COMBUSTÃO, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                     "},
                    { key:"101118", value:" 101118 - LAMAS E BOLOS DE FILTRAÇÃO DO TRATAMENTO DE GASES DE COMBUSTÃO NÃO ABRANGIDOS EM 101117                                                                                                            "},
                    { key:"101119", value:" 101119 - RESÍDUOS SÓLIDOS DO TRATAMENTO LOCAL DE EFLUENTES, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                  "},
                    { key:"101120", value:" 101120 - RESÍDUOS SÓLIDOS DO TRATAMENTO LOCAL DE EFLUENTES NÃO ABRANGIDOS EM 101119                                                                                                                         "},
                    { key:"101199", value:" 101199 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"101201", value:" 101201 - RESÍDUOS DA PREPARAÇÃO DA MISTURA (ANTES DO PROCESSO TÉRMICO)                                                                                                                                      "},
                    { key:"101203", value:" 101203 - PARTÍCULAS E POEIRAS                                                                                                                                                                               "},
                    { key:"101205", value:" 101205 - LAMAS E BOLOS DE FILTRAÇÃO DO TRATAMENTO DE GASES                                                                                                                                                  "},
                    { key:"101206", value:" 101206 - MOLDES FORA DE USO                                                                                                                                                                                 "},
                    { key:"101208", value:" 101208 - RESÍDUOS DO FABRICO DE PEÇAS CERÂMICAS, TIJOLOS, LADRILHOS, TELHAS E PRODUTOS DE CONSTRUÇÃO (APÓS O PROCESSO TÉRMICO)                                                                              "},
                    { key:"101209", value:" 101209 - RESÍDUOS SÓLIDOS DO TRATAMENTO DE GASES, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                            "},
                    { key:"101210", value:" 101210 - RESÍDUOS SÓLIDOS DO TRATAMENTO DE GASES NÃO ABRANGIDOS EM 101209                                                                                                                                   "},
                    { key:"101211", value:" 101211 - RESÍDUOS DE VITRIFICAÇÃO, CONTENDO METAIS PESADOS                                                                                                                                                  "},
                    { key:"101212", value:" 101212 - RESÍDUOS DE VITRIFICAÇÃO NÃO ABRANGIDOS EM 101211                                                                                                                                                  "},
                    { key:"101213", value:" 101213 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES                                                                                                                                                             "},
                    { key:"101299", value:" 101299 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"101301", value:" 101301 - RESÍDUOS DA PREPARAÇÃO DE MISTURAS ANTES DO PROCESSO TÉRMICO                                                                                                                                       "},
                    { key:"101304", value:" 101304 - RESÍDUOS DA CALCINAÇÃO E HIDRATAÇÃO DA CAL                                                                                                                                                         "},
                    { key:"101306", value:" 101306 - PARTÍCULAS E POEIRAS (EXCEPTO 101312 E 101313)                                                                                                                                                     "},
                    { key:"101307", value:" 101307 - LAMAS E BOLOS DE FILTRAÇÃO DO TRATAMENTO DE GASES                                                                                                                                                  "},
                    { key:"101309", value:" 101309 - RESÍDUOS DO FABRICO DE FIBROCIMENTO, CONTENDO AMIANTO                                                                                                                                              "},
                    { key:"101310", value:" 101310 - RESÍDUOS DO FABRICO DE FIBROCIMENTO NÃO ABRANGIDOS EM 101309                                                                                                                                       "},
                    { key:"101311", value:" 101311 - RESÍDUOS DE MATERIAIS COMPÓSITOS À BASE DE CIMENTO NÃO ABRANGIDOS EM 101309 E 101310                                                                                                               "},
                    { key:"101312", value:" 101312 - RESÍDUOS SÓLIDOS DO TRATAMENTO DE GASES, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                            "},
                    { key:"101313", value:" 101313 - RESÍDUOS SÓLIDOS DO TRATAMENTO DE GASES NÃO ABRANGIDOS EM 101312                                                                                                                                   "},
                    { key:"101314", value:" 101314 - RESÍDUOS DE BETÃO E LAMAS DE BETÃO                                                                                                                                                                 "},
                    { key:"101399", value:" 101399 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"101401", value:" 101401 - RESÍDUOS DE LIMPEZA DE GASES, CONTENDO MERCÚRIO                                                                                                                                                    "},
                    { key:"110105", value:" 110105 - ÁCIDOS DE DECAPAGEM                                                                                                                                                                                "},
                    { key:"110106", value:" 110106 - ÁCIDOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                             "},
                    { key:"110107", value:" 110107 - BASES DE DECAPAGEM                                                                                                                                                                                 "},
                    { key:"110108", value:" 110108 - LAMAS DE FOSFATAÇÃO                                                                                                                                                                                "},
                    { key:"110109", value:" 110109 - LAMAS E BOLOS DE FILTRAÇÃO, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                         "},
                    { key:"110110", value:" 110110 - LAMAS E BOLOS DE FILTRAÇÃO NÃO ABRANGIDOS EM 110109                                                                                                                                                "},
                    { key:"110111", value:" 110111 - LÍQUIDOS DE LAVAGEM AQUOSOS, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                        "},
                    { key:"110112", value:" 110112 - LÍQUIDOS DE LAVAGEM AQUOSOS NÃO ABRANGIDOS EM 110111                                                                                                                                               "},
                    { key:"110113", value:" 110113 - RESÍDUOS DE DESENGORDURAMENTO, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                      "},
                    { key:"110114", value:" 110114 - RESÍDUOS DE DESENGORDURAMENTO NÃO ABRANGIDOS EM 110113                                                                                                                                             "},
                    { key:"110115", value:" 110115 - ELUATOS E LAMAS DE SISTEMAS DE MEMBRANAS OU DE PERMUTA IÓNICA, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                      "},
                    { key:"110116", value:" 110116 - RESINAS DE PERMUTA IÓNICA, SATURADAS OU USADAS                                                                                                                                                     "},
                    { key:"110198", value:" 110198 - OUTROS RESÍDUOS CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                                     "},
                    { key:"110199", value:" 110199 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"110202", value:" 110202 - LAMAS DA HIDROMETALURGIA DO ZINCO (INCLUINDO JAROSITA, GOETITE)                                                                                                                                    "},
                    { key:"110203", value:" 110203 - RESÍDUOS DA PRODUÇÃO DE ÂNODOS DOS PROCESSOS ELECTRÓLITICOS AQUOSOS                                                                                                                                "},
                    { key:"110205", value:" 110205 - RESÍDUOS DE PROCESSOS HIDROMETALÚRGICOS DO COBRE, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                   "},
                    { key:"110206", value:" 110206 - RESÍDUOS DE PROCESSOS HIDROMETALÚRGICOS DO COBRE NÃO ABRANGIDOS EM 120105                                                                                                                          "},
                    { key:"110207", value:" 110207 - OUTROS RESÍDUOS CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                                     "},
                    { key:"110299", value:" 110299 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"110301", value:" 110301 - RESÍDUOS CONTENDO CIANETOS                                                                                                                                                                         "},
                    { key:"110302", value:" 110302 - OUTROS RESÍDUOS                                                                                                                                                                                    "},
                    { key:"110501", value:" 110501 - ESCÓRIAS DE ZINCO                                                                                                                                                                                  "},
                    { key:"110502", value:" 110502 - CINZAS DE ZINCO                                                                                                                                                                                    "},
                    { key:"110503", value:" 110503 - RESÍDUOS SÓLIDOS DO TRATAMENTO DE GASES                                                                                                                                                            "},
                    { key:"110504", value:" 110504 - FLUXANTES USADOS                                                                                                                                                                                   "},
                    { key:"110599", value:" 110599 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"120101", value:" 120101 - APARAS E LIMALHAS DE METAIS FERROSOS                                                                                                                                                               "},
                    { key:"120102", value:" 120102 - POEIRAS E PARTÍCULAS DE METAIS FERROSOS                                                                                                                                                            "},
                    { key:"120103", value:" 120103 - APARAS E LIMALHAS DE METAIS NÃO FERROSOS                                                                                                                                                           "},
                    { key:"120104", value:" 120104 - POEIRAS E PARTÍCULAS DE METAIS NÃO FERROSOS                                                                                                                                                        "},
                    { key:"120105", value:" 120105 - APARAS DE MATÉRIAS PLÁSTICAS                                                                                                                                                                       "},
                    { key:"120106", value:" 120106 - ÓLEOS MINERAIS DE MAQUINAGEM, COM HALOGÉNEOS (EXCEPTO EMULSÕES E SOLUÇÕES)                                                                                                                         "},
                    { key:"120107", value:" 120107 - ÓLEOS MINERAIS DE MAQUINAGEM, SEM HALOGÉNEOS (EXCEPTO EMULSÕES E SOLUÇÕES)                                                                                                                         "},
                    { key:"120108", value:" 120108 - EMULSÕES E SOLUÇÕES DE MAQUINAGEM, COM HALOGÉNEOS                                                                                                                                                  "},
                    { key:"120109", value:" 120109 - EMULSÕES E SOLUÇÕES DE MAQUINAGEM, SEM HALOGÉNEOS                                                                                                                                                  "},
                    { key:"120110", value:" 120110 - ÓLEOS SINTÉTICOS DE MAQUINAGEM                                                                                                                                                                     "},
                    { key:"120112", value:" 120112 - CERAS E GORDURAS USADAS                                                                                                                                                                            "},
                    { key:"120113", value:" 120113 - RESÍDUOS DE SOLDADURA                                                                                                                                                                              "},
                    { key:"120114", value:" 120114 - LAMAS DE MAQUINAGEM, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                                "},
                    { key:"120115", value:" 120115 - LAMAS DE MAQUINAGEM NÃO ABRANGIDAS EM 120114                                                                                                                                                       "},
                    { key:"120116", value:" 120116 - RESÍDUOS DE MATERIAIS DE GRANALHAGEM, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                               "},
                    { key:"120117", value:" 120117 - RESÍDUOS DE MATERIAIS DE GRANALHAGEM NÃO ABRANGIDOS EM 120116                                                                                                                                      "},
                    { key:"120118", value:" 120118 - LAMAS METÁLICAS (LAMAS DE RECTIFICAÇÃO, SUPERACABAMENTO E LIXAGEM) CONTENDO ÓLEO                                                                                                                   "},
                    { key:"120119", value:" 120119 - ÓLEOS DE MAQUINAGEM FACILMENTE BIODEGRADÁVEIS                                                                                                                                                      "},
                    { key:"120120", value:" 120120 - MÓS E MATERIAIS DE RECTIFICAÇÃO USADOS, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                             "},
                    { key:"120121", value:" 120121 - MÓS E MATERIAIS DE RECTIFICAÇÃO USADOS NÃO ABRANGIDOS EM 120120                                                                                                                                    "},
                    { key:"120199", value:" 120199 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"120301", value:" 120301 - LÍQUIDOS DE LAVAGEM AQUOSOS                                                                                                                                                                        "},
                    { key:"120302", value:" 120302 - RESÍDUOS DE DESENGORDURAMENTO A VAPOR                                                                                                                                                              "},
                    { key:"130101", value:" 130101 - ÓLEOS HIDRÁULICOS CONTENDO PCB                                                                                                                                                                     "},
                    { key:"130104", value:" 130104 - EMULSÕES CLORADAS                                                                                                                                                                                  "},
                    { key:"130105", value:" 130105 - EMULSÕES NÃO CLORADAS                                                                                                                                                                              "},
                    { key:"130109", value:" 130109 - ÓLEOS HIDRÁULICOS MINERAIS CLORADOS                                                                                                                                                                "},
                    { key:"130110", value:" 130110 - ÓLEOS HIDRÁULICOS MINERAIS NÃO CLORADOS                                                                                                                                                            "},
                    { key:"130111", value:" 130111 - ÓLEOS HIDRÁULICOS SINTÉTICOS                                                                                                                                                                       "},
                    { key:"130112", value:" 130112 - ÓLEOS HIDRÁULICOS FACILMENTE BIODEGRADÁVEIS                                                                                                                                                        "},
                    { key:"130113", value:" 130113 - OUTROS ÓLEOS HIDRÁULICOS                                                                                                                                                                           "},
                    { key:"130204", value:" 130204 - ÓLEOS MINERAIS CLORADOS DE MOTORES, TRANSMISSÕES E LUBRIFICAÇÃO                                                                                                                                    "},
                    { key:"130205", value:" 130205 - ÓLEOS MINERAIS NÃO CLORADOS DE MOTORES, TRANSMISSÕES E LUBRIFICAÇÃO                                                                                                                                "},
                    { key:"130206", value:" 130206 - ÓLEOS SINTÉTICOS DE MOTORES, TRANSMISSÕES E LUBRIFICAÇÃO                                                                                                                                           "},
                    { key:"130207", value:" 130207 - ÓLEOS FACILMENTE BIODEGRADÁVEIS DE MOTORES, TRANSMISSÕES E LUBRIFICAÇÃO                                                                                                                            "},
                    { key:"130208", value:" 130208 - OUTROS ÓLEOS DE MOTORES, TRANSMISSÕES E LUBRIFICAÇÃO                                                                                                                                               "},
                    { key:"130301", value:" 130301 - ÓLEOS ISOLANTES E DE TRANSMISSÃO DE CALOR, CONTENDO PCB                                                                                                                                            "},
                    { key:"130306", value:" 130306 - ÓLEOS MINERAIS ISOLANTES E DE TRANSMISSÃO DE CALOR CLORADOS, NÃO ABRANGIDOS EM 130301                                                                                                              "},
                    { key:"130307", value:" 130307 - ÓLEOS MINERAIS ISOLANTES E DE TRANSMISSÃO DE CALOR NÃO CLORADOS                                                                                                                                    "},
                    { key:"130308", value:" 130308 - ÓLEOS SINTÉTICOS ISOLANTES E DE TRANSMISSÃO DE CALOR                                                                                                                                               "},
                    { key:"130309", value:" 130309 - ÓLEOS FACILMENTE BIODEGRADÁVEIS ISOLANTES E DE TRANSMISSÃO DE CALOR                                                                                                                                "},
                    { key:"130310", value:" 130310 - OUTROS ÓLEOS ISOLANTES E DE TRANSMISSÃO DE CALOR                                                                                                                                                   "},
                    { key:"130401", value:" 130401 - ÓLEOS DE PORÃO DE NAVIOS DE NAVEGAÇÃO INTERIOR                                                                                                                                                     "},
                    { key:"130402", value:" 130402 - ÓLEOS DE PORÃO PROVENIENTES DAS CANALIZAÇÕES DOS CAIS                                                                                                                                              "},
                    { key:"130403", value:" 130403 - ÓLEOS DE PORÃO DE OUTROS TIPOS DE NAVIOS                                                                                                                                                           "},
                    { key:"130501", value:" 130501 - RESÍDUOS SÓLIDOS PROVENIENTES DE DESARENADORES E DE SEPARADORES ÓLEO/ÁGUA                                                                                                                          "},
                    { key:"130502", value:" 130502 - LAMAS PROVENIENTES DOS SEPARADORES ÓLEO/ÁGUA                                                                                                                                                       "},
                    { key:"130503", value:" 130503 - LAMAS PROVENIENTES DO INTERCEPTOR                                                                                                                                                                  "},
                    { key:"130506", value:" 130506 - ÓLEOS PROVENIENTES DOS SEPARADORES ÓLEO/ÁGUA                                                                                                                                                       "},
                    { key:"130507", value:" 130507 - ÁGUA COM ÓLEO PROVENIENTE DOS SEPARADORES ÓLEO/ÁGUA                                                                                                                                                "},
                    { key:"130508", value:" 130508 - MISTURA DE RESÍDUOS PROVENIENTES DE DESARENADORES E DE SEPARADORES ÓLEO/ÁGUA                                                                                                                       "},
                    { key:"130701", value:" 130701 - FUELÓLEO E GASÓLEO                                                                                                                                                                                 "},
                    { key:"130702", value:" 130702 - GASOLINA                                                                                                                                                                                           "},
                    { key:"130703", value:" 130703 - OUTROS COMBUSTÍVEIS (INCLUINDO MISTURAS)                                                                                                                                                           "},
                    { key:"130801", value:" 130801 - LAMAS OU EMULSÕES DE DESSALINIZAÇÃO                                                                                                                                                                "},
                    { key:"130802", value:" 130802 - OUTRAS EMULSÕES                                                                                                                                                                                    "},
                    { key:"130899", value:" 130899 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"140601", value:" 140601 - CLOROFLUORCARBONETOS, HCFC, HFC                                                                                                                                                                    "},
                    { key:"140602", value:" 140602 - OUTROS SOLVENTES E MISTURAS DE SOLVENTES HALOGENADOS                                                                                                                                               "},
                    { key:"140603", value:" 140603 - OUTROS SOLVENTES E MISTURAS DE SOLVENTES                                                                                                                                                           "},
                    { key:"140604", value:" 140604 - LAMAS OU RESÍDUOS SÓLIDOS, CONTENDO SOLVENTES HALOGENADOS                                                                                                                                          "},
                    { key:"140605", value:" 140605 - LAMAS OU RESÍDUOS SÓLIDOS, CONTENDO OUTROS SOLVENTES                                                                                                                                               "},
                    { key:"150101", value:" 150101 - EMBALAGENS DE PAPEL E CARTÃO                                                                                                                                                                       "},
                    { key:"150102", value:" 150102 - EMBALAGENS DE PLÁSTICO                                                                                                                                                                             "},
                    { key:"150103", value:" 150103 - EMBALAGENS DE MADEIRA                                                                                                                                                                              "},
                    { key:"150104", value:" 150104 - EMBALAGENS DE METAL                                                                                                                                                                                "},
                    { key:"150105", value:" 150105 - EMBALAGENS COMPÓSITAS                                                                                                                                                                              "},
                    { key:"150106", value:" 150106 - MISTURAS DE EMBALAGENS                                                                                                                                                                             "},
                    { key:"150107", value:" 150107 - EMBALAGENS DE VIDRO                                                                                                                                                                                "},
                    { key:"150109", value:" 150109 - EMBALAGENS TÊXTEIS                                                                                                                                                                                 "},
                    { key:"150110", value:" 150110 - EMBALAGENS CONTENDO OU CONTAMINADAS POR RESÍDUOS DE SUBSTÂNCIAS PERIGOSAS                                                                                                                          "},
                    { key:"150111", value:" 150111 - EMBALAGENS DE METAL, INCLUINDO RECIPIENTES VAZIOS SOB PRESSÃO, COM UMA MATRIZ POROSA SÓLIDA PERIGOSA (POR EXEMPLO, AMIANTO)                                                                        "},
                    { key:"150202", value:" 150202 - ABSORV., MAT. FILTRANT. (INCLUINDO FILT. DE ÓLEO NÃO ANTERIORMENTE ESPECIF.), PANOS DE LIMPEZA E VEST. DE PROTECÇÃO CONTAMINADOS POR SUBST. PERIGOSAS                                              "},
                    { key:"150203", value:" 150203 - ABSORVENTES, MATERIAIS FILTRANTES, PANOS DE LIMPEZA E VESTUÁRIO DE PROTECÇÃO NÃO ABRANGIDOS EM 150202                                                                                              "},
                    { key:"160103", value:" 160103 - PNEUS USADOS                                                                                                                                                                                       "},
                    { key:"160104", value:" 160104 - VEÍCULOS FORA DE USO                                                                                                                                                                               "},
                    { key:"160106", value:" 160106 - VEÍCULOS EM FIM DE VIDA QUE NÃO CONTENHAM LÍQUIDOS OU OUTROS COMPONENTES PERIGOSOS                                                                                                                 "},
                    { key:"160107", value:" 160107 - FILTROS DE ÓLEO                                                                                                                                                                                    "},
                    { key:"160108", value:" 160108 - COMPONENTES CONTENDO MERCÚRIO                                                                                                                                                                      "},
                    { key:"160109", value:" 160109 - COMPONENTES CONTENDO PCB                                                                                                                                                                           "},
                    { key:"160110", value:" 160110 - COMPONENTES EXPLOSIVOS (POR EXEMPLO, ALMOFADAS DE AR (AIR BAGS))                                                                                                                                   "},
                    { key:"160111", value:" 160111 - PASTILHAS DE TRAVÕES, CONTENDO AMIANTO                                                                                                                                                             "},
                    { key:"160112", value:" 160112 - PASTILHAS DE TRAVÕES NÃO ABRANGIDAS EM 160111                                                                                                                                                      "},
                    { key:"160113", value:" 160113 - FLUIDOS DE TRAVÕES                                                                                                                                                                                 "},
                    { key:"160114", value:" 160114 - FLUIDOS ANTICONGELANTES CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                             "},
                    { key:"160115", value:" 160115 - FLUIDOS ANTICONGELANTES NÃO ABRANGIDOS EM 160114                                                                                                                                                   "},
                    { key:"160116", value:" 160116 - DEPÓSITOS PARA GÁS LIQUEFEITO                                                                                                                                                                      "},
                    { key:"160117", value:" 160117 - METAIS FERROSOS                                                                                                                                                                                    "},
                    { key:"160118", value:" 160118 - METAIS NÃO FERROSOS                                                                                                                                                                                "},
                    { key:"160119", value:" 160119 - PLÁSTICO                                                                                                                                                                                           "},
                    { key:"160120", value:" 160120 - VIDRO                                                                                                                                                                                              "},
                    { key:"160121", value:" 160121 - COMPONENTES PERIGOSOS NÃO ABRANGIDOS EM 160107 A 16011160113 E 160114                                                                                                                              "},
                    { key:"160122", value:" 160122 - COMPONENTES NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                        "},
                    { key:"160199", value:" 160199 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"160209", value:" 160209 - TRANSFORMADORES E CONDENSADORES, CONTENDO PCB                                                                                                                                                      "},
                    { key:"160210", value:" 160210 - EQUIPAMENTO FORA DE USO, CONTENDO OU CONTAMINADO POR PCB, NÃO ABRANGIDO EM 160209                                                                                                                  "},
                    { key:"160211", value:" 160211 - EQUIPAMENTO FORA DE USO, CONTENDO CLOROFLUORCARBONETOS, HCFC, HFC                                                                                                                                  "},
                    { key:"160212", value:" 160212 - EQUIPAMENTO FORA DE USO, CONTENDO AMIANTO LIVRE                                                                                                                                                    "},
                    { key:"160213", value:" 160213 - EQUIPAMENTO FORA DE USO, CONTENDO COMPONENTES PERIGOSOS NÃO ABRANGIDOS EM 160209 A 160212                                                                                                          "},
                    { key:"160214", value:" 160214 - EQUIPAMENTO FORA DE USO NÃO ABRANGIDO EM 160209 A 160213                                                                                                                                           "},
                    { key:"160215", value:" 160215 - COMPONENTES PERIGOSOS RETIRADOS DE EQUIPAMENTO FORA DE USO                                                                                                                                         "},
                    { key:"160216", value:" 160216 - COMPONENTES RETIRADOS DE EQUIPAMENTO FORA DE USO NÃO ABRANGIDOS EM 160215                                                                                                                          "},
                    { key:"160303", value:" 160303 - RESÍDUOS INORGÂNICOS CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                                "},
                    { key:"160304", value:" 160304 - RESÍDUOS INORGÂNICOS NÃO ABRANGIDOS EM 160303                                                                                                                                                      "},
                    { key:"160305", value:" 160305 - RESÍDUOS ORGÂNICOS CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                                  "},
                    { key:"160306", value:" 160306 - RESÍDUOS ORGÂNICOS NÃO ABRANGIDOS EM 160305                                                                                                                                                        "},
                    { key:"160401", value:" 160401 - RESÍDUOS DE MUNIÇÕES                                                                                                                                                                               "},
                    { key:"160402", value:" 160402 - RESÍDUOS DE FOGO DE ARTIFÍCIO                                                                                                                                                                      "},
                    { key:"160403", value:" 160403 - OUTROS RESÍDUOS DE EXPLOSIVOS                                                                                                                                                                      "},
                    { key:"160504", value:" 160504 - GASES EM RECIPIENTES SOB PRESSÃO (INCLUINDO HALONS), CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                "},
                    { key:"160505", value:" 160505 - GASES EM RECIPIENTES SOB PRESSÃO NÃO ABRANGIDOS EM 160504                                                                                                                                          "},
                    { key:"160506", value:" 160506 - PRODUTOS QUÍMICOS DE LABORATÓRIO, CONTENDO OU COMPOSTOS POR SUBSTÂNCIAS PERIGOSAS, INCLUINDO MISTURAS DE PRODUTOS QUÍMICOS DE LABORATÓRIO                                                          "},
                    { key:"160507", value:" 160507 - PRODUTOS QUÍMICOS INORGÂNICOS DE LABORATÓRIO, CONTENDO OU COMPOSTOS POR SUBSTÂNCIAS PERIGOSAS                                                                                                      "},
                    { key:"160508", value:" 160508 - PRODUTOS QUÍMICOS ORGÂNICOS FORA DE USO, CONTENDO OU COMPOSTOS POR SUBSTÂNCIAS PERIGOSAS                                                                                                           "},
                    { key:"160509", value:" 160509 - PRODUTOS QUÍMICOS FORA DE USO NÃO ABRANGIDOS EM 160506, 160507 OU 160508                                                                                                                           "},
                    { key:"160601", value:" 160601 - ACUMULADORES DE CHUMBO                                                                                                                                                                             "},
                    { key:"160602", value:" 160602 - ACUMULADORES DE NÍQUEL - CÁDMIO                                                                                                                                                                    "},
                    { key:"160603", value:" 160603 - PILHAS CONTENDO MERCÚRIO                                                                                                                                                                           "},
                    { key:"160604", value:" 160604 - PILHAS ALCALINAS (EXCEPTO 160603)                                                                                                                                                                  "},
                    { key:"160605", value:" 160605 - OUTRAS PILHAS E ACUMULADORES                                                                                                                                                                       "},
                    { key:"160606", value:" 160606 - ELECTRÓLITOS DE PILHAS E ACUMULADORES RECOLHIDOS SEPARADAMENTE                                                                                                                                     "},
                    { key:"160708", value:" 160708 - RESÍDUOS CONTENDO HIDROCARBONETOS                                                                                                                                                                  "},
                    { key:"160709", value:" 160709 - RESÍDUOS CONTENDO OUTRAS SUBSTÂNCIAS PERIGOSAS                                                                                                                                                     "},
                    { key:"160799", value:" 160799 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"160801", value:" 160801 - CATALISADORES USADOS CONTENDO OURO, PRATA, RÉNIO, RÓDIO, PALÁDIO, IRÍDIO OU PLATINA (EXCEPTO 160807)                                                                                               "},
                    { key:"160802", value:" 160802 - CATALISADORES USADOS CONTENDO METAIS DE TRANSIÇÃO OU COMPOSTOS DE METAIS DE TRANSIÇÃO PERIGOSOS                                                                                                    "},
                    { key:"160803", value:" 160803 - CATALISADORES USADOS CONTENDO METAIS DE TRANSIÇÃO OU COMPOSTOS DE METAIS DE TRANSIÇÃO, NÃO ESPECIFICADOS DE OUTRA FORMA                                                                            "},
                    { key:"160804", value:" 160804 - CATALISADORES USADOS DE CRACKING CATALÍTICO EM LEITO FLUIDO (EXCEPTO 160807)                                                                                                                       "},
                    { key:"160805", value:" 160805 - CATALISADORES USADOS CONTENDO ÁCIDO FOSFÓRICO                                                                                                                                                      "},
                    { key:"160806", value:" 160806 - LÍQUIDOS USADOS UTILIZADOS COMO CATALISADORES                                                                                                                                                      "},
                    { key:"160807", value:" 160807 - CATALISADORES USADOS CONTAMINADOS COM SUBSTÂNCIAS PERIGOSAS                                                                                                                                        "},
                    { key:"160901", value:" 160901 - PERMANGANATOS, POR EXEMPLO, PERMANGANATO DE SÓDIO                                                                                                                                                  "},
                    { key:"160902", value:" 160902 - CROMATOS, POR EXEMPLO, CROMATO DE POTÁSSIO, DICROMATO DE POTÁSSIO OU DE SÓDIO                                                                                                                      "},
                    { key:"160903", value:" 160903 - PERÓXIDOS, POR EXEMPLO, ÁGUA OXIGENADA                                                                                                                                                             "},
                    { key:"160904", value:" 160904 - SUBSTÂNCIAS OXIDANTES NÃO ANTERIORMENTE ESPECIFICADAS                                                                                                                                              "},
                    { key:"161001", value:" 161001 - RESÍDUOS LÍQUIDOS AQUOSOS CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                           "},
                    { key:"161002", value:" 161002 - RESÍDUOS LÍQUIDOS AQUOSOS NÃO ABRANGIDOS EM 161001                                                                                                                                                 "},
                    { key:"161003", value:" 161003 - CONCENTRADOS AQUOSOS CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                                "},
                    { key:"161004", value:" 161004 - CONCENTRADOS AQUOSOS NÃO ABRANGIDOS EM 161003                                                                                                                                                      "},
                    { key:"161101", value:" 161101 - REVESTIMENTOS DE FORNOS E REFRACTÁRIOS À BASE DE CARBONO, PROVENIENTES DE PROCESSOS METALÚRGICOS, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                   "},
                    { key:"161102", value:" 161102 - REVESTIMENTOS DE FORNOS E REFRACTÁRIOS À BASE DE CARBONO NÃO ABRANGIDOS EM 161101                                                                                                                  "},
                    { key:"161103", value:" 161103 - OUTROS REVESTIMENTOS DE FORNOS E REFRACTÁRIOS, PROVENIENTES DE PROCESSOS METALÚRGICOS, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                              "},
                    { key:"161104", value:" 161104 - OUTROS REVESTIMENTOS DE FORNOS E REFRACTÁRIOS NÃO ABRANGIDOS EM 161103                                                                                                                             "},
                    { key:"161105", value:" 161105 - REVESTIMENTOS DE FORNOS E REFRACTÁRIOS, PROVENIENTES DE PROCESSOS NÃO METALÚRGICOS, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                 "},
                    { key:"161106", value:" 161106 - REVESTIMENTOS DE FORNOS E REFRACTÁRIOS, PROVENIENTES DE PROCESSOS NÃO METALÚRGICOS NÃO ABRANGIDOS EM 161105                                                                                        "},
                    { key:"170101", value:" 170101 - BETÃO                                                                                                                                                                                              "},
                    { key:"170102", value:" 170102 - TIJOLOS                                                                                                                                                                                            "},
                    { key:"170103", value:" 170103 - LADRILHOS, TELHAS E MATERIAIS CERÂMICOS                                                                                                                                                            "},
                    { key:"170106", value:" 170106 - MISTURA OU FRACÇÕES SEPARADAS DE BETÃO, TIJOLOS, LADRILHOS, TELHAS E MATERIAIS CERÂMICOS, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                           "},
                    { key:"170107", value:" 170107 - MISTURAS DE BETÃO, TIJOLOS, LADRILHOS, TELHAS E MATERIAIS CERÂMICOS, NÃO ABRANGIDAS EM 170106                                                                                                      "},
                    { key:"170201", value:" 170201 - MADEIRA                                                                                                                                                                                            "},
                    { key:"170202", value:" 170202 - VIDRO                                                                                                                                                                                              "},
                    { key:"170203", value:" 170203 - PLÁSTICO                                                                                                                                                                                           "},
                    { key:"170204", value:" 170204 - VIDRO, PLÁSTICO E MADEIRA, CONTENDO OU CONTAMINADOS COM SUBSTÂNCIAS PERIGOSAS                                                                                                                      "},
                    { key:"170301", value:" 170301 - MISTURAS BETUMINOSAS CONTENDO ALCATRÃO                                                                                                                                                             "},
                    { key:"170302", value:" 170302 - MISTURAS BETUMINOSAS NÃO ABRANGIDAS EM 170301                                                                                                                                                      "},
                    { key:"170303", value:" 170303 - ALCATRÃO E PRODUTOS DE ALCATRÃO                                                                                                                                                                    "},
                    { key:"170401", value:" 170401 - COBRE, BRONZE E LATÃO                                                                                                                                                                              "},
                    { key:"170402", value:" 170402 - ALUMÍNIO                                                                                                                                                                                           "},
                    { key:"170403", value:" 170403 - CHUMBO                                                                                                                                                                                             "},
                    { key:"170404", value:" 170404 - ZINCO                                                                                                                                                                                              "},
                    { key:"170405", value:" 170405 - FERRO E AÇO                                                                                                                                                                                        "},
                    { key:"170406", value:" 170406 - ESTANHO                                                                                                                                                                                            "},
                    { key:"170407", value:" 170407 - MISTURA DE METAIS                                                                                                                                                                                  "},
                    { key:"170409", value:" 170409 - RESÍDUOS METÁLICOS CONTAMINADOS COM SUBSTÂNCIAS PERIGOSAS                                                                                                                                          "},
                    { key:"170410", value:" 170410 - CABOS CONTENDO HIDROCARBONETOS, ALCATRÃO OU OUTRAS SUBSTÂNCIAS PERIGOSAS                                                                                                                           "},
                    { key:"170411", value:" 170411 - CABOS NÃO ABRANGIDOS 170410                                                                                                                                                                        "},
                    { key:"170503", value:" 170503 - SOLOS E ROCHAS, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                                     "},
                    { key:"170504", value:" 170504 - SOLOS E ROCHAS NÃO ABRANGIDOS EM 170503                                                                                                                                                            "},
                    { key:"170505", value:" 170505 - LAMAS DE DRAGAGEM, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                                  "},
                    { key:"170506", value:" 170506 - LAMAS DE DRAGAGEM, NÃO ABRANGIDAS EM 170505                                                                                                                                                        "},
                    { key:"170507", value:" 170507 - BALASTROS DE LINHAS DE CAMINHO-DE-FERRO, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                            "},
                    { key:"170508", value:" 170508 - BALASTROS DE LINHAS DE CAMINHO-DE-FERRO, NÃO ABRANGIDOS EM 170507                                                                                                                                  "},
                    { key:"170601", value:" 170601 - MATERIAIS DE ISOLAMENTO, CONTENDO AMIANTO                                                                                                                                                          "},
                    { key:"170603", value:" 170603 - OUTROS MATERIAIS DE ISOLAMENTO, CONTENDO OU CONSTITUÍDOS POR SUBSTÂNCIAS PERIGOSAS                                                                                                                 "},
                    { key:"170604", value:" 170604 - MATERIAIS DE ISOLAMENTO, NÃO ABRANGIDOS EM 170601 E 170603                                                                                                                                         "},
                    { key:"170605", value:" 170605 - MATERIAIS DE CONSTRUÇÃO, CONTENDO AMIANTO                                                                                                                                                          "},
                    { key:"170801", value:" 170801 - MATERIAIS DE CONSTRUÇÃO À BASE DE GESSO, CONTAMINADOS COM SUBSTÂNCIAS PERIGOSAS                                                                                                                    "},
                    { key:"170802", value:" 170802 - MATERIAIS DE CONSTRUÇÃO À BASE DE GESSO, NÃO ABRANGIDOS EM 170801                                                                                                                                  "},
                    { key:"170901", value:" 170901 - RESÍDUOS DE CONSTRUÇÃO E DEMOLIÇÃO, CONTENDO MERCÚRIO                                                                                                                                              "},
                    { key:"170902", value:" 170902 - RES. DE CONSTR. E DEMOL., CONTENDO PCB (P.E.,VEDANTES COM PCB,REVEST. DE PISO À BASE DE RESINAS C/ PCB,ENVIDRAÇ. VEDADOS CONTENDO PCB,CONDENS. C/ PCB)                                             "},
                    { key:"170903", value:" 170903 - OUTROS RESÍDUOS DE CONSTRUÇÃO E DEMOLIÇÃO (INCLUINDO MISTURAS DE RESÍDUOS), CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                         "},
                    { key:"170904", value:" 170904 - MISTURA DE RESÍDUOS DE CONSTRUÇÃO E DEMOLIÇÃO, NÃO ABRANGIDOS EM 170901, 170902 E 170903                                                                                                           "},
                    { key:"180101", value:" 180101 - OBJECTOS CORTANTES E PERFURANTES (EXCEPTO 180103)                                                                                                                                                  "},
                    { key:"180102", value:" 180102 - PARTES ANATÓMICAS E ÓRGÃOS, INCLUINDO SACOS DE SANGUE E SANGUE CONSERVADO (EXCEPTO 180103)                                                                                                         "},
                    { key:"180103", value:" 180103 - RESÍDUOS CUJA RECOLHA E ELIMINAÇÃO ESTÁ SUJEITA A REQUISITOS ESPECÍFICOS TENDO EM VISTA A PREVENÇÃO DE INFECÇÕES                                                                                   "},
                    { key:"180104", value:" 180104 - RESÍDUOS CUJA RECOLHA E ELIMINAÇÃO NÃO ESTÃO SUJEITAS A REQUISITOS ESPECÍFICOS TENDO EM VISTA A PREVENÇÃO DE INFEÇÕES (POR EXEMPLO, PENSOS, COMPRESSAS, ROUPAS, VESTUÁRIO DESCARTÁVEL, FRALDAS)    "},
                    { key:"180106", value:" 180106 - PRODUTOS QUÍMICOS CONTENDO OU COMPOSTOS POR SUBSTÂNCIAS PERIGOSAS                                                                                                                                  "},
                    { key:"180107", value:" 180107 - PRODUTOS QUÍMICOS NÃO ABRANGIDOS EM 180106                                                                                                                                                         "},
                    { key:"180108", value:" 180108 - MEDICAMENTOS CITOTÓXICOS E CITOSTÁTICOS                                                                                                                                                            "},
                    { key:"180109", value:" 180109 - MEDICAMENTOS NÃO ABRANGIDOS EM 180108                                                                                                                                                              "},
                    { key:"180110", value:" 180110 - RESÍDUOS DE AMÁLGAMAS DE TRATAMENTOS DENTÁRIOS                                                                                                                                                     "},
                    { key:"180201", value:" 180201 - OBJECTOS CORTANTES E PERFURANTES (EXCEPTO 180202)                                                                                                                                                  "},
                    { key:"180202", value:" 180202 - RESÍDUOS CUJA RECOLHA E ELIMINAÇÃO ESTÁ SUJEITA A REQUISITOS ESPECÍFICOS TENDO EM VISTA A PREVENÇÃO DE INFECÇÕES                                                                                   "},
                    { key:"180203", value:" 180203 - RESÍDUOS CUJA RECOLHA E ELIMINAÇÃO NÃO ESTÁ SUJEITA A REQUISITOS ESPECÍFICOS TENDO EM VISTA A PREVENÇÃO DE INFEÇÕES                                                                                "},
                    { key:"180205", value:" 180205 - PRODUTOS QUÍMICOS CONTENDO OU COMPOSTOS POR SUBSTÂNCIAS PERIGOSAS                                                                                                                                  "},
                    { key:"180206", value:" 180206 - PRODUTOS QUÍMICOS NÃO ABRANGIDOS EM 180205                                                                                                                                                         "},
                    { key:"180207", value:" 180207 - MEDICAMENTOS CITOTÓXICOS E CITOSTÁTICOS                                                                                                                                                            "},
                    { key:"180208", value:" 180208 - MEDICAMENTOS NÃO ABRANGIDOS EM 180207                                                                                                                                                              "},
                    { key:"190102", value:" 190102 - MATERIAIS FERROSOS REMOVIDOS DAS CINZAS                                                                                                                                                            "},
                    { key:"190105", value:" 190105 - BOLOS DE FILTRAÇÃO PROVENIENTES DO TRATAMENTO DE GASES                                                                                                                                             "},
                    { key:"190106", value:" 190106 - RESÍDUOS LÍQUIDOS AQUOSOS PROVENIENTES DO TRATAMENTO DE GASES E OUTROS RESÍDUOS LÍQUIDOS AQUOSOS                                                                                                   "},
                    { key:"190107", value:" 190107 - RESÍDUOS SÓLIDOS PROVENIENTES DO TRATAMENTO DE GASES                                                                                                                                               "},
                    { key:"190110", value:" 190110 - CARVÃO ACTIVADO USADO PROVENIENTE DO TRATAMENTO DE GASES DE COMBUSTÃO                                                                                                                              "},
                    { key:"190111", value:" 190111 - CINZAS E ESCÓRIAS, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                                  "},
                    { key:"190112", value:" 190112 - CINZAS E ESCÓRIAS, NÃO ABRANGIDAS EM 190111                                                                                                                                                        "},
                    { key:"190113", value:" 190113 - CINZAS VOLANTES CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                                     "},
                    { key:"190114", value:" 190114 - CINZAS VOLANTES NÃO ABRANGIDAS EM 190113                                                                                                                                                           "},
                    { key:"190115", value:" 190115 - CINZAS DE CALDEIRAS, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                                "},
                    { key:"190116", value:" 190116 - CINZAS DE CALDEIRAS NÃO ABRANGIDAS EM 190115                                                                                                                                                       "},
                    { key:"190117", value:" 190117 - RESÍDUOS DE PIRÓLISE, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                               "},
                    { key:"190118", value:" 190118 - RESÍDUOS DE PIRÓLISE, NÃO ABRANGIDOS EM 190117                                                                                                                                                     "},
                    { key:"190119", value:" 190119 - AREIAS DE LEITOS FLUIDIZADOS                                                                                                                                                                       "},
                    { key:"190199", value:" 190199 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"190203", value:" 190203 - MISTURAS DE RESÍDUOS CONTENDO APENAS RESÍDUOS NÃO PERIGOSOS                                                                                                                                        "},
                    { key:"190204", value:" 190204 - MISTURAS DE RESÍDUOS, CONTENDO, PELO MENOS, UM RESÍDUO PERIGOSO                                                                                                                                    "},
                    { key:"190205", value:" 190205 - LAMAS DE TRATAMENTO FÍSICO-QUÍMICO, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                 "},
                    { key:"190206", value:" 190206 - LAMAS DE TRATAMENTO FÍSICO-QUÍMICO, NÃO ABRANGIDAS EM 190205                                                                                                                                       "},
                    { key:"190207", value:" 190207 - ÓLEOS E CONCENTRADOS DA SEPARAÇÃO                                                                                                                                                                  "},
                    { key:"190208", value:" 190208 - RESÍDUOS COMBUSTÍVEIS LÍQUIDOS CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                      "},
                    { key:"190209", value:" 190209 - RESÍDUOS COMBUSTÍVEIS SÓLIDOS CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                       "},
                    { key:"190210", value:" 190210 - RESÍDUOS COMBUSTÍVEIS NÃO ABRANGIDOS EM 190208 E 190209                                                                                                                                            "},
                    { key:"190211", value:" 190211 - OUTROS RESÍDUOS CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                                     "},
                    { key:"190299", value:" 190299 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"190304", value:" 190304 - RESÍDUOS ASSINALADOS COMO PERIGOSOS, PARCIALMENTE ESTABILIZADOS                                                                                                                                    "},
                    { key:"190305", value:" 190305 - RESÍDUOS ESTABILIZADOS NÃO ABRANGIDOS EM 190304                                                                                                                                                    "},
                    { key:"190306", value:" 190306 - RESÍDUOS ASSINALADOS COMO PERIGOSOS, SOLIDIFICADOS                                                                                                                                                 "},
                    { key:"190307", value:" 190307 - RESÍDUOS SOLIDIFICADOS NÃO ABRANGIDOS EM 190306                                                                                                                                                    "},
                    { key:"190401", value:" 190401 - RESÍDUOS VITRIFICADOS                                                                                                                                                                              "},
                    { key:"190402", value:" 190402 - CINZAS VOLANTES E OUTROS RESÍDUOS DO TRATAMENTO DE GASES DE COMBUSTÃO                                                                                                                              "},
                    { key:"190403", value:" 190403 - FASE SÓLIDA NÃO VITRIFICADA                                                                                                                                                                        "},
                    { key:"190404", value:" 190404 - RESÍDUOS LÍQUIDOS AQUOSOS PROVENIENTES DA TÊMPERA DE RESÍDUOS VITRIFICADOS                                                                                                                         "},
                    { key:"190501", value:" 190501 - FRACÇÃO NÃO COMPOSTADA DE RESÍDUOS URBANOS E EQUIPARADOS                                                                                                                                           "},
                    { key:"190502", value:" 190502 - FRACÇÃO NÃO COMPOSTADA DE RESÍDUOS ANIMAIS E VEGETAIS                                                                                                                                              "},
                    { key:"190503", value:" 190503 - COMPOSTO FORA DE ESPECIFICAÇÃO                                                                                                                                                                     "},
                    { key:"190599", value:" 190599 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"190603", value:" 190603 - LICORES DO TRATAMENTO ANAERÓBIO DE RESÍDUOS URBANOS E EQUIPARADOS                                                                                                                                  "},
                    { key:"190604", value:" 190604 - LAMAS E LODOS DE DIGESTORES DE TRATAMENTO ANAERÓBIO DE RESÍDUOS URBANOS E EQUIPARADOS                                                                                                              "},
                    { key:"190605", value:" 190605 - LICORES DO TRATAMENTO ANAERÓBIO DE RESÍDUOS ANIMAIS E VEGETAIS                                                                                                                                     "},
                    { key:"190606", value:" 190606 - LAMAS E LODOS DE DIGESTORES DE TRATAMENTO ANAERÓBIO DE RESÍDUOS ANIMAIS E VEGETAIS                                                                                                                 "},
                    { key:"190699", value:" 190699 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"190702", value:" 190702 - LIXIVIADOS DE ATERROS, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                              "},
                    { key:"190703", value:" 190703 - LIXIVIADOS DE ATERROS NÃO ABRANGIDOS EM 190702                                                                                                                                                     "},
                    { key:"190801", value:" 190801 - GRADADOS                                                                                                                                                                                           "},
                    { key:"190802", value:" 190802 - RESÍDUOS DO DESARMENAMENTO                                                                                                                                                                         "},
                    { key:"190805", value:" 190805 - LAMAS DO TRATAMENTO DE ÁGUAS RESIDUAIS URBANAS                                                                                                                                                     "},
                    { key:"190806", value:" 190806 - RESINAS DE PERMUTA IÓNICA, SATURADAS OU USADAS                                                                                                                                                     "},
                    { key:"190807", value:" 190807 - SOLUÇÕES E LAMAS DA REGENERAÇÃO DE COLUNAS DE PERMUTA IÓNICA                                                                                                                                       "},
                    { key:"190808", value:" 190808 - RESÍDUOS DE SISTEMAS DE MEMBRANAS, CONTENDO METAIS PESADOS                                                                                                                                         "},
                    { key:"190809", value:" 190809 - MISTURAS DE GORDURAS E ÓLEOS, DA SEPARAÇÃO ÓLEO/ÁGUA, CONTENDO APENAS ÓLEOS E GORDURAS ALIMENTARES                                                                                                 "},
                    { key:"190810", value:" 190810 - MISTURAS DE GORDURAS E ÓLEOS, DA SEPARAÇÃO ÓLEO/ÁGUA, NÃO ABRANGIDAS EM 190809                                                                                                                     "},
                    { key:"190811", value:" 190811 - LAMAS DO TRATAMENTO BIOLÓGICO DE ÁGUAS RESIDUAIS INDUSTRIAIS, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                       "},
                    { key:"190812", value:" 190812 - LAMAS DO TRATAMENTO BIOLÓGICO DE ÁGUAS RESIDUAIS INDUSTRIAIS NÃO ABRANGIDAS EM 190811                                                                                                              "},
                    { key:"190813", value:" 190813 - LAMAS DE OUTROS TRATAMENTOS DE ÁGUAS RESIDUAIS INDUSTRIAIS, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                         "},
                    { key:"190814", value:" 190814 - LAMAS DE OUTROS TRATAMENTOS DE ÁGUAS RESIDUAIS INDUSTRIAIS NÃO ABRANGIDAS EM 190813                                                                                                                "},
                    { key:"190899", value:" 190899 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"190901", value:" 190901 - RESÍDUOS SÓLIDOS DE GRADAGENS E FILTRAÇÃO PRIMÁRIA                                                                                                                                                 "},
                    { key:"190902", value:" 190902 - LAMAS DE CLARIFICAÇÃO DA ÁGUA                                                                                                                                                                      "},
                    { key:"190903", value:" 190903 - LAMAS DE DESCARBONATAÇÃO                                                                                                                                                                           "},
                    { key:"190904", value:" 190904 - CARVÃO ACTIVADO USADO                                                                                                                                                                              "},
                    { key:"190905", value:" 190905 - RESINAS DE PERMUTA IÓNICA, SATURADAS OU USADAS                                                                                                                                                     "},
                    { key:"190906", value:" 190906 - SOLUÇÕES E LAMAS DA REGENERAÇÃO DE COLUNAS DE PERMUTA IÓNICA                                                                                                                                       "},
                    { key:"190999", value:" 190999 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"191001", value:" 191001 - RESÍDUOS DE FERRO OU AÇO                                                                                                                                                                           "},
                    { key:"191002", value:" 191002 - RESÍDUOS NÃO FERROSOS                                                                                                                                                                              "},
                    { key:"191003", value:" 191003 - FRACÇÕES LEVES E POEIRAS, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                           "},
                    { key:"191004", value:" 191004 - FRACÇÕES LEVES E POEIRAS NÃO ABRANGIDAS EM 191003                                                                                                                                                  "},
                    { key:"191005", value:" 191005 - OUTRAS FRACÇÕES, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                                    "},
                    { key:"191006", value:" 191006 - OUTRAS FRAÇÕES NÃO ABRANGIDAS EM 191005                                                                                                                                                            "},
                    { key:"191101", value:" 191101 - ARGILAS DE FILTRAÇÃO USADAS                                                                                                                                                                        "},
                    { key:"191102", value:" 191102 - ALCATRÕES ÁCIDOS                                                                                                                                                                                   "},
                    { key:"191103", value:" 191103 - RESÍDUOS LÍQUIDOS AQUOSOS                                                                                                                                                                          "},
                    { key:"191104", value:" 191104 - RESÍDUOS DA LIMPEZA DE COMBUSTÍVEIS COM BASES                                                                                                                                                      "},
                    { key:"191105", value:" 191105 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                             "},
                    { key:"191106", value:" 191106 - LAMAS DO TRATAMENTO LOCAL DE EFLUENTES NÃO ABRANGIDAS EM 191105                                                                                                                                    "},
                    { key:"191107", value:" 191107 - RESÍDUOS DA LIMPEZA DE GASES DE COMBUSTÃO                                                                                                                                                          "},
                    { key:"191199", value:" 191199 - OUTROS RESÍDUOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                                    "},
                    { key:"191201", value:" 191201 - PAPEL E CARTÃO                                                                                                                                                                                     "},
                    { key:"191202", value:" 191202 - METAIS FERROSOS                                                                                                                                                                                    "},
                    { key:"191203", value:" 191203 - METAIS NÃO FERROSOS                                                                                                                                                                                "},
                    { key:"191204", value:" 191204 - PLÁSTICO E BORRACHA                                                                                                                                                                                "},
                    { key:"191205", value:" 191205 - VIDRO                                                                                                                                                                                              "},
                    { key:"191206", value:" 191206 - MADEIRA CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                                             "},
                    { key:"191207", value:" 191207 - MADEIRA NÃO ABRANGIDA EM 191206                                                                                                                                                                    "},
                    { key:"191208", value:" 191208 - TÊXTEIS                                                                                                                                                                                            "},
                    { key:"191209", value:" 191209 - SUBSTÂNCIAS MINERAIS (POR EXEMPLO, AREIA, ROCHAS)                                                                                                                                                  "},
                    { key:"191210", value:" 191210 - RESÍDUOS COMBUSTÍVEIS (COMBUSTÍVEIS DERIVADOS DE RESÍDUOS)                                                                                                                                         "},
                    { key:"191211", value:" 191211 - OUTROS RESÍDUOS (INCLUINDO MISTURAS DE MATERIAIS) DO TRATAMENTO MECÂNICO DE RESÍDUOS, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                               "},
                    { key:"191212", value:" 191212 - OUTROS RESÍDUOS (INCLUINDO MISTURAS DE MATERIAIS) DO TRATAMENTO MECÂNICO DE RESÍDUOS, NÃO ABRANGIDOS EM 191211                                                                                     "},
                    { key:"191301", value:" 191301 - RESÍDUOS SÓLIDOS DA DESCONTAMINAÇÃO DE SOLOS, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                       "},
                    { key:"191302", value:" 191302 - RESÍDUOS SÓLIDOS DA DESCONTAMINAÇÃO DE SOLOS, NÃO ABRANGIDOS EM 191301                                                                                                                             "},
                    { key:"191303", value:" 191303 - LAMAS DA DESCONTAMINAÇÃO DE SOLOS, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                  "},
                    { key:"191304", value:" 191304 - LAMAS DA DESCONTAMINAÇÃO DE SOLOS NÃO ABRANGIDAS EM 191303                                                                                                                                         "},
                    { key:"191305", value:" 191305 - LAMAS DA DESCONTAMINAÇÃO DE ÁGUAS FREÁTICAS, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                        "},
                    { key:"191306", value:" 191306 - LAMAS DA DESCONTAMINAÇÃO DE ÁGUAS FREÁTICAS NÃO ABRANGIDAS EM 191305                                                                                                                               "},
                    { key:"191307", value:" 191307 - RESÍDUOS LÍQUIDOS AQUOSOS E CONCENTRADOS AQUOSOS DA DESCONTAMINAÇÃO DE ÁGUAS FREÁTICAS, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                             "},
                    { key:"191308", value:" 191308 - RESÍDUOS LÍQUIDOS AQUOSOS E CONCENTRADOS AQUOSOS DA DESCONTAMINAÇÃO DE ÁGUAS FREÁTICAS, NÃO ABRANGIDOS EM 191307                                                                                   "},
                    { key:"200101", value:" 200101 - PAPEL E CARTÃO                                                                                                                                                                                     "},
                    { key:"200102", value:" 200102 - VIDRO                                                                                                                                                                                              "},
                    { key:"200108", value:" 200108 - RESÍDUOS BIODEGRADÁVEIS DE COZINHAS E CANTINAS                                                                                                                                                     "},
                    { key:"200110", value:" 200110 - ROUPAS                                                                                                                                                                                             "},
                    { key:"200111", value:" 200111 - TÊXTEIS                                                                                                                                                                                            "},
                    { key:"200113", value:" 200113 - SOLVENTES                                                                                                                                                                                          "},
                    { key:"200114", value:" 200114 - ÁCIDOS                                                                                                                                                                                             "},
                    { key:"200115", value:" 200115 - RESÍDUOS ALCALINOS                                                                                                                                                                                 "},
                    { key:"200117", value:" 200117 - PRODUTOS QUÍMICOS PARA FOTOGRAFIA                                                                                                                                                                  "},
                    { key:"200119", value:" 200119 - PESTICIDAS                                                                                                                                                                                         "},
                    { key:"200121", value:" 200121 - LÂMPADAS FLUORESCENTES E OUTROS RESÍDUOS CONTENDO MERCÚRIO                                                                                                                                         "},
                    { key:"200123", value:" 200123 - EQUIPAMENTO FORA DE USO, CONTENDO CLOROFLUOROCARBONETOS                                                                                                                                            "},
                    { key:"200125", value:" 200125 - ÓLEOS E GORDURAS ALIMENTARES                                                                                                                                                                       "},
                    { key:"200126", value:" 200126 - ÓLEOS E GORDURAS, NÃO ABRANGIDOS EM 200125                                                                                                                                                         "},
                    { key:"200127", value:" 200127 - TINTAS, PRODUTOS ADESIVOS, COLAS E RESINAS, CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                         "},
                    { key:"200128", value:" 200128 - TINTAS, PRODUTOS ADESIVOS, COLAS E RESINAS NÃO ABRANGIDOS EM 200127                                                                                                                                "},
                    { key:"200129", value:" 200129 - DETERGENTES CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                                         "},
                    { key:"200130", value:" 200130 - DETERGENTES NÃO ABRANGIDOS EM 200129                                                                                                                                                               "},
                    { key:"200131", value:" 200131 - MEDICAMENTOS CITOTÓXICOS E CITOSTÁTICOS                                                                                                                                                            "},
                    { key:"200132", value:" 200132 - MEDICAMENTOS NÃO ABRANGIDOS EM 200131                                                                                                                                                              "},
                    { key:"200133", value:" 200133 - MISTURA DE PILHAS E ACUMULADORES ABRANGIDOS EM 16060160602 OU 160603 E PILHAS E ACUMULADORES, NÃO TRIADOS, CONTENDO ESSAS PILHAS E ACUMULADORES                                                    "},
                    { key:"200134", value:" 200134 - PILHAS E ACUMULADORES NÃO ABRANGIDOS EM 200133                                                                                                                                                     "},
                    { key:"200135", value:" 200135 - EQUIPAMENTO ELÉCTRICO E ELECTRÓNICO FORA DE USO, NÃO ABRANGIDO EM 200121 OU 200123, CONTENDO COMPONENTES PERIGOSOS                                                                                 "},
                    { key:"200136", value:" 200136 - EQUIPAMENTO ELÉCTRICO E ELECTRÓNICO FORA DE USO NÃO ABRANGIDO EM 200121, 200123 OU 200135                                                                                                          "},
                    { key:"200137", value:" 200137 - MADEIRA CONTENDO SUBSTÂNCIAS PERIGOSAS                                                                                                                                                             "},
                    { key:"200138", value:" 200138 - MADEIRA NÃO ABRANGIDA EM 200137                                                                                                                                                                    "},
                    { key:"200139", value:" 200139 - PLÁSTICOS                                                                                                                                                                                          "},
                    { key:"200140", value:" 200140 - METAIS                                                                                                                                                                                             "},
                    { key:"200141", value:" 200141 - RESÍDUOS DA LIMPEZA DE CHAMINÉS                                                                                                                                                                    "},
                    { key:"200199", value:" 200199 - OUTRAS FRACÇÕES NÃO ANTERIORMENTE ESPECIFICADAS                                                                                                                                                    "},
                    { key:"200201", value:" 200201 - RESÍDUOS BIODEGRADÁVEIS                                                                                                                                                                            "},
                    { key:"200202", value:" 200202 - TERRAS E PEDRAS                                                                                                                                                                                    "},
                    { key:"200203", value:" 200203 - OUTROS RESÍDUOS NÃO BIODEGRADÁVEIS                                                                                                                                                                 "},
                    { key:"200301", value:" 200301 - MISTURA DE RESÍDUOS URBANOS E EQUIPARADOS                                                                                                                                                          "},
                    { key:"200302", value:" 200302 - RESÍDUOS DE MERCADOS                                                                                                                                                                               "},
                    { key:"200303", value:" 200303 - RESÍDUOS DA LIMPEZA DE RUAS                                                                                                                                                                        "},
                    { key:"200304", value:" 200304 - LAMAS DE FOSSAS SÉPTICAS                                                                                                                                                                           "},
                    { key:"200306", value:" 200306 - RESÍDUOS DA LIMPEZA DE ESGOTOS                                                                                                                                                                     "},
                    { key:"200307", value:" 200307 - MONSTROS                                                                                                                                                                                           "},
                    { key:"200399", value:" 200399 - RESÍDUOS URBANOS E EQUIPARADOS NÃO ANTERIORMENTE ESPECIFICADOS                                                                                                                                     "}
                ];
        };

        var _lerCodesPage = function(offset, limit, search){
            var lercodes = this.lerCodes();
            var startIndex = offset;
            var endIndex = offset + limit;
            if(search){
                lercodes = $filter('filter')(lercodes, function (item) { 
                    return item.value && item.value.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                });
            }

            var page = lercodes.slice(startIndex, endIndex);

            return $q.resolve(page);
        };

        var _getLerCode = function(lerCode){
            var lerCodes = this.lerCodes();
            var filtered = $filter('filter')(lerCodes, function (item) { 
                return item.key.indexOf(lerCode) >= 0;
            });

            if(filtered && filtered.length > 0) {
                return $q.resolve(filtered[0]);
            }

            return $q.resolve(null);
        }

        var _producerTypes = function(){
            return [
                    {id: '', name: 'Selecionar'},
                    {id: 'PI', name: 'Produtor Inicial'},
                    {id: 'OGR', name: 'Gestor de Residuos'}
                ];
        };

        var _egarTypes = function(){
            return [
                { key: null, value: 'Selecione opção'},
                { key: SMG_EGAR_TYPES.PRODUTOR_ESTABELECIMENTO, value: "Produtor/Estabelecimento" },
                { key: SMG_EGAR_TYPES.OLEOS_ALIMENTARES, value: "Óleos Alimentares Usados" },
                { key: SMG_EGAR_TYPES.OBRAS_RCD, value: "Obras RCD" },
                { key: SMG_EGAR_TYPES.VEICULOS_FIM_VIDA, value: "Veículos em fim de vida" },
                { key: SMG_EGAR_TYPES.EX_SITU, value: "Ex Situ" },
                { key: SMG_EGAR_TYPES.PRESTADOR_SERVICOS, value: "Prestador de serviços" },
            ];
        };

        
        var _egarTypesV2 = function(){
            return [
                { key: SMG_EGAR_TYPES.PRODUTOR_ESTABELECIMENTO, value: "Produtor/Estabelecimento" },
                { key: SMG_EGAR_TYPES.OLEOS_ALIMENTARES, value: "Óleos Alimentares Usados" },
                { key: SMG_EGAR_TYPES.OBRAS_RCD, value: "Obras RCD" },
                { key: SMG_EGAR_TYPES.VEICULOS_FIM_VIDA, value: "Veículos em fim de vida" },
                { key: SMG_EGAR_TYPES.EX_SITU, value: "Ex Situ" },
                { key: SMG_EGAR_TYPES.PRESTADOR_SERVICOS, value: "Prestador de serviços" },
            ];
        };


        var _intervinientTypes = function(){
            return [
                {key: '', value: '--Selecione--'},
                {key: 'P', value: 'Produtor / Detentor'},
                {key: 'T', value: 'Transportador'},
                {key: 'D', value: 'Destinatário'}
            ];
        }

        var _statusTypes = function(){
            return [
                {key: 'o', value: 'Aberta'},
                {key: 'i', value: 'Emitida'},
                {key: 'r', value: 'Corrigida'},
                {key: 'rr', value: 'Correção Negada'},
                {key: 'f', value: 'Fechada'},
                {key: 'rv', value: 'Anulada'},
            ];
        }

        var _statusTypes_TO_REMOVE = function(){
            return [
                {key: '', value: '--Selecione--'},
                {key: 'o', value: 'Aberta'},
                {key: 'i', value: 'Emitida'},
                {key: 'r', value: 'Corrigida'},
                {key: 'rr', value: 'Correção Negada'},
                {key: 'f', value: 'Fechada'},
            ];
        }


        var _groupCodeForLerCode = function(){
            return  ["180101", "180102", "180103", "180104", "180106", "180107", "180108", "180109", "180110",
                    "180201", "180202", , "180203", "180205", "180206", "180207", "180208"];
        };

        var _pglNumberForLerCodes = function(){
            return ["190805", "200304", "020106", "020305", "020403", "020502", "020702", "030311"];
        }

        var _revokeEGar = function(data){
            return $http.post(baseUrl + '/revoke', data);
        }

        var _getEGar = function(garId){
            return $http.get(baseUrl + '/' + garId);
        }

        var _getEGarRectification = function(garId){
            return $http.get(baseUrl + '/' + garId + '/rectification');
        }

    	var _createEGar = function (data) {
            return $http.post(baseUrl, data);
    	};

        var _rectify = function(garId, data){
            return $http.put(baseUrl + '/' + garId, data);
        }

        var _edit = function(garId, data){
            return $http.put(`${baseUrl}/edit/${garId}`, data);
        }

        var _getLerCodes = function() {
            return $http.get(baseUrl + '/lercodes');
        };

        var _getEGarFile = function(url){
            var config = {
                params: {
                    url: url
                }
            }

            return $http.get('/api/egar/file',  config);
        } ;

        var _authorizeImpressionate = function(garId){
            return $http.post(baseUrl + '/' + garId + '/impressionate-authorize');
        }

        var _anonymousAuthorize = function(garId, hash, data){
            return $http.post(baseUrl + '/' + garId + '/anonymous/authorize/' + hash, data);
        }

        var _acceptRectificationImpressionate = function(garId){
            return $http.post(baseUrl + '/' + garId + '/rectification/impressionate-accept');
        }

        var _rejectRectificationImpressionate = function(garId, data){
            return $http.post(baseUrl + '/' + garId + '/rectification/impressionate-reject', data);
        }

        var _acceptRectification = function(garId){
            return $http.post(baseUrl + '/' + garId + '/rectification/accept');
        }

        var _rejectRectification = function(garId, data){
            return $http.post(baseUrl + '/' + garId + '/rectification/reject', data);
        }

        var _acceptEmission = function(garId, data){
            return $http.post(baseUrl + '/' + garId + '/emission/accept', data);
        }

        var _rejectEmission = function(garId, data){
            return $http.post(baseUrl + '/' + garId + '/emission/reject', data);
        }

        var _getEGarContacts = function(garId, type){
            return $http.get(baseUrl + '/' + garId + '/contacts/' + type);
        }

        var _sendRequest = function(garId, data){
            return $http.post(baseUrl + '/' + garId + '/request', data);
        }
        
        var _anonymousGetEgar = function(hash){
            return $http.get(baseUrl + '/anonymous/gar/' + hash);
        }

        var _anonymousAccept = function(garId, hash, data){
            return $http.post(baseUrl + '/' + garId + '/anonymous/accept/' + hash, data);
        }

        var _anonymousReject = function(garId, hash, data){
            return $http.post(baseUrl + '/' + garId + '/anonymous/reject/' + hash, data);
        }

        var _anonymousGetGarRectification = function(hash){
            return $http.get(baseUrl + '/anonymous/rectification/' + hash);
        }

        var _anonymousAcceptRectification = function(garId, hash, data){
            return $http.post(baseUrl + '/' + garId + '/anonymous/rectification/accept/' + hash, data);
        }

        var _anonymousRejectRectification = function(garId, hash, data){
            return $http.post(baseUrl + '/' + garId + '/anonymous/rectification/reject/' + hash, data);
        }
        
        var _anonymousRectifyEGar = function(garId, hash, data){
            return $http.put(baseUrl + '/' + garId + '/anonymous/rectification/' + hash, data);
        }

        var _saveEgarModel = function(data){
            return $http.post(baseUrl + '/model', data);
        }

        var _getEgarsStatusCount = function(){
            return $http.get(baseUrl + '/status/count');
        }

        var _importEgar = function(data){
            return $http.post(baseUrl + '/import', data);
        }
        
        var _checkIntervinientsV3 = function(request){
            return $http.post(baseUrl + '/check-intervinients-v3', request);
        }

        var _getEgarSignedFile = function getEgarSignedFile(garId) {
            var deferred = $q.defer();

            $http
                .get(`${baseUrl}/${garId}/signed`, {
                    responseType: "arraybuffer",
                })
                .then(function (data, status, headers) {
                    var contentType = data.headers('Content-Type');
                    var filename = data.headers('x-smg-filename');

                    try {
                        var blob = new Blob([data.data], { type: contentType });
                        var url = window.URL.createObjectURL(blob);

                                              
                        var linkElement = document.createElement('a');
                        linkElement.setAttribute('href', url);
                        //linkElement.setAttribute('target', '_blank');
                        //linkElement.setAttribute("download", filename);

                        var clickEvent = new MouseEvent("click", {
                            "view": window,
                            "bubbles": true,
                            "cancelable": false
                        });
                        linkElement.dispatchEvent(clickEvent);
                    } catch (ex) {
                        alert('O seu Browser nao suporta esta operação!')
                        console.log(ex);
                    }

                    deferred.resolve(filename);
                
                }, function (error) {
                    deferred.reject(error);
                })
            return deferred.promise;
        }


        //LegalDeadlines
        var _getEgarCloseToLegalDeadlines = function(offset, limit, sortOrder, sortColumn, 
                                                    legalDeadlineType, egarNumber, 
                                                    originUniqueId, destinUniqueId, includeExpired){
            
            var expired = includeExpired === undefined ? false : includeExpired;
           
            var url = `${baseUrl}/legal-deadlines?&PageStart=${offset}&PageSize=${limit}&SortOrder=${sortOrder}&SortColumn=${sortColumn}&LegalDeadlineType=${legalDeadlineType}`;

            if(expired)
            {
                url += `&IncludeExpired=${expired}`
            }

            if(egarNumber)
            {
                url += `&EGarNumber=${egarNumber}`
            }

            if(originUniqueId)
            {
                url += `&Origin=${originUniqueId}`
            }

            if(destinUniqueId)
            {
                url += `&Destin=${destinUniqueId}`
            }

            return $http.get(url);
        }

        var _getEgarCloseToLegalDeadlinesV2 = function(offset, limit, sortOrder, sortColumn, 
            legalDeadlineType, egarNumber, 
            originUniqueId, destinUniqueId, includeExpired){

            var expired = includeExpired === undefined ? false : includeExpired;

            var url = `${baseUrl}/legal-deadlines?&PageStart=${offset}&PageSize=${limit}&SortOrder=${sortOrder}&SortColumn=${sortColumn}&LegalDeadlineType=${legalDeadlineType}`;

            if(expired)
            {
            url += `&IncludeExpired=${expired}`
            }

            if(egarNumber)
            {
            url += `&EGarNumber=${egarNumber}`
            }

            if(originUniqueId)
            {
            url += `&OriginId=${originUniqueId}`
            }

            if(destinUniqueId)
            {
            url += `&DestinId=${destinUniqueId}`
            }

            return $http.get(url);
            }

        var _getEgarsListPage = function(request){
            return $http.get(`${baseUrl}/list`, {params: request});
        }

        this.getEgarsListPage = _getEgarsListPage;
        this.getEgarCloseToLegalDeadlines = _getEgarCloseToLegalDeadlines;
        this.getEgarCloseToLegalDeadlinesV2 = _getEgarCloseToLegalDeadlinesV2;
        this.getEgarSignedFile = _getEgarSignedFile;
        this.egarTypes = _egarTypes;
        this.egarTypesV2 = _egarTypesV2;
        this.checkIntervinientsV3 = _checkIntervinientsV3;
        this.operationCodes = _operationCodes;
        this.operationCodesPage = _operationCodesPage;
        this.lerCodes = _lerCodes;
        this.getLerCode = _getLerCode;
        this.lerCodesPage = _lerCodesPage;
        this.producerTypes = _producerTypes;
        this.intervinientTypes = _intervinientTypes;
        this.groupCodes = _groupCodes;
        this.groups = _groups;
        this.shouldSelectGroupBeEnabled = _shouldSelectGroupBeEnabled;
        this.statusTypes = _statusTypes;
        this.statusTypes_TO_REMOVE = _statusTypes_TO_REMOVE;
        this.groupCodeForLerCode = _groupCodeForLerCode;
        this.pglNumberForLerCodes = _pglNumberForLerCodes;

        this.getEGarFile = _getEGarFile;
        this.getLerCodes = _getLerCodes;
    	this.createEGar = _createEGar;
        this.rectify = _rectify;
        this.edit = _edit;
        this.getEGar = _getEGar;
        this.getEGarRectification = _getEGarRectification;
        this.revokeEGar = _revokeEGar;
        
        this.authorizeImpressionate = _authorizeImpressionate;
        this.anonymousAuthorize = _anonymousAuthorize;
        this.acceptRectificationImpressionate = _acceptRectificationImpressionate;
        this.rejectRectificationImpressionate = _rejectRectificationImpressionate;
        this.acceptRectification = _acceptRectification;
        this.rejectRectification = _rejectRectification;
        this.acceptEmission = _acceptEmission;
        this.rejectEmission = _rejectEmission;
        this.getEGarContacts = _getEGarContacts;
        this.sendRequest = _sendRequest;
        this.anonymousGetEgar = _anonymousGetEgar;
        this.anonymousAccept = _anonymousAccept;
        this.anonymousReject = _anonymousReject;
        this.anonymousGetGarRectification = _anonymousGetGarRectification;
        this.anonymousAcceptRectification = _anonymousAcceptRectification;
        this.anonymousRejectRectification = _anonymousRejectRectification;
        this.anonymousRectifyEGar = _anonymousRectifyEGar;
        this.saveEgarModel = _saveEgarModel;
        this.getEgarsStatusCount = _getEgarsStatusCount;
        this.importEgar = _importEgar;
    }
})();
