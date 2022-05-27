(function(){
    'use strict';

    angular
        .module('custom')
        .service('garsDatatableService', garsDatatableService);

        garsDatatableService.$inject = ['$http', '$q', '$log', '$filter', '$compile', '$location', 'localStorageService'];
    function garsDatatableService ($http, $q, $log, $filter, $compile, $location, localStorageService) {

        function _createdRow(row, data, dataIndex, scope) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())(scope);
        }

        function _renderNumber(egarNumber, msg, model, cell){
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

        function _renderOriginName(origin, msg, model, cell){
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
        }

        function _renderDestinName(destin, msg, model, cell){
            if(destin == null){ return ""; }
            
            var name = destin.Nome == null ? '' : destin.Nome;
            var apaCode = destin.CodApa == null ? '' : destin.CodApa;

            return '<span title="' + name + ' - ' + apaCode + '">' + name + '</span>';
        }
        
        function _renderResidue(residue, msg, model, cell){
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

        function _renderResidueQuantity(residueQuantidade, msg, model, cell){
            return '<span>' + $filter('number')(residueQuantidade, 2); + '</span>';
        }

        function _renderStatus(status, msg, model, cell){
            return '<span title="' + status + '">' + status + '</span> <br> <span><small> Em: ' + model.FormatedStatusDate + '<small></span>';
        }

        function _renderDueDays(dueDays, msg, model, cell){
            return '<span title="' + dueDays + '">' + dueDays + '</span>';
        }

        function _renderPossibleActions(actions, msg, model, cell){
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

        function _renderActionButtons_v2(actions, msg, model, cell){
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

        
        //PUBLICS
        this.createdRow = _createdRow;
        this.renderNumber = _renderNumber;
        this.renderOriginName = _renderOriginName;
        this.renderDestinName = _renderDestinName;
        this.renderResidue = _renderResidue;
        this.renderResidueQuantity = _renderResidueQuantity;
        this.renderStatus = _renderStatus;
        this.renderDueDays = _renderDueDays;
        this.renderPossibleActions = _renderPossibleActions;
        this.renderActionButtons_v2 = _renderActionButtons_v2;
    }

})();
