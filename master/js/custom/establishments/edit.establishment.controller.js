(function() {
    'use strict';

    angular
        .module('custom')
        .controller('editEstablishmentController', editEstablishmentController);

    editEstablishmentController.$inject = ['$state', '$rootScope', '$stateParams', '$filter', 
        'establishmentService', 'spinnerService', 'utilsService', 'Notify', 'ngDialog',
        'SMG_CONST_PICKUP_POINTS'];
    function editEstablishmentController($state, $rootScope, $stateParams, $filter, 
        establishmentService, spinnerService, utilsService, Notify, ngDialog, 
        SMG_CONST_PICKUP_POINTS) {

        var vm = this;
        var loadGifSelector = '#editEstablishment';

        spinnerService.show(loadGifSelector);

        vm.$onInit = function () {
        }

        vm.establishment = null;
        vm.accessInvalidMsg = null;
        vm.accessInvalid = true;
        vm.submitted = false;
        vm.serverValidationErrors = [];
        vm.usersEstablishmentPermissions = [];
        vm.establishmentUsers = [];
        vm.selectedPermissionType = [];
        vm.allPermissionType = [
            { id: 0, name: 'Sem Permissão' },
            { id: 10, name: 'Administrador' },
            { id: 20, name: 'Colaborador' },
            { id: 30, name: 'Motorista' },
            { id: 100, name: 'Externo' }
        ];
        vm.placeholder="Selecione uma opção";
        vm.selectPickupPointOua = "selectPickupPointOua";
        vm.selectPickupPointExSitu = "selectPickupPointExSitu";
        vm.pickupPointTypeExSitu = SMG_CONST_PICKUP_POINTS.EX_SITU;
        vm.pickupPointTypeOua = SMG_CONST_PICKUP_POINTS.OUA;

        if(!$stateParams.establishmentId){
            $state.go('app.establishmentOverview');
        }

        establishmentService
                .getEstablishment($stateParams.establishmentId)
                .then(getEstablishmentOnSuccess)
                .catch(getEstablishmentOnError)
                .finally(()=>{ spinnerService.hide(loadGifSelector) });
        
        

        establishmentService
            .getUsersEstablishmentPermissions($stateParams.establishmentId)
            .then(getUsersEstablishmentPermissionsOnSuccess)
            .catch(getUsersEstablishmentPermissionsOnError);

        vm.updateApaAccess = function(){
            ngDialog.open({
                template: '/app/custom/establishments/update.access.dialog.html',
                className: 'ngdialog-theme-default',
                controller: 'establishmentDialogController as $ctrl',
                resolve : {
                    establishment: function (){ return vm.establishment; }
                }
            });
        }

        vm.validateInput = function(name, type) {           
            var input = vm.formValidate[name];
            var errorType = input.$error[type];
            return (input.$dirty || vm.submitted) && errorType;
          };

               
        // Submit form
        vm.submitForm = function() {

            vm.submitted = true;
            if (vm.formValidate.$valid) {
                spinnerService.show(loadGifSelector);

                var data = {};
                data.Vat = vm.vat;
                data.ApaCode = vm.apaCode ? vm.apaCode.ApaCode : null;
                data.OrganizationName = vm.organizationName;
                data.PrimaryCae = vm.primaryCae;
                data.SecondaryCae = vm.secondaryCae;
                data.Name = vm.establishmentName;
                data.Phone = vm.phone;
                data.Fax = vm.fax;
                data.Mobile = vm.mobile;
                data.Email = vm.email;
                data.Street = vm.address;
                data.PostalCode = vm.postalCode;
                data.Locale = vm.locale;
                data.City = vm.city;
                data.Obs = vm.obs;
                data.ContactPersonName1 = vm.person1Name;
                data.ContactPersonEmail1 = vm.person1Email;
                data.ContactPersonMobile1 = vm.person1Mobile;
                data.ContactPersonName2 = vm.person2Name;
                data.ContactPersonEmail2 = vm.person2Email;
                data.ContactPersonMobile2 = vm.person2Mobile
                data.IsContractor = vm.contractor;
                data.UsersEstablishmentPermissions = getChangedOnly();

                data.ProduceExSituAnimalOrigin = vm.produceExSituAnimalOrigin;

                if(vm.produceExSitu && vm.selectedPickupPointExSitu){
                    data.PickupPointExSituUniqueId = vm.selectedPickupPointExSitu.uniqueId;
                } else {
                    data.PickupPointExSituUniqueId = null;
                }

                if(vm.produceOua && vm.selectedPickupPointOua){
                    data.PickupPointOuaUniqueId = vm.selectedPickupPointOua.uniqueId;
                } else{
                    data.PickupPointOuaUniqueId = null;
                }

                establishmentService
                    .update(vm.establishment.UniqueId, data)
                    .then(updateEstablishmentOnSuccess, updateEstablishmentOnError)
                    .finally(() => { spinnerService.hide(loadGifSelector) });

            } else {
              console.log('Not valid!!');
              return false;
            }
        };
        
        vm.originSearchChangeV3 = function(){
            console.log('edit establishment originSearchChangeV3')
        }

        vm.cancel = function(){
            var goToStatte = vm.establishment.IsDefault ? 'app.myEstablishmentsOverview' : 'app.establishmentOverview';
            $state.go(goToStatte);
        }
       

        vm.selectedPermissionTypeChanged = function(userId, selectedPermission){

            vm.usersEstablishmentPermissionsChanged = true;

            //find user
            var user = $filter('filter')(vm.usersEstablishmentPermissions, function(user){ return user.UserId === userId; })[0];

            if(user == null){
                return;
            }
            //change user establishment permission
            user.NewUserEstablishmentPermission = selectedPermission;
        }

        
        vm.vatChanged = function(){
            if(vm.vat && vm.vat.length == 9){
                loadApaEstablishments();
            }else{
                vm.vatEstablishments = [];
                vm.apaAccess = null;
            }
        }

        vm.onEditVatClick = ()=>{
            vm.editVat=true;
            vm.editApa = true;
            loadApaEstablishments();
        }

        vm.onEditApaCodeClick = ()=>{
            vm.apaCode = null;
            vm.editApa = true;
            loadApaEstablishments();
        }

        function loadApaEstablishments(){
            spinnerService.show('.smgSelectApaCode');
                establishmentService
                    .getRemoteEstablishmentsByVat(vm.vat)
                    .then(function(result){
                        vm.vatEstablishments = [];
                        angular.forEach(result.data.result.Establishments, function(establishment){
                            vm.vatEstablishments.push(establishment);
                        });
                    })
                    .catch(function(){

                    })
                    .finally(function(){
                        spinnerService.hide('.smgSelectApaCode');
                    });
        }

        function getChangedOnly(){
            var changedOnly = $filter('filter')(vm.usersEstablishmentPermissions, function(user){
                                    return user.NewUserEstablishmentPermission !== user.UserEstablishmentPermission;
                            });

            if(changedOnly && changedOnly.length > 0){
                return changedOnly;
            }

            return [];
        }

        function getEstablishmentOnSuccess(result){       
            vm.establishment = result.data;

            vm.vat = vm.establishment.Vat;
            if(vm.establishment.OrganizationName && vm.establishment.OrganizationName.length > 0){
                vm.organizationName = vm.establishment.OrganizationName;    
            }else{
                vm.organizationName = 'Organização ' + vm.establishment.Name;
            }

            vm.primaryCae = vm.establishment.PrimaryCae;
            vm.secondaryCae = vm.establishment.SecondaryCae;

            vm.apaCode = {
                ApaCode: vm.establishment.ApaCode
            };
            vm.vatEstablishments = [vm.ApaCode];

            vm.establishmentName = vm.establishment.Name;

            if(vm.establishment.Address){
                vm.address = vm.establishment.Address.Street;
                vm.locale = vm.establishment.Address.Local;
                vm.postalCode = vm.establishment.Address.PostalCode;
                vm.city = vm.establishment.Address.City; 
            }
     
            vm.phone = vm.establishment.Phone;
            vm.mobile = vm.establishment.Mobile;
            vm.email = vm.establishment.Email;
            vm.fax = vm.establishment.Fax;
            vm.obs = vm.establishment.Obs;
            vm.externalId = vm.establishment.ExternalId;
            
            if(vm.establishment.ContactPersons){
                if(vm.establishment.ContactPersons.length >= 1){
                    vm.person1Name = vm.establishment.ContactPersons[0].Name;
                    vm.person1Mobile = vm.establishment.ContactPersons[0].Mobile;
                    vm.person1Email = vm.establishment.ContactPersons[0].Email;
                }
                if(vm.establishment.ContactPersons.length >= 2){
                    vm.person2Name = vm.establishment.ContactPersons[1].Name;
                    vm.person2Mobile = vm.establishment.ContactPersons[1].Mobile;
                    vm.person2Email = vm.establishment.ContactPersons[1].Email;
                }
            }

            //if is an exsitu establishment 
            if(vm.establishment.PickupPointExSituUniqueId || vm.establishment.ProduceExSituAnimalOrigin){
                vm.produceExSitu = true;
                vm.produceExSituAnimalOrigin = vm.establishment.ProduceExSituAnimalOrigin;
                
                if(vm.establishment.PickupPointExSituUniqueId){
                    vm.selectedPickupPointExSituUniqueId = vm.establishment.PickupPointExSituUniqueId;
                }
            }

            //if is an oua establishment 
            if(vm.establishment.PickupPointOuaUniqueId){
                vm.produceOua = true;
                vm.selectedPickupPointOuaUniqueId = vm.establishment.PickupPointOuaUniqueId;
            }

            vm.contractor = vm.establishment.IsContractor;
        }

        
        function getEstablishmentOnError(config, data, status, statusText){
            /* success (green), warning (orange), info (blue), error (red) */
            Notify.alert('<em class="fa fa-check"></em> Não foi possivel obter o estabelecimento cliente.', { status: 'warning'});
        }

        function updateEstablishmentOnSuccess(result){
            $state.go('app.establishmentOverview');
            Notify.alert('<em class="fa fa-check"></em> Estabelecimento actualizado!', { status: 'success' });
        }

        function updateEstablishmentOnError(error, status){
            vm.serverValidationErrors = utilsService.parseErrors(error.data._validationErrors);
            vm.serverValidationErrors = utilsService.parseErrors(error.data._applicationErrors);

            Notify.alert('<em class="fa fa-check"></em> Não foi possivel actualizar o estabelecimento cliente.', { status: 'danger' });
        } 

        function getUsersEstablishmentPermissionsOnSuccess(result){
            vm.usersEstablishmentPermissions = result.data;
            for(var i=0; i<result.data.length; i++){
                var user = result.data[i];
                vm.selectedPermissionType[user.UserId] = user.UserEstablishmentPermission.toString();
            }
        }

        function getUsersEstablishmentPermissionsOnError(error){
            //TODO
        }


        //SCOPE stuff
        $rootScope.$on('saveAccessSuccess', function (evnt, data) {
            vm.establishment.HasApaAccessConfigured = true;
        });

        $rootScope.$on('removeAccessSuccess', function (evnt, data) {
            vm.establishment.HasApaAccessConfigured = false;
        });
    }
})();
