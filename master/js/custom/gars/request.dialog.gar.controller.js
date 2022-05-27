(function() {
    'use strict';

    angular
        .module('custom')
        .controller('garRequestDialogController', garRequestDialogController);

    garRequestDialogController.$inject = ['$rootScope', '$filter', '$q', 'ngDialog', 'uploaderService',
                                     'garsService', 'spinnerService', 'translationService', 'utilsService', 'gar', 'type'];
    function garRequestDialogController($rootScope, $filter, $q, ngDialog, uploaderService, 
                                    garsService, spinnerService, translationService, utilsService, gar, type) {

        //VM  public stuff
        var vm = this;

        const loadigGifSelector = '.ngdialog-message';

        vm.serverValidationErrors = [];
        vm.serverApplicationErrors = [];
		vm.gar = gar;
		vm.type = type;
        vm.contactArray = null;
        vm.revokeObs = null;
        vm.isAuthorizationRequest = true;

		vm.selectedContactChange = function(){	
			if(vm.selectedContact){
				var item = $filter('filter')(vm.contactArray, { key: vm.selectedContact })[0];
				if(item){
					vm.email = item.key;
					vm.name = item.name;
				}
			}
		}

		vm.nameEmailChange = function(){
			vm.selectedContact = null;
		}

		vm.validateInput = function(name, type) {
			if(vm.selectedContactAll == true){
				return false;
			}
            var input = vm.formValidate[name];
            var errorType = input.$error[type];
            return (input.$dirty || vm.submitted) && errorType;
        };


		vm.submitted = false;

        vm.submitForm = function() {
            vm.serverValidationErrors = [];
            vm.submitted = true;
            if (vm.formValidate.$valid || vm.selectedContactAll == true) {
                spinnerService.show(loadigGifSelector);
                
                var data = getFormData();			
                //check if has file to upload
                var file = getFileToUpload();
                if(file){

                    if(isValidFile(file)){
                        //upload and get fileId
                        file.upload();
                    }else{
                        vm.submitted = false;
                        return;
                    }
                }else{
                    
                    garsService
                    	.sendRequest(vm.gar.UniqueId, data)
                    	.then(sendRequestOnSuccess)
                    	.catch(sendRequestOnError)
                    	.finally(()=>{
                            spinnerService.hide(loadigGifSelector);
                        });
                }
            }
        };

        vm.submitRevokeForm = function() {
            vm.serverValidationErrors = [];
            vm.submitted = true;
            if (vm.formValidate.$valid || vm.selectedContactAll == true) {
                spinnerService.show(loadigGifSelector);
                var data = {};
                data.GarId = vm.gar.UniqueId;
                data.Obs = vm.revokeObs;

                garsService
					.revokeEGar(data)
					.then(revokeEGarOnSuccess)
					.catch(revokeEGarOnError)
					.finally(function(){
						spinnerService.hide(loadigGifSelector);
					});
            }
        }

        //
		activate();
		setActionTitleAndDescription()

        //PRIVATES
        function activate(){
            //get eGar contacts
			garsService
				.getEGarContacts(vm.gar.UniqueId, vm.type)
				.then(getEGarContactsOnSuccess)
                .catch(getEGarContactsOnError);

            //configure uploader
            var uploader = vm.uploader = uploaderService.configure();
            uploader.onBeforeUploadItem = function(item) {
                spinnerService.show(loadigGifSelector);
            };
            uploader.onCompleteItem = function(fileItem, response, status, headers) {
                if(fileItem.isSuccess){
                    var data = getFormData();
                    data.FileGuid = response;

                    spinnerService.show('#requestDialog');
                    garsService
                    	.sendRequest(vm.gar.UniqueId, data)
                    	.then(sendRequestOnSuccess)
                    	.catch(sendRequestOnError);
                }else{
                    utilsService.notifyWarning('Não foi possível anexar o ficheiro. <br> Por favor tente novamente.');
                }
                spinnerService.hide(loadigGifSelector);
                ngDialog.close();
          };
        }

        function getFormData(){
            var data = {};
            data.Name = vm.selectedContactAll ? 'All' : vm.name;
            data.Email = vm.selectedContactAll ? 'All' : vm.email;
            data.Type = vm.type;

            return data;
        }

		function setActionTitleAndDescription(){
			switch(vm.type){
				case 'REQUEST_AUTHORIZATION':
					vm.actionTitle = 'Pedir autorização de emissão';
					vm.actionDescription = 'requerendo autorização da emissão';
					break;
				case 'REQUEST_ACCEPTANCE':
					vm.actionTitle = 'Pedir aceitação de emissão';
					vm.actionDescription = 'requerendo aceitação da emissão';
					break;
				case 'REQUEST_RECTIFICATION_ACCEPTANCE':
					vm.actionTitle = 'Pedir aceitação de correção';
					vm.actionDescription = 'requerendo aceitação da correção';
                    break;
                case 'CAN_SEND_PROOF_EGAR':
                    vm.isAuthorizationRequest = false;
                    vm.isSendProofEgar = true;
					vm.actionTitle = 'Enviar comprovativo de emissão';
					vm.actionDescription = 'comprovativo de emissão';
					break;
				default:
					vm.actionTitle = '';
					vm.actionDescription = '';
					break;
			}
		}

        function getFileToUpload(){
            if(vm.uploader.queue && vm.uploader.queue.length > 0){
                return vm.uploader.queue[0];
            }

            return null;
        }

        function isValidFile(item){
            var allowedExtensions = ['png', 'PNG', 'jpeg', 'JPEG', 'jpg', 'JPG', 'pdf', 'PDF'];

            var fileSizeMb = $filter('number')(item.file.size/1024/1024, 2);
            var fileNameSplited = item.file.name.split('.');

            if(fileNameSplited.length < 2){
                vm.invalidFile = "Extensão do ficheiro inválida. Extensões permitidas: png, jpeg, jpg, pdf" ;
                return false;
            }

            var fileExtension = fileNameSplited[fileNameSplited.length-1];
            var isAllowedExtension = (allowedExtensions.indexOf(fileExtension) > -1);
            if(!isAllowedExtension) {
                vm.invalidFile = "Extensão do ficheiro inválida. Extensões permitidas: png, jpeg, jpg, pdf" ;
                return false;
            }

            vm.invalidFile = '';
            if(fileSizeMb > 3){
                vm.invalidFile = "Tamanho máximo permitido é de 3 MB (tamanho do ficheiro: " + fileSizeMb + "MB)"
                return false;
            }

            return true;
        }

        //CALLBAKCS
        function revokeEGarOnSuccess(result){
            $rootScope.$broadcast('reloadTableEGars', {msg: 'yeah'});
            utilsService.notifySuccess('e-Gar anulada com sucesso!');
            ngDialog.close({
                action: 'revokeEGarOnSuccess'
            });
        } 

        function revokeEGarOnError(error){
            if(!error.data._validationErrors || error.data._validationErrors.length === 0 || 
                !error.data._applicationErrors || error.data._applicationErrors.length === 0){
                    
                utilsService.notifyExternalErrors('A e-Gar está num estado em que não é possível anulação');
            }
            else{
                vm.serverValidationErrors = utilsService.parseErrors(error.data._validationErrors);
			    vm.serverApplicationErrors = utilsService.parseErrors(error.data._applicationErrors);    
            }
            ngDialog.close({
                action: 'revokeEGarOnError'
            });
        } 

		function getEGarContactsOnSuccess(result){
			if(result.data && result.data.length > 0){
				vm.contactArray = [{ key: null, value: '--Selecione opção--' }];
				//default
				angular.forEach(result.data, function(item){
					vm.contactArray.push({ 
						key: item.Email, 
						name: item.Name,
						value: item.Email + ' (' + item.Name + ')' 
					});
				});
			}
		}

		function getEGarContactsOnError(error){
			//alert('getOriginContactsOnError')
		}

		function sendRequestOnSuccess(result){
			utilsService.notifySuccess('Pedido Enviado com sucesso!')
            ngDialog.close({
                action: 'sendRequestOnSuccess'
            });
		}

		function sendRequestOnError(error){
			vm.serverValidationErrors = utilsService.parseErrors(error.data._validationErrors);
			vm.serverApplicationErrors = utilsService.parseErrors(error.data._applicationErrors);
		}
        //SCOPE stuff
    }
})();