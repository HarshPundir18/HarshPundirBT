(function() {
    'use strict';

    angular
        .module('custom')
        .controller('dataTableController', dataTableController);

    dataTableController.$inject = ['$q', '$window', '$rootScope', '$scope', '$compile', '$http', '$state', '$stateParams', 
                                    '$location', '$filter', 'tmhDynamicLocale', '$locale',
                                    'garsService', 'spinnerService', 'translationService', 'utilsService', 'browserService',
                                    'ngDialog', 'localStorageService', 'dateService', 
                                    'SMG_SORT_ORDER', 'SMG_LEGAL_DEADLINES_TYPES',
                                    'DTDefaultOptions', 'DTOptionsBuilder', 'DTColumnBuilder'];
    function dataTableController($q, $window, $rootScope, $scope, $compile, $http, $state, $stateParams, 
                                    $location, $filter, tmhDynamicLocale, $locale,
                                    garsService, spinnerService, translationService, utilsService, browserService,
                                    ngDialog, localStorageService, dateService, 
                                    SMG_SORT_ORDER, SMG_LEGAL_DEADLINES_TYPES,
                                    DTDefaultOptions, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {
        
        var EGAR_LIST_FILTERS_KEY = 'EGAR_LIST_FILTERS_KEY';

        var vm = this;

        if($state.current.name === 'app.garslegalDeadlinesList'){
            vm.isGarslegalDeadlinesList = true;
            vm.isGarsList = false;
        }else{
            vm.isGarslegalDeadlinesList = false;
            vm.isGarsList = true;
        }

        vm.loadigGifSelector = '#garsList';
        vm.SMG_SORT_ORDER = SMG_SORT_ORDER;
        vm.SMG_LEGAL_DEADLINES_TYPES = SMG_LEGAL_DEADLINES_TYPES;                                        
        vm.hasDefaultEstablishment = true;
        vm.producerType = '';
        vm.intervinientTypeOptions = garsService.intervinientTypes();
        vm.selectedIntervinientType = vm.intervinientTypeOptions[0];
        vm.waittingAuthorizationOptions = utilsService.yesAndNoItems();
        vm.selectedWaittingAuthorization = vm.waittingAuthorizationOptions[0];
        vm.egarStatusOptions = garsService.statusTypes_TO_REMOVE();
        vm.selectedEgarStatus = vm.egarStatusOptions[0];
        vm.egarNumber = '';
        vm.origin = '';
        vm.destin = '';
        vm.lerCode = '';
        vm.status = '';
        vm.notYetReloaded = false;

        //dateService.changeLocalePt();

        vm.showHelpStatusFilter = function(){
            ngDialog.open({
                template: 'diag-helpStatus',
                className: 'ngdialog-theme-default custom-width-900'
            });
        }

        //eGar list search
        vm.searchClicked = function(){
            vm.dtInstance.reloadData(null, true);
        }


        $scope.showPopover=false;
        $scope.popover = {
            title: 'Title',
            message: 'Message'
        };   

        vm.dtInstance = null;
        vm.btnOriginSelected  = false;
        vm.btnTransporterSelected = false;
        vm.btnDestinSelected = true;

        activate();

        ////////////////
        vm.newEgar = function(){
            $state.go('app.newGar');
        }

        vm.openModelsPopup = function(){
            alert('openModelsPopup');
        }

        vm.getSignedFile = function (uniqueId) {
            console.log(uniqueId)

            if(browserService.ie()){
                //test this if it woorks
                // window.navigator.msSaveOrOpenBlob(newBlob, filename)

                alert('O Internet Explorer não suporta esta operação! \n Por favor tente com Chrome, Firefox ou Edge.');
                return;
            }

            spinnerService.show('.panel-body');
            garsService
                .getEgarSignedFile(uniqueId)
                .then(function(result){
                    //utilsService.notifySuccess('Certificado emitido com sucesso');
                })
                .catch(function(error){
                    utilsService.notifyError('Não foi possível fazer o download do ficheiro. <br> Se esta situação persistir por favor contacte o suporte.');
                })
                .finally(function(){
                    spinnerService.hide('.panel-body');
                });
        }

        vm.getFile = function(url){
            $window.open(url, '_blank');
        }

        vm.filter = function(intervinientType){
            vm.btnOriginSelected  = (intervinientType == 'P');
            vm.btnTransporterSelected = (intervinientType == 'T');
            vm.btnDestinSelected = (intervinientType == 'D');
            vm.dtInstance.reloadData(null, true);
        }

        vm.clearFilters = function(){
            vm.selectedIntervinientType = vm.intervinientTypeOptions[0];
            vm.selectedWaittingAuthorization = vm.waittingAuthorizationOptions[0];
            vm.selectedEgarStatus = vm.egarStatusOptions[0];
            vm.egarNumber = '';
            vm.origin = '';
            vm.destin = '';
            vm.lerCode = '';
            vm.status = '';
            vm.selectedProductCode = null;

            $scope.$broadcast('notifyClearProduct');
            
            vm.dtInstance.reloadData(null, true);
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
            $state.go('app.duplicateGar', { garId: uniqueId });
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
                }
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
                }
            });
        }

        vm.impressionatAuthorization = function(garId){
            spinnerService.show('#div-results');
            
            garsService
                .authorizeImpressionate(garId)
                .then(authorizeImpressionateOnSuccess)
                .catch(authorizeImpressionateOnError)
                .finally(spinnerService.hide('#div-results'));
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
        
        vm.selectedProductCode = null;
        vm.onSelectedProductCodeChange = function (obj){
            console.log('obj');
            //set eGar description to the product description
            vm.lerDescription = obj.description.trim();
        };
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

            if(vm.isGarsList){
                vm.dtColumns.push(DTColumnBuilder.newColumn('Authorized')
                .notSortable()
                //.withClass('dt-center col-sm-1')
                .withClass('dt-center')
                .withTitle('Autorizada')
                .renderWith(renderAuthorized));
            }
            
            if(vm.isGarslegalDeadlinesList){
                vm.dtColumns.push(DTColumnBuilder.newColumn('DueDays')
                    .notSortable()
                    .withClass('dt-center')
                    .withTitle('Dias')
                    .renderWith(renderDueDays));
            }

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
                    .renderWith(renderActionButtons_v2));

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
                ;
        }


        function getData(dataTable, callback, settings){
            if(vm.isGarslegalDeadlinesList){
                getEgarCloseToLegalDeadlinesData(dataTable, callback, settings);
            }else{
                getEGarListData(dataTable, callback, settings);
            }
        }

        function getEGarListData(dataTable, callback, settings) {
            var noSearch = dataTable.search.value == '';
            var hasValidSearch = dataTable.search && dataTable.search.value &&  dataTable.search.value.length > 2;

            spinnerService.show(vm.loadigGifSelector);

            var request=null;
            var isBack = $location.search().back;
            if(isBack && !vm.notYetReloaded){
                vm.notYetReloaded=true;
                request = localStorageService.get(EGAR_LIST_FILTERS_KEY);
                //set paginator
                settings._iDisplayStart = request.PageStart;
                //set filters
                setColumnFilterValues(request);
            }else{
                request = {
                    PageStart: dataTable.start,
                    PageSize:  dataTable.length,
                    FilterNames: getColumnFilterNames(),
                    FilterValues: getColumnFilterValues()
                };
    
                localStorageService.set(EGAR_LIST_FILTERS_KEY, request);
            }

            $http.get('/api/egar', { params: request })
                    .then(function(result) {
                        if(result){
                            vm.dataTableCurrentStart = result.start;
                            vm.dataTableCurrentItems = result.data.aaData;
                            callback(result.data);
                        }
                    })
                    .catch(function(error){
                        
                    })
                    .finally(function(){
                        spinnerService.hide(vm.loadigGifSelector);
                    });
        }

        function getEgarCloseToLegalDeadlinesData(dataTable, callback, settings) {
            spinnerService.show(vm.loadigGifSelector);

            var originUniqueId = vm.selectedOrigin ? vm.selectedOrigin.uniqueId : null;
            var destinUniqueId = vm.selectedDestin ? vm.selectedDestin.uniqueId : null;

            garsService.getEgarCloseToLegalDeadlines(dataTable.start, dataTable.length, 
                                                    vm.SMG_SORT_ORDER.ASC, null,
                                                    $stateParams.type, vm.egarNumber,
                                                    originUniqueId, destinUniqueId,
                                                    vm.includeExpired)
                .then(function (result) {
                    if (result) {
                        vm.dataTableCurrentStart = result.start;
                        vm.dataTableCurrentItems = result.data.aaData;
                        //result.data.aaData = items;

                        callback(result.data);
                    }
                }, function (error) {

                })
                .finally(function () {
                    spinnerService.hide(vm.loadigGifSelector);
                });
        }


        function authorizeImpressionateOnSuccess(result){
            utilsService.notifySuccess('E-Gar Autorizada com sucesso!');
            vm.dtInstance.reloadData(null, false);
        }

        function authorizeImpressionateOnError(error){
             utilsService.notifyForbiden('Por favor verifique se tem accesso ao SILIAmb');
        }


        vm.test = function(){
            console.log('rew')
        }

        function renderActionButtons_v2(actions, msg, model, cell){
            var options =  '';

            angular.forEach(actions, function(action){
                
                if(action.Action === 'CAN_SEE_DOCUMENT'){
                    options += buildActionItem('fa fa-file-pdf-o', 'table1.getFile(\'' + model.FileUrl + '\')', 'Ver PDF');;
                        
                    if(model.HasSignedPdf){
                        options += buildActionItem('fa fa-file-pdf-o', 'table1.getSignedFile(\'' + model.UniqueId + '\')', 'Ver PDF (assinado)');
                    }
                }

                if(action.Action === 'CAN_CONSULT'){
                    options += buildActionItem('fa fa-eye', 'table1.consultActionClick(\'' + model.UniqueId + '\')', 'Consultar e-Gar');
                }

                if(action.Action === 'CAN_EDIT'){
                    options += buildActionItem('fa fa-tag', 'table1.editActionClick(\'' + model.UniqueId + '\')', 'Atribuir ou alterar etiqueta');
                }
    
    
                if(action.Action === 'CAN_REVOKE'){
                    options +=  buildActionItem('fa fa-trash', 'table1.revokeActionClick(\'' + model.UniqueId + '\')', 'Anular e-Gar');
                }
            });

            //duplicate egar
            options +=  buildActionItem('fa fa-copy', 'table1.duplicateActionClick(\'' + model.UniqueId + '\')', 'Duplicar e-Gar');

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


        //egar actions
        function renderPossibleActions(actions, msg, model, cell){

            var elem = '';
            angular.forEach(actions, function(action){
                switch(action.Action){
                    case 'CAN_AUTHORIZE':
                    case 'CAN_AUTHORIZE_AS_IF_ORIGIN':
                        elem += '<span ng-click=table1.impressionatAuthorization("' + model.UniqueId + '") class="btn btn-primary" title="' + 'Autorizar como produtor' + '"><em class="icon-check"></em></span>';
                        break;
                    case 'CAN_ACCEPT_RECTIFICATION_AS_IF_ORIGIN':
                        elem += '<span ng-click=table1.consultRectificationImpressionate("' + model.UniqueId + '") class="btn btn-info" title="' + 'Consultar correcção' + '"><em class="fa fa-pencil-square-o"></em></span>';
                        break;
                    case 'CAN_ACCEPT_RECTIFICATION':
                        elem += '<span ng-click=table1.consultRectification("' + model.UniqueId + '") class="btn btn-info" title="' + 'Consultar correcção' + '"><em class="fa fa-pencil-square-o"></em></span>';
                        break;
                    
                    case 'CAN_RECTIFY':
                        elem += '<span ng-click=table1.rectifyActionClick("' + model.UniqueId + '") class="btn btn-warning" title="' + 'Corrigir e-Gar' + '"><em class="fa fa-pencil"></em></span>';
                        break;
                    case 'CAN_ACCEPT_EMISSION':
                        elem += '<span ng-click=table1.acceptEmission("' + model.UniqueId + '") class="btn btn-success" title="' + 'Aceitar emissão e-Gar' + '"><em class="fa fa-thumbs-o-up"></em></span>';
                        break;
                    case 'CAN_REJECT_EMISSION':
                        elem += '<span ng-click=table1.rejectEmission("' + model.UniqueId + '") class="btn btn-danger" title="' + 'Rejeitar emissão e-Gar' + '"><em class="fa fa-thumbs-o-down"></em></span>';
                        break;
                    case 'CAN_REQUEST_AUTHORIZATION':
                        elem += '<span ng-click=table1.requestOriginAuthorization("' + model.UniqueId + '") class="btn btn-default" title="' + 'Requisitar autorização de emissão de e-Gar' + '"><em class="fa fa-paper-plane"></em></span>';
                        break;
                    case 'CAN_REQUEST_RECTIFICATION':
                        elem += '<span ng-click=table1.requestDestinAcceptance("' + model.UniqueId + '") class="btn btn-inverse" title="' + 'Requisitar aceitação de emissão de e-Gar' + '"><em class="fa fa-paper-plane"></em></span>';
                        break;
                    case 'CAN_REQUEST_RECTIFICATION_ACCEPTANCE':
                        elem += '<span ng-click=table1.requestOriginRetcificationAcceptance("' + model.UniqueId + '") class="btn btn-warning" title="' + 'Requisitar aceitação de correção de e-Gar' + '"><em class="fa fa-paper-plane"></em></span>';
                        break;

                    case 'CAN_SEND_PROOF_EGAR':
                        elem += '<span ng-click=table1.sendProofEgar("' + model.UniqueId + '") class="btn btn-primary" title="' + 'Enviar comprovativo de emissão de e-Gar' + '"><em class="fa fa-paper-plane"></em></span>';
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
            var smallSpan = null;
            var name = origin.Nome == null ? '' : origin.Nome;;
            var apaCode =  origin.CodApa == null ? '' : origin.CodApa;

            switch(origin.TipoRemetente){
                case 'OBRAS_RCD':
                case 'PRESTADOR_SERVICOS':
                    title = 'Nif Remetente: ' + origin.Nif;
                    name =  origin.Morada + ', ' + origin.Localidade + ' ' + origin.CodigoPostal;
                    smallSpan = '<span class="small">(Nif: '+origin.Nif+')</span>';
                    break;

                case 'OLEOS_ALIMENTARES':
                case 'EX_SITU':
                    title = 'Ponto de recolha: ' + origin.CodigoLocalRecolha;
                    name =  name;
                    smallSpan = '<span class="small">(Código: ' + origin.CodigoLocalRecolha + ')</span>';
                    break;

                case 'VEICULOS_FIM_VIDA':
                    title = 'Nif Remetente: ' + origin.Nif;
                    name =  origin.Morada + ', ' + origin.Localidade + ' ' + origin.CodigoPostal;
                    smallSpan = '<span class="small">(Nif: '+origin.Nif+')</span>';
                    break;
                
                default:
                    title = 'Estabelecimento: ' + name;
                    name = name;
                    smallSpan = '<span class="small">(Apa: ' + apaCode + ')</span>';
                    break
            }

            var r = '<span title="' + title + '">' + name + '</span>';

            if(smallSpan)  {
                r += '<br>' + smallSpan;
            }  

            return r;
            
            //example popover
            //var popoverFlag = 'showPopoverOrigin_' + getIntervinientType() + '_' + cell.row + '_' + cell.col;
            // return '<a ng-mouseenter="' + popoverFlag + '=true;" ng-mouseleave="' + popoverFlag + '= false;" class="popover-trigger">' +
            //             origin.Nif +
            //             '<div class="origin popover" ng-show="' + popoverFlag + '">' +
            //                     '<b>Nome:</b> ' + origin.Nome +
            //                     '<br/>' +
            //                     '<b>Morada:</b>' + origin.Morada
            //             '</div>' +
            //         '</a>'
            //         ;
        }

        function renderDestinName(destin, msg, model, cell){
            if(destin == null){ return ""; }
            
            var name = destin.Nome == null ? '' : destin.Nome;
            var apaCode = destin.CodApa == null ? '' : destin.CodApa;

            return '<span title="' + name + ' - ' + apaCode + '">' + name + '</span>';
        }

        function renderStatus(status, msg, model, cell){
            return '<span title="' + status + '">' + status + '</span> <br> <span><small> Em: ' + model.FormatedStatusDate + '<small></span>';
        }

        function renderResidue(residue, msg, model, cell){
            var smallSpan = null;
            
            if(model.Origin.TipoRemetente == 'VEICULOS_FIM_VIDA'){
                smallSpan = '<span class="small">(Matrícula: '+ model.Residue.MatriculaVfv +')</span>';
            }

            var title = residue.CodigoResiduoLer + ' - ' + residue.DescricaoResiduo;
            var r = '<span title="' + title + '">' + residue.CodigoResiduoLer + '</span>';

            if(smallSpan){
                r += '<br>' + smallSpan;
            }

            return r;
        }

        function renderResidueQuantity(residue, msg, model, cell){
            //TODO try use dateService
            //$rootScope.changeLocale = tmhDynamicLocale.set('pt');
            // $rootScope.$locale = $locale;
            // $rootScope.changeLocale = tmhDynamicLocale.set;

            //return '<span>' + $filter('currency')(residue.Quantidade, ''); + '</span>';
            return '<span>' + $filter('number')(residue.Quantidade, 2); + '</span>';
            //return '<span>' + residue.Quantidade + '</span>';
        }

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        function getColumnFilterNames(){
            var result = [];
            $('.tableFilter').each(function(){  
                result.push(this.id) 
            });

            if(vm.selectedProductCode){
                result.push("selectedProductCode");
            }

            return result;
        }

        function getColumnFilterValues(){
            var result = [];

            result.push(vm.selectedIntervinientType.key);            
            result.push(vm.egarNumber);
            result.push(vm.origin);
            result.push(vm.destin);
            result.push(vm.lerCode);
            result.push(vm.selectedEgarStatus.key);
            result.push(vm.selectedWaittingAuthorization.key);
            
            result.push(vm.selectedProductCode ? vm.selectedProductCode.uniqueId : '');
            
            return result;
        }

        function setColumnFilterValues(request){
            vm.selectedIntervinientType = utilsService.getSingleOrDefault(vm.intervinientTypeOptions, { 'key': request.FilterValues[0] });
            vm.egarNumber = request.FilterValues[1];
            vm.origin = request.FilterValues[2];
            vm.destin = request.FilterValues[3];
            vm.lerCode = request.FilterValues[4];
            vm.selectedEgarStatus = utilsService.getSingleOrDefault(vm.egarStatusOptions, { 'key': request.FilterValues[5] });
            vm.selectedWaittingAuthorization = utilsService.getSingleOrDefault(vm.waittingAuthorizationOptions, { 'key': request.FilterValues[6] });
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
                }
              //scope: $scope
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
                }
                //scope: $scope
            });
        }


        /////////////////////////////////////////////////////////

        $rootScope.$on('reloadTableEGars', function (evnt, data) {
            vm.dtInstance.reloadData(null, false);
        });
  

        $scope.preCloseCallbackOnScope = function (value) {
            // if(confirm('Close it? MainCtrl.OnScope (Value = ' + value + ')')) {
            //   return true;
            // }
            // return false;
        };
    }



    angular.module('custom')
        .directive('ngEnter', function () { //a directive to 'enter key press' in elements with the "ng-enter" attribute

            return function (scope, element, attrs) {

                element.bind("keydown keypress", function (event) {

                    if (event.which === 13) {
                        scope.$apply(function () {
                            scope.$eval(attrs.ngEnter);
                        });

                        event.preventDefault();
                    }
                });
            };
        })

})();
 

