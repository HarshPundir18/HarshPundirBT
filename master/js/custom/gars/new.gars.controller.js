(function() {
    'use strict';

    angular
        .module('custom')
        .controller('garsController', garsController);

    garsController.$inject = ['$q', '$scope', '$state', '$stateParams', '$filter', 'translationService', 'dateService',
                                'Notify','garsService', 'spinnerService', 'utilsService', 'pickupPointsService', 'settingsService',
                                'ngDialog', 'SMG_CONST_PICKUP_POINTS'];
    function garsController($q, $scope, $state, $stateParams, $filter, translationService, dateService,
                                Notify, garsService, spinnerService, utilsService, pickupPointsService, settingsService,
                                ngDialog, SMG_CONST_PICKUP_POINTS) {
        var vm = this;
        vm.pickupPointTypeExSitu = SMG_CONST_PICKUP_POINTS.EX_SITU;
        vm.pickupPointTypeOua = SMG_CONST_PICKUP_POINTS.OUA;

        vm.showAdr = true;

        dateService.changeLocalePt();

        var createEgarInFlight = null;
        vm.serverValidationErrors = [];
        vm.serverApplicationErrors = [];
        
        vm.chosen = [];
        vm.selectedEgarCreateType = 'PRODUTOR_ESTABELECIMENTO';
        vm.currentTransporterIndex = 0;
        vm.transportersArray = [
            {
                vat:'',
                plate:'',
                year: 0,
                month: 0,
                day: 0,
                hour:new Date(),
                index: 0
            }
        ];

        vm.transportersArrayV2 = [];

        vm.operationCodes = garsService.operationCodes();
        vm.selectedOperationCode = '';

        vm.lerCodes = garsService.lerCodes();
        vm.selectedLerCode = '';

        vm.allProducerType = garsService.producerTypes();
        vm.producerType = '';

        vm.allGroupCodes = garsService.groupCodes();
        vm.groupCode = '';

        vm.groupCodeForLerCode = garsService.groupCodeForLerCode();
        vm.showGroupCode = false;

        vm.pglNumberForLerCodes = garsService.pglNumberForLerCodes();
        vm.showPglNumber = false;

        vm.pickupPointsToShow = null;
        vm.pickupPoints = null;
        vm.pickupPointsExSitu = null;


        vm.selectedProductCode = null;
        vm.onSelectedProductCodeChange = function (obj){
            if(obj){
                //set eGar description to the product description
                vm.lerDescription = obj.description.trim();
            }
        };
        
        vm.onSelectedOnuNumberChange = function (obj){
            console.log('onSelectedOnuNumberChange: ' + obj);
        };

        vm.onSelectedOnuNumberPackageChange = function (obj){
            console.log('onSelectedOnuNumberPackageChange: ' + obj);
        };

        vm.onSelectedPickupPointChange = function(obj){
            vm.localOAU = obj ? obj.internalCode : null;
        }

        function setOrigin(eGarToDuplicate){
            vm.selectedEgarCreateType = eGarToDuplicate.Origin.TipoRemetente;
            switch(vm.selectedEgarCreateType){
                case 'OLEOS_ALIMENTARES':
                    vm.localOAU = eGarToDuplicate.Origin.CodigoLocalRecolha;
                    break;

                case 'OBRAS_RCD':
                case 'VEICULOS_FIM_VIDA':
                case 'PRESTADOR_SERVICOS':
                    vm.vatRCD = eGarToDuplicate.Origin.Nif;
                    vm.addressRCD = eGarToDuplicate.Origin.Morada;
                    vm.localRCD = eGarToDuplicate.Origin.Localidade;
                    vm.postalCodeRCD = eGarToDuplicate.Origin.CodigoPostal;
                    break;
                
                //PRODUTOR_ESTABELECIMENTO
                default:
                    vm.vatOrigin = eGarToDuplicate.Origin.Nif;
                    vm.codApaOrigin = eGarToDuplicate.Origin.CodApa;
                    vm.selectedProducerType = eGarToDuplicate.ProducerType;
                    vm.nameOrigin = eGarToDuplicate.Origin.Nome;
                    vm.addressOrigin = eGarToDuplicate.Origin.Morada;
                    vm.vatRCD = eGarToDuplicate.Origin.Nif;;
                    break;
            }
        }

        function setResidue(eGarToDuplicate){
            if(vm.clientSettings.duplicateEgarQuantity === true) {
                vm.quantity = eGarToDuplicate.Residue.Quantidade;
            }
            
            vm.lerDescription = eGarToDuplicate.Residue.DescricaoResiduo;
            vm.selectedLerCode = $filter('filter')(vm.lerCodes, { 'key': eGarToDuplicate.Residue.CodigoResiduoLer })[0];
            vm.selectedOperationCode =  $filter('filter')(vm.operationCodes, { 'key': eGarToDuplicate.Residue.CodigoOperacao })[0];

            checkIfPglNumberShouldBeEnabled();
    
            checkIfGroupCodeShouldBeEnabled();

            var groupCode = $filter('filter')(vm.allGroupCodes, { 'key': eGarToDuplicate.Residue.CodigoGrupo })[0];
            if(groupCode){
                vm.groupCode = groupCode.key;
            }

            //check if is eGar ADR
            if(eGarToDuplicate.Residue.AdrOnuNumber){
                vm.checkAdr = true;
                vm.adrVolume = eGarToDuplicate.Residue.AdrVolumes;
                vm.adrObsI = eGarToDuplicate.Residue.AdrObsI;
                vm.adrObsII = eGarToDuplicate.Residue.AdrObsII;
                vm.selectedOnuNumberPackage = eGarToDuplicate.Residue.AdrPackageGroup;
                vm.setOnuNumber = eGarToDuplicate.Residue.AdrOnuNumber;
            }
        }

        function setDestin(eGarToDuplicate){
            vm.vatDestin = eGarToDuplicate.Destin.Nif;
            vm.codApaDestin = eGarToDuplicate.Destin.CodApa;
            vm.numPgl = eGarToDuplicate.NumPgl;
            vm.nameDestin = eGarToDuplicate.Destin.Nome;
            vm.addressDestin = eGarToDuplicate.Destin.Morada;
        }

        function setTransporters(eGarToDuplicate){
            vm.transportersArray[0].vat = eGarToDuplicate.Transporters[0].Nif;
        }

        //
        activate();

        vm.selectedLocalOAUChange = function(){
            vm.localOAU = vm.selectedLocalOAU.InternalCode;
        }

        vm.selectedLocalOAUKeyUp = function(val){
            if((val && val.length > 2) || val == ''){
                pickupPointsService
                    .getPickupPointsOua(val)
                    .then(getPickupPointsOuaOnSuccess)
                    .catch(getPickupPointsOuaOnError);
            }
        }

        vm.egarCreateTypeChanged = function(type){
            console.log(vm.selectedEgarCreateType);            
        }

        vm.validateInput = function(name, type) {
         
            if(name == 'groupCode'){
                return validateGoupCode();
            }

            //TODO: validate ADR

            var input = vm.formValidate[name];
            var errorType = input.$error[type];
            var result = (input.$dirty || vm.submitted) && errorType;
            return result;
        };

        vm.lerCodeChange = function(){
            console.log(vm.selectedLerCode.key);
            checkIfGroupCodeShouldBeEnabled();
            checkIfPglNumberShouldBeEnabled();
            
            var lerCodeItem = $filter('filter')(vm.lerCodes, function(lerCode){
              return lerCode.key === vm.selectedLerCode.key;
            });
            
            if(lerCodeItem && !isDuplicateEgar()){
                vm.lerDescription = lerCodeItem[0].value.trim();
            }
        }

        vm.operationCodeChange = function(){
            //console.log(vm.selectedOperationCode.key);
            checkIfPglNumberShouldBeEnabled();
        }

        vm.originSearchChangeV2 = function(){
            console.log(vm.selectedOrigin.EstablishmentName);
            vm.codApaOrigin = vm.selectedOrigin.ApaCode;
            vm.vatOrigin = vm.selectedOrigin.Vat;
            vm.nameOrigin = vm.selectedOrigin.EstablishmentName;
            vm.addressOrigin = vm.selectedOrigin.Address.DisplayAddress;

            vm.vatRCD = vm.selectedOrigin.Vat;
        }

        vm.originSearchChangeV3 = function(item){
            //console.log(item);
            vm.codApaOrigin = item.apaCode;
            vm.vatOrigin = item.vat;
            vm.nameOrigin = item.name;
            vm.addressOrigin = item.address;

            vm.vatRCD = item.vat;
            vm.addressRCD = item.street;
            vm.localRCD = item.local;
            vm.postalCodeRCD = item.postalCode; 
        }

        vm.originDataChange = function(){
            vm.selectedOrigin = null;
        }

        vm.destinSearchChangeV2 = function(){
            console.log(vm.selectedDestin.EstablishmentName);
            vm.codApaDestin = vm.selectedDestin.ApaCode;
            vm.vatDestin = vm.selectedDestin.Vat;
            vm.nameDestin = vm.selectedDestin.EstablishmentName;
            vm.addressDestin = vm.selectedDestin.Address.DisplayAddress;
        }

        vm.destinSearchChangeV3 = function(item){
            console.log(item);
            vm.codApaDestin = item.apaCode;
            vm.vatDestin = item.vat;
            vm.nameDestin = item.name;
            vm.addressDestin = item.address;
        }

        vm.destinDataChange = function(){
            vm.selectedDestin = null;
        }

        vm.addTransporter = function(item){
            if(vm.transportersArray.length >= 5){
                Notify.alert( 
                    '<em class="fa fa-warning"></em> Número máximo de 5 transportadores', 
                    { status: 'warning'}
                );
                return
            }

            vm.currentTransporterIndex ++;

            var newTransporter = {
                vat:'',
                plate:'',
                year: '',
                month: '',
                day: '',
                hour: new Date(),
                index: vm.currentTransporterIndex,
            }
            
            vm.transportersArray.push(newTransporter);
        }

        vm.removeTransporter = function(transporter){
            vm.transportersArray = vm.transportersArray.filter(function( obj ) {
                return obj.index !== transporter.index;
            });
        }

        vm.updateTransporterTime = function(index, time){
            //IE does not support .find() fuck IE
            // vm.transportersArray.find(function(transporter){
            //     return transporter.index === index;
            // }).hour = time;

            var transporter = $filter('filter')(vm.transportersArray, function(transporter){
                return transporter.index === index;
              })[0];

              transporter.hour = time;
        }

        vm.updateTransporterDate = function(index, date){
            //IE does not support .find() fuck IE
            // var transporter = vm.transportersArray.find(function(transporter){
            //     return transporter.index === index;
            // });
            var transporter = $filter('filter')(vm.transportersArray, function(transporter){
                return transporter.index === index;
              })[0];

            if(transporter){
                transporter.date = date;
                transporter.timeZoneOffset = date.getTimezoneOffset();
                transporter.day = date.getDate();       // yields date
                transporter.month = date.getMonth() + 1;    // yields month (add one as '.getMonth()' is zero indexed)
                transporter.year = date.getFullYear();  // yields year
            }
        }

        vm.submitted = false;
        // Submit form
        vm.submitForm = function() {
            vm.serverValidationErrors = [];
            vm.submitted = true;

            if (vm.formValidate.$valid) {
                //var entities = checkIntervinients();
                //var entities = checkIntervinientsv2();
                checkIntervinientsV3().then((result) => {
                    var entities = result.data.Establishments;

                    if(entities.length == 0){
                        //no intervenient, default establishment or one that is allowed to issue egars 
                        // utilsService.notifyWarning(translationService.translate("no_default_establishment_present"));
                        //return;
                        submitEgarCreation();
                    }
                    else if(entities.length == 1){
                        //if there is only one possible issuer, get his uniqueId
                        vm.eGarIssuer = entities[0].UniqueId;
                        submitEgarCreation();
                    }else if(entities.length == 2){
                        if(vm.selectedEgarCreateType !== 'OBRAS_RCD' && entities[0].UniqueId === entities[1].UniqueId) {
                            utilsService.notifyWarning('O estabelecimento ' + entities[0].Name + ' não pode ser Produtor/Detentor e Destinatário na mesma eGar!');;
                        }else {

                            if(vm.selectedEgarCreateType !== 'OBRAS_RCD'){
                                //if there are more than one possible issuer, show dialog to select issuer
                                $scope.msg  = 'yeee';
                                var dialog = ngDialog.open({
                                    template: '/app/custom/gars/select.egar.issuer.dialog.html',
                                    className: 'ngdialog-theme-default accept-emission',
                                    controller: 'selectEgarIssuerDialogController as $ctrl',
                                    scope: $scope,
                                    resolve : {
                                        //parameter passed to dialog
                                        entities: function (){ return entities; }
                                    }
                                });

                                dialog.closePromise.then(function(res) {
                                    if(res.value === '$closeButton' || res.value === 'cancel'){
                                        return;
                                    }

                                    vm.eGarIssuer = res.$dialog.scope().selectedIssuer;
                                    submitEgarCreation();
                                });
                            } else {
                                vm.eGarIssuer = entities[1].UniqueId;
                                submitEgarCreation();
                            }  
                        }  
                    }
                });

            }else{
                utilsService.notifyInvalidFormValidation();
            }
        };

        vm.cancel = function(){
            $state.go('app.overviewGars')
        }

        vm.checkTransporterOrigin = false;
        vm.clickTransporterOrigin = function(index){
            vm.checkTransporterOrigin = !vm.checkTransporterOrigin;
            vm.checkTransporterDestin = false;

            var vat = '';
            if(vm.selectedEgarCreateType === 'OBRAS_RCD' || vm.selectedEgarCreateType === 'VEICULOS_FIM_VIDA') {
                vat =  vm.vatRCD;
            } else {
                vat = vm.vatOrigin;
            }

            //set vat
            vm.transportersArray[index].vat = vm.checkTransporterOrigin ? vat : '';
        }

        vm.checkTransporterDestin = false;
        vm.clickTransporterDestin = function(index){
            vm.checkTransporterDestin = !vm.checkTransporterDestin;
            vm.checkTransporterOrigin = false;
            //set vat
            vm.transportersArray[index].vat = vm.checkTransporterDestin ? vm.vatDestin : '';
        }

        vm.selectEstablishmentOnChange = function(obj){
             console.log('Page onChange');
        }

        vm.createTransportersInputName = (index) => { return `vatTransporter${index}`; }


        //WIP
        vm.saveAsModel = function(){
            //if one creation in flight do not allow create another
            if(createEgarInFlight){
                console.log('request is in flight...');
                return;
            }

            var data = {};
            data.quantity = vm.quantity;
            data.selectedLerCode = vm.selectedLerCode.key;
            data.lerDescription = vm.lerDescription;
            data.selectedOperationCode = vm.selectedOperationCode.key;
            data.groupCode = vm.groupCode;
            data.nameOrigin = vm.nameOrigin;
            data.addressOrigin = vm.addressOrigin;
            data.vatOrigin = vm.vatOrigin;
            data.codApaOrigin = vm.codApaOrigin;
            data.selectedProducerType = vm.selectedProducerType;
            data.nameDestin = vm.nameDestin;
            data.addressDestin = vm.addressDestin;
            data.vatDestin = vm.vatDestin;
            data.codApaDestin = vm.codApaDestin;
            data.numPgl = vm.numPgl;
            data.transporters = vm.transportersArray;

            var dialog = ngDialog.open({
                template: '/app/custom/gars/save.gar.model.dialog.html',
                className: 'ngdialog-theme-default save-gar-model',
                preCloseCallback: 'preCloseCallbackOnScope',
                controller: 'saveGarModelDialogController as $ctrl',
                resolve : { garModel: function (){ return data; } }
            });

            dialog.closePromise.then(function(res) {
              // alert(res) 
            });
        }

        vm.clickAdr = function (){
            console.log('clickAdr' + vm.checkAdr);
        }

        ////////////////
        function checkIfPglNumberShouldBeEnabled(){
            vm.showPglNumber = $.inArray(vm.selectedLerCode.key, vm.pglNumberForLerCodes) > -1 && vm.selectedOperationCode.key === 'R10';
        }

        function checkIfGroupCodeShouldBeEnabled(){
            vm.showGroupCode = $.inArray(vm.selectedLerCode.key, vm.groupCodeForLerCode) > -1;
            if(!vm.showGroupCode){
                vm.groupCode = null;
            }
        }

        function getPickupPointsOuaOnSuccess(result){
            vm.pickupPoints = result.data;
            vm.pickupPointsToShow = vm.pickupPoints;
        }

        function getPickupPointsOuaOnError(error){
            vm.pickupPoints = [];
        }

        function getPickupPointsExSituOnSuccess(result){
            vm.pickupPointsExSitu = result.data;
            vm.pickupPointsToShow = vm.pickupPointsExSitu;
        }

        function getPickupPointsExSituOnError(error){
            vm.pickupPointsExSitu = [];
        }

        function activate() {
            spinnerService.show('#newEgar');
            
            //if is duplicating egar
            if(isDuplicateEgar()){
                var getSettingsRequest = settingsService
                                            .getClientSettings()
                                            .then((result)=>{
                                                if(result.data){
                                                    vm.clientSettings = {
                                                        sendAutomaticRequestEmails: result.data.SendAutomaticRequestEmails,
                                                        duplicateEgarQuantity: result.data.DuplicateEgarQuantity                                                        
                                                    };
                                                }
                                            });

                var getEgarRequest = garsService
                                        .getEGar($stateParams.garId)
                                        .then(function(result){
                                            vm.eGarToDuplicate = result.data;
                                        });

                $q.all([getSettingsRequest,getEgarRequest])
                .then(function(){
                    //set origin
                    setOrigin(vm.eGarToDuplicate);
                        
                    //set residue
                    setResidue(vm.eGarToDuplicate);
                    
                    //set destin
                    setDestin(vm.eGarToDuplicate);

                    setTransporters(vm.eGarToDuplicate);

                    if(vm.eGarToDuplicate.Product){
                        $scope.$broadcast('notifySetProduct', vm.eGarToDuplicate.Product); 
                    }
                    $scope.$broadcast('notifySetOnuNumber', vm.eGarToDuplicate.Residue.AdrOnuNumber);
                    
                    //spinnerService.hide('#newEgar');
                    checkHideSpinner();
                })
                .catch(function(){
                    //spinnerService.hide('#newEgar');
                    checkHideSpinner();
                });
            }

            //spinnerService.hide('#newEgar');
            checkHideSpinner();
        }
        
        function isDuplicateEgar(){
            return $stateParams.garId;
        }

        function submitEgarCreation(){
            var data = {};
            data.selectedEgarCreateType = vm.selectedEgarCreateType;
            data.quantity = vm.quantity;
            data.selectedLerCode = vm.selectedLerCode.key;
            data.lerDescription = vm.lerDescription;
            data.selectedOperationCode = vm.selectedOperationCode.key;
            data.groupCode = vm.groupCode;
            data.nameOrigin = vm.nameOrigin;
            data.addressOrigin = vm.addressOrigin;
            data.vatOrigin = vm.vatOrigin;
            data.codApaOrigin = vm.codApaOrigin;
            data.selectedProducerType = vm.selectedProducerType;
            data.nameDestin = vm.nameDestin;
            data.addressDestin = vm.addressDestin;
            data.vatDestin = vm.vatDestin;
            data.codApaDestin = vm.codApaDestin;
            data.numPgl = vm.numPgl;
            data.transporters = vm.transportersArray;
            data.issuer = vm.eGarIssuer;
            data.vatRCD = vm.vatRCD;
            data.addressRCD = vm.addressRCD;
            data.localRCD = vm.localRCD;
            data.postalCodeRCD = vm.postalCodeRCD;
            data.localOAU = vm.localOAU;
            data.plateVFV = vm.plateVFV;
            data.selectedProductCodeId = vm.selectedProductCode ? vm.selectedProductCode.uniqueId : null;

            if(vm.checkAdr){
                data.adrOnuNumber = vm.selectedOnuNumber.code;
                data.adrPackageGroup = vm.selectedOnuNumberPackage;
                data.adrVolume = vm.adrVolume;
                data.adrObsI = vm.adrObsI;
                data.adrObsII = vm.adrObsII;
            }

            //if one creation in flight do not allow create another
            if(createEgarInFlight){
                console.log('already creating egar...');
                return;
            }

            spinnerService.show('#newEgar');
            createEgarInFlight = garsService
                                    .createEGar(data)
                                    .then(onCreateEGarSuccess)
                                    .catch(onCreateEGarError);
        }


        function onCreateEGarSuccess(result){
            $state.go('app.overviewGars');         
     
            utilsService.notifySuccess('Criada com sucesso <br> E-Gar nº ' + result.data.Number);

            if(result.data.ShoudlSendProofEgarEmail){
                if(result.data.ProofEgarEmailSentTo && result.data.ProofEgarEmailSentTo.length > 0){
                    var msg = 'Enviado email com comprovativo de criação de e-Gar para: ';
                    result.data.ProofEgarEmailSentTo.map((email)=>{
                        msg += '<br/>';
                        msg += '- ' + email;
                    });

                    utilsService.notifySuccess(msg);
                }else {
                    utilsService.notifyWarning('Não foi enviado comprovativo de criação de e-Gar, porque não tem contacto de email associado ao cliente.');
                }
            }

            spinnerService.hide('#newEgar');
            createEgarInFlight = null;  
        }

        function onCreateEGarError(error, status){
            spinnerService.hide('#newEgar');
            createEgarInFlight = null; 
            
            if(error.data._validationErrors && error.data._validationErrors.length > 0) {
                var firstError =  error.data._validationErrors[0];
                utilsService.notifyWarning(translationService.translate(firstError.Message))
                return;
            }
            
            if(error.data._applicationErrors && error.data._applicationErrors.length > 0) {
                var firstError =  error.data._applicationErrors[0];
                utilsService.notifyWarning(translationService.translate(firstError.Message))
                return;
            }

            var notificationErrorMessage = '';
            var externalErrors = error.data._externalErrors;
            if(externalErrors){
                utilsService.parseAndNotifyExternalErrors(externalErrors);
                ngDialog.close();
            }
        }

        function validateGoupCode(){
            if(vm.selectedLerCode){
                var mustValidate = $.inArray(vm.selectedLerCode.key, vm.groupCodeForLerCode) > -1;
                if(mustValidate && (!vm.groupCode  || vm.groupCode.length < 1)){
                    return true; 
                }
                return false;
            }

            return false;  //no error
        }

        function checkIntervinientsv2(){
            var entities = [];    
            checkOriginIntervinient(vm.codApaOrigin, entities);
            checkIntervinientByApaCode(vm.codApaDestin, entities);
            return entities;
        }

        function checkIntervinientsV3(){
            var request = {
                SelectedEgarCreateType: vm.selectedEgarCreateType,
                TransporterVats: buildIntervinientVatList(),
                OriginApaCode: vm.codApaOrigin,
                OriginVat: vm.vatOrigin ? vm.vatOrigin : vm.vatRCD,
                DestinApaCode: vm.codApaDestin,
                DestinVat: vm.vatDestin,
            };
            
            return garsService.checkIntervinientsV3(request);    
        }


        function checkOriginIntervinient(codApa, entitiesArray) {
            if(vm.selectedEgarCreateType === 'PRODUTOR_ESTABELECIMENTO'){
                checkIntervinientByApaCode(codApa, entitiesArray);
                return;
            } 
            
            if (vm.selectedEgarCreateType === 'OBRAS_RCD' || vm.selectedEgarCreateType === 'PRESTADOR_SERVICOS') {
                var filteredEstablishments = vm.chosen.filter((option) => {
                    return option.Vat === vm.vatRCD;
                });
    
                //if not found
                if(!filteredEstablishments || filteredEstablishments.length === 0) {
                    return;
                }
    
                var establishment = filteredEstablishments[0];
                if(establishment.IsDefault) {
                    entitiesArray.push(establishment);
                } 
            }
            
        }

        function checkIntervinientByApaCode(codApa, entitiesArray) {
            var filteredEstablishments = vm.chosen.filter((option) => {
                return option.ApaCode === codApa;
            });

            if(!filteredEstablishments || filteredEstablishments.length === 0) {
                return;
            }

            var establishment = filteredEstablishments[0];
            if(establishment.IsDefault){
                entitiesArray.push(establishment);
            }
        }

        function checkHideSpinner(){
            if(vm.smgSelectEstablishmentOriginReady && vm.smgSelectEstablishmentDestinReady){
                spinnerService.hide('#newEgar');
            }
        }

        function buildIntervinientVatList(){
            var transporterVats = [];
            vm.transportersArray.map((transporter)=>{
                transporterVats.push(transporter.vat);
            })
            return transporterVats;
        }

        //timePicker event handling
        $scope.$on('timepickerControllerChanged', function (evnt, data) {
             vm.updateTransporterTime(data.index, data.time)
        });

        //datePicker event handling
        $scope.$on('datepickerControllerChanged', function (evnt, data) {
            vm.updateTransporterDate(data.index, data.date)
        });

        $scope.$watch('$ctrl.selectedEgarCreateType', function (newValue, oldValue) {
            // vm.localOAU = null;
            // vm.selectedLocalOAU = null;

            // if(vm.selectedEgarCreateType === 'OLEOS_ALIMENTARES'){
            //     if(vm.pickupPoints == null){
            //         //load
            //         pickupPointsService
            //             .getPickupPointsOua()
            //             .then(getPickupPointsOuaOnSuccess)
            //             .catch(getPickupPointsOuaOnError);
            //     }
            //     else {
            //         vm.pickupPointsToShow = vm.pickupPoints;
            //     }
            // }

            // if(vm.selectedEgarCreateType === 'EX_SITU'){
            //     if(vm.pickupPointsExSitu == null){
            //         //load
            //         pickupPointsService
            //             .getPickupPointsExSitu()
            //             .then(getPickupPointsExSituOnSuccess)
            //             .catch(getPickupPointsExSituOnError);
            //     } 
            //     else{
            //         vm.pickupPointsToShow = vm.pickupPointsExSitu;
            //     }
            // }
        });

        $scope.$watch('$ctrl.selectedOnuNumber', function(newValue, oldValue){
            //TODO
        });

        $scope.$watch('$ctrl.selectedOnuNumberPackage', function(newValue, oldValue){
            //TODO
        });

        $scope.$on('fetchEstablishmentFinished_smgSelectEstablishmentOrigin', function(event, item){
            vm.smgSelectEstablishmentOriginReady = true;
            checkHideSpinner();
        });

        $scope.$on('fetchEstablishmentFinished_smgSelectEstablishmentDestin', function(event, item){
            vm.smgSelectEstablishmentDestinReady = true;
            checkHideSpinner();
        });
    }
})();
