(function() {
    'use strict';

    angular
        .module('custom')
        .controller('ExpiringEgarListController', ExpiringEgarListController);

    ExpiringEgarListController.$inject = ['$q', '$window', '$rootScope', '$scope', '$compile', '$state', '$stateParams', 
                                    'garsService', 'spinnerService', 'translationService', 'utilsService', 'browserService',
                                    'ngDialog', 'localStorageService', 'dateService',
                                    'SMG_SORT_ORDER', 'SMG_LEGAL_DEADLINES_TYPES', 
                                    'SMG_ESTABLISHMENT_TYPES', 
                                    'DTDefaultOptions', 'DTOptionsBuilder', 'DTColumnBuilder'];
    function ExpiringEgarListController($q, $window, $rootScope, $scope, $compile, $state, $stateParams, 
                                    garsService, spinnerService, translationService, utilsService, browserService,
                                    ngDialog, localStorageService, dateService, 
                                    SMG_SORT_ORDER, SMG_LEGAL_DEADLINES_TYPES, 
                                    SMG_ESTABLISHMENT_TYPES, 
                                    DTDefaultOptions, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {
        
        const EXPIRING_EGAR_LIST_DEFINITIONS_KEY = 'smg.EXPIRING_EGAR_LIST_DEFINITIONS_KEY';
        const selectPageSize = 200;
       
        var vm = this;
        vm.dtTableAsOrigin = null;
        vm.dtTableAsDestin = null;   
        vm.includeExpired = false;
        vm.egarNumber = null;


        vm.SMG_ESTABLISHMENT_TYPES = SMG_ESTABLISHMENT_TYPES;
        vm.SMG_LEGAL_DEADLINES_TYPES = SMG_LEGAL_DEADLINES_TYPES;
        vm.SMG_SORT_ORDER = SMG_SORT_ORDER;
        
        vm.loadigGifSelector = '#main';      
        
        vm.numberOfItemsPerPage = utilsService.numberOfItemsPerPage();
      
        vm.listDefinition = getListDefinition();

        console.log($stateParams.eGarExpiringType)
        vm.selectedTab = $stateParams.eGarExpiringType ? $stateParams.eGarExpiringType : SMG_LEGAL_DEADLINES_TYPES.AsOrigin;
        
        vm.selectedPageSize = vm.numberOfItemsPerPage.find((elem) => { 
            return elem.key == vm.listDefinition.pageSize;
        })


        dateService.changeLocalePt();
 

        vm.isSet = (tabNum) => {
            return vm.selectedTab == tabNum;
        };

        vm.setTab = (newTab) => { 
            if(newTab !== vm.selectedTab){
                vm.selectedTab = newTab;
            }
        };
    


        //eGar list search
        vm.onSearchClick = function(){
            reloadTable(true);
        }
    

        vm.$onInit = function(){
            activate();
        }


        vm.getSignedFile = function (uniqueId) {
            console.log(uniqueId)

            if(browserService.ie()){
                //test this if it woorks
                // window.navigator.msSaveOrOpenBlob(newBlob, filename)

                alert('O Internet Explorer não suporta esta operação! \n Por favor tente com Chrome, Firefox ou Edge.');
                return;
            }

            spinnerService.show(vm.loadigGifSelector);
            garsService
                .getEgarSignedFile(uniqueId)
                .then(function(result){
                    //utilsService.notifySuccess('Certificado emitido com sucesso');
                })
                .catch(function(error){
                    utilsService.notifyError('Não foi possível fazer o download do ficheiro. <br> Se esta situação persistir por favor contacte o suporte.');
                })
                .finally(function(){
                    spinnerService.hide(vm.loadigGifSelector);
                });
        }

        vm.getFile = function(url){
            $window.open(url, '_blank');
        }

        vm.clearFilters = function(){
            vm.selectedOrigin = null;
            vm.selectedDestin = null;
            vm.egarNumber = null;
            vm.includeExpired = null;
        }

        vm.consultActionClick = function(uniqueId){
            $state.go('app.consultGar', { garId: uniqueId });
        }

        vm.editActionClick = function(uniqueId){
            $state.go('app.editGar', { garId: uniqueId });
        }

        vm.rectifyActionClick = function(uniqueId){
            $state.go('app.rectifyGar', { garId: uniqueId });
        }

        vm.revokeActionClick = function(uniqueId){
            var gar = utilsService.getSingleOrDefault(vm.dataTableCurrentItems, { 'UniqueId': uniqueId });
            ngDialog.open({
                template: '/app/custom/gars/revoke.gar.dialog.html',
                className: 'ngdialog-theme-default',
                controller: 'garRequestDialogController as $ctrl',
                resolve: {
                    gar: function (){ return gar; },
                    type: function(){ return null; }
                }
            });
        }

        vm.duplicateActionClick = function(uniqueId){
            $state.go('app.duplicateGarV2', { garId: uniqueId });
        }

        vm.acceptEmission = function(garId){
            var gar = utilsService.getSingleOrDefault(vm.dataTableCurrentItems, { 'UniqueId': garId });
            $scope.garNumber = gar.Number;
            $scope.garId = garId;
            $scope.garUrl = gar.FileUrl;

            vm.dialog = ngDialog.open({
                template: '/app/custom/gars/emission.accept.gar.html',
                className: 'ngdialog-theme-default accept-emission',
                preCloseCallback: 'preCloseCallbackOnScope',
                controller: 'garAcceptEmissionDialogController as $ctrl',
                resolve : {
                    //parameter passed to dialog
                    gar: function (){ return gar; }
                },
                scope: $scope
            });
        }

        vm.rejectEmission = function(garId){
            var gar = utilsService.getSingleOrDefault(vm.dataTableCurrentItems, { 'UniqueId': garId });
            $scope.garNumber = gar.Number;
            $scope.garId = garId;
            $scope.garUrl = gar.FileUrl;

            vm.dialog = ngDialog.open({
                template: '/app/custom/gars/emission.reject.gar.html',
                className: 'ngdialog-theme-default reject-emission',
                preCloseCallback: 'preCloseCallbackOnScope',
                controller: 'garRejectEmissionDialogController as $ctrl',
                resolve : {
                    //parameter passed to dialog
                    gar: function (){ return gar; }
                },
                scope: $scope
            });
        }

        vm.impressionatAuthorization = function(garId){
            spinnerService.show(vm.loadigGifSelector);
            
            garsService
                .authorizeImpressionate(garId)
                .then(authorizeImpressionateOnSuccess)
                .catch(authorizeImpressionateOnError)
                .finally(spinnerService.hide(vm.loadigGifSelector));
        }

        vm.consultRectificationImpressionate = function(garId){
            showConsultRectificationPopup(garId, true);
        }

        vm.consultRectification = function(garId){
            showConsultRectificationPopup(garId, false);
        }

        vm.requestOriginAuthorization = function(garId){
            showRequestDestinAcceptancePopup(garId, 'REQUEST_AUTHORIZATION');
        }
                
        vm.requestDestinAcceptance = function (garId){
            showRequestDestinAcceptancePopup(garId, 'REQUEST_ACCEPTANCE');
        }

        vm.requestOriginRetcificationAcceptance = function(garId){
            showRequestDestinAcceptancePopup(garId, 'REQUEST_RECTIFICATION_ACCEPTANCE');
        }

        vm.sendProofEgar = function(garId){
            showRequestDestinAcceptancePopup(garId, 'SEND_PROOF_EGAR');
        }
        

        vm.onEgarListDefinitionsClick = function(){
            //show modal
            vm.dialog = ngDialog.open({
                template: '/app/custom/gars/egars.list.definitions.dialog.html',
                className: 'ngdialog-theme-default',
                preCloseCallback: preCloseCallback,
                width: 400,
                showClose: true,
                controller: 'EgarListController as vm',
                scope: $scope,
                closeByNavigation: true,
            });
        }

        vm.saveListDefinitions = ()=>{
            
            var listDefinitions = {
                defaultTab: vm.listDefinition.defaultTab,
                pageSize: vm.selectedPageSize ? vm.selectedPageSize.key : 10
            }
            
            localStorageService.set(EXPIRING_EGAR_LIST_DEFINITIONS_KEY, listDefinitions);

            ngDialog.close();

            $window.location.reload();
        }

        
        //////////////////////////////////////////////
        function activate() { 
            
            DTDefaultOptions.setLanguage(translationService.dataTableTranslations());
            
            vm.dtColumns = [];
            vm.dtColumns.push(DTColumnBuilder.newColumn('Number', 'Número')
                    .notSortable()
                    .withClass('sorting_disabled')
                    //.withClass('dt-center col-sm-1')
                    .withClass('dt-center')
                    .renderWith(renderNumber));
                
            vm.dtColumns.push(DTColumnBuilder.newColumn('Origin')
                    .notSortable()
                    //.withClass('dt-center col-sm-1')
                    .withClass('dt-center')
                    .withTitle('Remetente')
                    .renderWith(renderOriginName));

            vm.dtColumns.push(DTColumnBuilder.newColumn('Destin')
                    .notSortable()
                    //.withClass('dt-center col-sm-1')
                    .withClass('dt-center')
                    .withTitle('Destinatário')
                    .renderWith(renderDestinName));

            vm.dtColumns.push(DTColumnBuilder.newColumn('Residue')
                    .notSortable()
                    .withTitle('Resíduo')
                    //.withClass('dt-center col-sm-1')
                    .withClass('dt-center')
                    .renderWith(renderResidue));

            vm.dtColumns.push(DTColumnBuilder.newColumn('Residue')
                    .notSortable()
                    .withTitle('Qtd (Kg)')
                    //.withClass('dt-center col-sm-1')
                    .withClass('dt-center')
                    .renderWith(renderResidueQuantity));

            vm.dtColumns.push(DTColumnBuilder.newColumn('Status')
                    .notSortable()
                    .withTitle('Estado')
                    //.withClass('dt-center col-sm-1')
                    .withClass('dt-center')
                    .renderWith(renderStatus));

            vm.dtColumns.push(DTColumnBuilder.newColumn('Authorized')
                .notSortable()
                //.withClass('dt-center col-sm-1')
                .withClass('dt-center')
                .withTitle('Autorizada')
                .renderWith(renderAuthorized));

            vm.dtColumns.push(DTColumnBuilder.newColumn('DueDays')
                .notSortable()
                .withClass('dt-center')
                .withTitle('Dias')
                .renderWith(renderDueDays));
            
            vm.dtColumns.push(DTColumnBuilder
                    .newColumn('Actions')
                    .notSortable()
                    //.withClass('dt-center egar-actions col-sm-1')
                    .withClass('dt-center egar-actions w-12pc')
                    .withTitle('Acções')
                    .renderWith(renderPossibleActions));

            vm.dtColumns.push(DTColumnBuilder
                    .newColumn('Actions')
                    .withTitle('')
                    .notSortable()
                    //.withClass('dt-center action-buttons col-sm-1')
                    .withClass('dt-center action-buttons-aggregate')
                    .renderWith(renderActionButtonsForExpiringEgars));

            vm.dtOptions = DTOptionsBuilder
                .newOptions()
                .withOption('responsive', true)
                .withOption('bFilter', false)       //hide search box
                .withOption('searchDelay', 500)
                .withOption('bLengthChange', false) //hide change page size
                .withOption('createdRow', createdRow)
                .withOption('ajax', getData)
                .withDataProp('data')
                //.withOption('processing', true)
                .withOption('serverSide', true)
                .withPaginationType('full_numbers')
                .withDisplayLength(vm.listDefinition.pageSize)
                ;
        }



        
        function getData(dataTable, callback, settings){
            vm.serverValidationErrors = [];

            spinnerService.show(vm.loadigGifSelector);

            var originId = vm.selectedOrigin ? vm.selectedOrigin.id : null;
            var destinId = vm.selectedDestin ? vm.selectedDestin.id : null;

            garsService.getEgarCloseToLegalDeadlinesV2(dataTable.start, dataTable.length, 
                                                    vm.SMG_SORT_ORDER.ASC, null,
                                                    vm.selectedTab, 
                                                    vm.egarNumber,
                                                    originId, 
                                                    destinId,
                                                    vm.includeExpired)
                .then(function (result) {
                    if (result) {
                        vm.dataTableCurrentStart = result.start;
                        vm.dataTableCurrentItems = result.data.aaData;
                        //result.data.aaData = items;

                        callback(result.data);
                    }
                }, function (error) {
                    if(error.data._validationErrors){
                        vm.serverValidationErrors = utilsService.parseErrors(error.data._validationErrors);
                    }
                    
                    if(error.data._applicationErrors){
                        utilsService.parseAndNotifyApplicationErrors(error.data._applicationErrors);
                    }
                })
                .finally(function () {
                    spinnerService.hide(vm.loadigGifSelector);
                });
        }
        
        function getListDefinition(){
            let listDefinitions = localStorageService.get(EXPIRING_EGAR_LIST_DEFINITIONS_KEY);

            if(listDefinitions == null){
                listDefinitions = {
                    defaultTab: vm.SMG_LEGAL_DEADLINES_TYPES.AsOrigin,
                    pageSize: 10
                }
            }

            return listDefinitions;
        }


        function reloadTable(keepPage){
            if(vm.selectedTab == vm.SMG_LEGAL_DEADLINES_TYPES.AsOrigin){
                vm.dtTableAsOrigin.reloadData(null, keepPage);
            }else if(vm.selectedTab == vm.SMG_LEGAL_DEADLINES_TYPES.AsDestin){
                vm.dtTableAsDestin.reloadData(null, keepPage);
            }else{
                throw 'no tab selected';
            }
        }


        function authorizeImpressionateOnSuccess(result){
            utilsService.notifySuccess('E-Gar Autorizada com sucesso!');
            reloadTable(false);
        }

        function authorizeImpressionateOnError(error){
             utilsService.notifyForbiden('Por favor verifique se tem accesso ao SILIAmb');
        }


        function renderActionButtonsForExpiringEgars(actions, msg, model, cell){
            var options =  '';

            angular.forEach(actions, function(action){
                
                if(action.Action === 'CAN_SEE_DOCUMENT'){
                    options += buildActionItem('fa fa-file-pdf-o', 'vm.getFile(\'' + model.FileUrl + '\')', 'Ver PDF');;
                        
                    if(model.HasSignedPdf){
                        options += buildActionItem('fa fa-file-pdf-o', 'vm.getSignedFile(\'' + model.UniqueId + '\')', 'Ver PDF (assinado)');
                    }
                }

                if(action.Action === 'CAN_CONSULT'){
                    options += buildActionItem('fa fa-eye', 'vm.consultActionClick(\'' + model.UniqueId + '\')', 'Consultar e-Gar');
                }

                if(action.Action === 'CAN_EDIT'){
                    options += buildActionItem('fa fa-tag', 'vm.editActionClick(\'' + model.UniqueId + '\')', 'Atribuir ou alterar etiqueta');
                } 
    
                if(action.Action === 'CAN_REVOKE'){
                    options +=  buildActionItem('fa fa-trash', 'vm.revokeActionClick(\'' + model.UniqueId + '\')', 'Anular e-Gar');
                }
                
            });

            //duplicate egar
            options +=  buildActionItem('fa fa-copy', 'vm.duplicateActionClick(\'' + model.UniqueId + '\')', 'Duplicar e-Gar');

            var result = 
            '<ul title="Opções" class="list-style-none">'+
                '<li class="dropdown dropdown-list" uib-dropdown="" >'+
                    '<span class="btn-label" uib-dropdown-toggle="">'+
                            '<i class="icon-options" ></i>'+
                    '</span>'+
                    '<ul class="dropdown-menu dropdown-menu-right">'+
                    options
                    '</ul>' +
                '</li>'+
            '</ul>';

            return result;
        }

        function buildActionItem(emClass, ngClick, text){
            return '' +
            '<li>'+
                '<div class="list-group">'+
                    '<a class="list-group-item">'+
                        '<div class="media-box" hreef="" ng-click="' + ngClick + '">'+
                            '<div class="pull-left">'+
                                '<em class="' + emClass + '"></em>'+
                            '</div>'+
                            '<div class="media-box-body clearfix">'+
                                '<p class="m0">' + text + '</p>'+
                            '</div>'+
                        '</div>'+
                    '</a>'+
                '</div>'+
            '</li>';
        }

        function renderAuthorized(isAuthorized){
            var title = isAuthorized ? 'Autorizada' : 'Autorização Pendente'; 
            var icon = isAuthorized ? 'fa fa-check' : '';
            return '<span title="' + title + '"><em class="' + icon + '"></em></span>';
        }

        //egar actions
        function renderPossibleActions(actions, msg, model, cell){

            var elem = '';
            angular.forEach(actions, function(action){
                switch(action.Action){
                    case 'CAN_AUTHORIZE':
                    case 'CAN_AUTHORIZE_AS_IF_ORIGIN':
                        elem += '<span ng-click=vm.impressionatAuthorization("' + model.UniqueId + '") class="btn btn-primary" title="' + 'Autorizar como produtor' + '"><em class="icon-check"></em></span>';
                        break;
                    case 'CAN_ACCEPT_RECTIFICATION_AS_IF_ORIGIN':
                        elem += '<span ng-click=vm.consultRectificationImpressionate("' + model.UniqueId + '") class="btn btn-info" title="' + 'Consultar correcção' + '"><em class="fa fa-pencil-square-o"></em></span>';
                        break;
                    case 'CAN_ACCEPT_RECTIFICATION':
                        elem += '<span ng-click=vm.consultRectification("' + model.UniqueId + '") class="btn btn-info" title="' + 'Consultar correcção' + '"><em class="fa fa-pencil-square-o"></em></span>';
                        break;
                    
                    case 'CAN_RECTIFY':
                        elem += '<span ng-click=vm.rectifyActionClick("' + model.UniqueId + '") class="btn btn-warning" title="' + 'Corrigir e-Gar' + '"><em class="fa fa-pencil"></em></span>';
                        break;
                    case 'CAN_ACCEPT_EMISSION':
                        elem += '<span ng-click=vm.acceptEmission("' + model.UniqueId + '") class="btn btn-success" title="' + 'Aceitar emissão e-Gar' + '"><em class="fa fa-thumbs-o-up"></em></span>';
                        break;
                    case 'CAN_REJECT_EMISSION':
                        elem += '<span ng-click=vm.rejectEmission("' + model.UniqueId + '") class="btn btn-danger" title="' + 'Rejeitar emissão e-Gar' + '"><em class="fa fa-thumbs-o-down"></em></span>';
                        break;
                    case 'CAN_REQUEST_AUTHORIZATION':
                        elem += '<span ng-click=vm.requestOriginAuthorization("' + model.UniqueId + '") class="btn btn-default" title="' + 'Requisitar autorização de emissão de e-Gar' + '"><em class="fa fa-paper-plane"></em></span>';
                        break;
                    case 'CAN_REQUEST_RECTIFICATION':
                        elem += '<span ng-click=vm.requestDestinAcceptance("' + model.UniqueId + '") class="btn btn-inverse" title="' + 'Requisitar aceitação de emissão de e-Gar' + '"><em class="fa fa-paper-plane"></em></span>';
                        break;
                    case 'CAN_REQUEST_RECTIFICATION_ACCEPTANCE':
                        elem += '<span ng-click=vm.requestOriginRetcificationAcceptance("' + model.UniqueId + '") class="btn btn-warning" title="' + 'Requisitar aceitação de correção de e-Gar' + '"><em class="fa fa-paper-plane"></em></span>';
                        break;

                    case 'CAN_SEND_PROOF_EGAR':
                        elem += '<span ng-click=vm.sendProofEgar("' + model.UniqueId + '") class="btn btn-primary" title="' + 'Enviar comprovativo de emissão de e-Gar' + '"><em class="fa fa-paper-plane"></em></span>';
                        break;
                }
            });

             return elem;
        }

        function renderNumber(egarNumber, msg, model, cell){
            var r = '<span class="egar-number">' + egarNumber + '</span>';
            var type = null;
            switch(model.Origin.TipoRemetente){
                case 'PRODUTOR_ESTABELECIMENTO':
                    type = 'Produtor';
                    break;
                case 'OBRAS_RCD':
                    type = 'RCD';
                    break;
                case 'OLEOS_ALIMENTARES':
                    type = 'OAU';
                    break;
                case 'VEICULOS_FIM_VIDA':
                    type = 'VFV';
                    break;
                case 'PRESTADOR_SERVICOS':
                    type = 'Serviço';
                    break;
                default:
                    type = model.Origin.TipoRemetente;
                    break;
            }

            var smallSpan = '<span class="small"> (Tipo: ' + type + ')</span>';
            return r + '<br>' + smallSpan;
        }

        function renderOriginName(origin, msg, model, cell){
            if(origin == null){
                 return "";
            }

            var title = '';
            var smallSpan = '';
            var name = '';
            var apaCode =  origin.CodApa == null ? '' : origin.CodApa;

            switch(origin.TipoRemetente){
                case 'OBRAS_RCD':
                case 'PRESTADOR_SERVICOS':
                    if(origin.Nif){
                        title = origin.Nif ? 'Nif Remetente: ' + origin.Nif : '';                        
                        smallSpan = '<span class="small">(Nif: '+origin.Nif+')</span>';
                    }
                    
                    name +=  origin.Morada ? origin.Morada : '';
                    name +=  origin.Localidade ? ' ' + origin.Localidade : '';
                    name += origin.CodigoPostal ? ' ' + origin.CodigoPostal : '';
                    break;

                case 'OLEOS_ALIMENTARES':
                case 'EX_SITU':
                    if(origin.CodigoLocalRecolha){
                        title = 'Ponto de recolha: ' + origin.CodigoLocalRecolha;
                        smallSpan = '<span class="small">(Código: ' + origin.CodigoLocalRecolha + ')</span>';
                    }

                    name =  origin.Nome == null ? '' : origin.Nome;
                    break;

                case 'VEICULOS_FIM_VIDA':
                    if(origin.Nif){
                        title = 'Nif Remetente: ' + origin.Nif;
                        smallSpan = '<span class="small">(Nif: '+origin.Nif+')</span>';
                    }
                  
                    name +=  origin.Morada ? origin.Morada : '';
                    name +=  origin.Localidade ? ' ' + origin.Localidade : '';
                    name += origin.CodigoPostal ? ' ' + origin.CodigoPostal : '';
                    break;
                
                default:
                    title = 'Estabelecimento: ' + origin.Nome;
                    name =  origin.Nome == null ? '' : origin.Nome;
                    smallSpan = '<span class="small">(Apa: ' + apaCode + ')</span>';
                    break
            }

            var r = '<span title="' + title + '">' + name + '</span>';

            if(smallSpan)  {
                r += '<br>' + smallSpan;
            }  

            return r;
        }

        function renderDestinName(destin, msg, model, cell){
            if(destin == null){ 
                return ""; 
            }
         
            var name = destin.Nome == null ? '' : destin.Nome;
            var apaCode = destin.CodApa == null ? '' : destin.CodApa;

            return '<span title="' + name + ' - ' + apaCode + '">' + name + '</span>';
        }

        function renderStatus(status, msg, model, cell){
            return '<span title="' + status + '">' + status + '</span> <br> <span><small> Em: ' + model.FormatedStatusDate + '<small></span>';
        }

        function renderResidue(residue, msg, model, cell){
            var smallSpan = null;
            var title = '';
            var text = '';

            if(model.Origin.TipoRemetente == 'VEICULOS_FIM_VIDA'){
                smallSpan = '<span class="small">(Matrícula: '+ model.Residue.MatriculaVfv +')</span>';
            }

            if(model.IsFinished && model.ResidueRectified && model.ResidueRectified.CodigoResiduoLerCorrigido){
                title = model.ResidueRectified.CodigoResiduoLerCorrigido + ' - ' + model.ResidueRectified.DescricaoResiduo;
                return '<span>' + model.ResidueRectified.CodigoResiduoLerCorrigido + '</span>';    
            } else{
                title = residue.CodigoResiduoLer + ' - ' + residue.DescricaoResiduo;
                text = '<span title="' + title + '">' + residue.CodigoResiduoLer + '</span>';
            }

            if(smallSpan){
                text += '<br>' + smallSpan;
            }

            return text;
        }

        function renderResidueQuantity(residue, msg, model, cell){
            if(model.IsFinished){
                if(model.ResidueRectified && model.ResidueRectified.QuantidadeCorrigido){
                    return '<span>' + model.ResidueRectified.QuantidadeCorrigido + '</span>';    
                } else{
                    return '<span>' + residue.Quantidade + '</span>';
                }
            }

            return '<span>' + residue.Quantidade + '</span>';            
        }

        function renderDueDays(dueDays){
            var title = '';
            var daysLabel = '';
            var textClass = '';
            var absoluteDueDays = dueDays < 0 ? dueDays * (-1) : dueDays;
            
            if(absoluteDueDays){
                daysLabel = 'dia';
            }else {
                daysLabel = 'dias';
            }

            if(dueDays < 0){
                title = 'Prazo expirado à ' + absoluteDueDays  + ' ' + daysLabel;
                textClass = 'text-danger';
            } else if(dueDays === 0){
                title = 'Prazo termina hoje!';
                textClass = 'text-warning';
            }
            else{
                title = 'Prazo termina em ' + absoluteDueDays  + ' ' + daysLabel;
                textClass = 'text-info';
            }
            
            return '<span title="' + title + '" class="' + textClass + '"> ' + absoluteDueDays + ' </span>';
        }

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }


        function showConsultRectificationPopup(garId, impressionate) {
            var gar = utilsService.getSingleOrDefault(vm.dataTableCurrentItems, { 'UniqueId': garId });
            vm.dialog = ngDialog.open({
                template: '/app/custom/gars/consult.rectification.dialog.html',
                className: 'ngdialog-theme-default consult-rectification',
                preCloseCallback: 'preCloseCallbackOnScope',
                controller: 'garRectificationDialogController as $ctrl',
                resolve : {
                    //parameter passed to dialog
                    gar: function (){ return gar; },
                    impressionate: function(){ return impressionate; }
                },
                scope: $scope
            });
        };

        function showRequestDestinAcceptancePopup(garId, type){
            var gar = utilsService.getSingleOrDefault(vm.dataTableCurrentItems, { 'UniqueId': garId });
            vm.dialog = ngDialog.open({
                template: '/app/custom/gars/request.dialog.acceptance.gar.html',
                className: 'ngdialog-theme-default request request-acceptance',
                preCloseCallback: 'preCloseCallbackOnScope',
                controller: 'garRequestDialogController as $ctrl',
                resolve : {
                    //parameter passed to dialog
                    gar: function (){ return gar; },
                    type: function(){ return type; }
                },
                scope: $scope
            });
        }


        /////////////////////////////////////////////////////////
        $scope.preCloseCallbackOnScope = function (value) {
            console.log('preCloseCallbackOnScope');
            console.log(value);
        };

        $scope.$on('$destroy', function() { 
            console.log('$destroy');
        });        

        $rootScope.$on('reloadTableEGars', function (evnt, data) {
            reloadTable(false);
        });
  
    }

})();
 

