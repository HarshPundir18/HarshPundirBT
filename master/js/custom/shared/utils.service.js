(function(){
    'use strict';

    angular
        .module('custom')
        .service('utilsService', utilsService);

    utilsService.$inject = ['$filter', 'translationService', 'Notify'];
    function utilsService ($filter, translationService, Notify) {

        var _numberOfItemsPerPage = function(){
            return [
                { key:10, value:"10"}, 
                { key:20, value:"20"},
                { key:30, value:"30"},
                { key:50, value:"50"}
            ]
                
        }

        var _yesAndNoItems = function(){
            return [
                { key:"", value:"--Selecione--"},
                { key:"true", value:"Sim"}, 
                { key:"false", value:"Não"},]
        }

		var _parseErrors = function(errorsArray){
			var resultArray = [];
			
			if(errorsArray){
                for (var i = 0; i < errorsArray.length; i++) { 
                    resultArray[errorsArray[i].Field] = translationService.translate(errorsArray[i].Message);
                }
            }

			return resultArray;
		}

        var _notifyInvalidFormValidation = function(){
            Notify.alert( 
                    '<em class="fa fa-exclamation-triangle "></em> Erros de validação <br> Por favor corrija o formulário.', 
                    { status: 'warning'}
                );
        }

        var _notifyForbiden = function(additionalMsg){
            var msg = 'Não permissão para efectuar esta operação.';

            if(additionalMsg){
                msg += '<br>' + additionalMsg;
            }

             Notify.alert( 
                    '<em class="fa fa-check"></em>' + msg, 
                    { status: 'danger'}
            );
        }

        var _notifySuccess = function(additionalMsg){
            var msg = '';

            if(additionalMsg){
                msg += additionalMsg;
            }

            Notify.alert( 
                    '<em class="mar-right10 fa fa-check"></em>' + msg, 
                    { status: 'success'}
                );
        }
        
        var _notifyWarning = function(additionalMsg){
            var msg = '';

            if(additionalMsg){
                msg += additionalMsg;
            }

            Notify.alert( 
                    '<em class="mar-right10 fa fa-exclamation-triangle"></em>' + msg, 
                    { status: 'warning'}
                );
        }

        var _notifyError = function(additionalMsg){
            _notifyExternalErrors(additionalMsg);
        }

        var _notifyExternalErrors = function(additionalMsg){
            var msg = '';

            if(additionalMsg){
                msg += additionalMsg;
            }

            Notify.alert( 
                    '<em class="mar-right10 fa fa-times"></em>' + msg, 
                    { status: 'danger'}
                );
        }

        var _parseAndNotifyExternalErrors = function(externalErrorsArrany){
            var notificationErrorMessage = '';
            for (var i = 0; i < externalErrorsArrany.length; i++) { 
                notificationErrorMessage += '<br>' + translationService.translate(externalErrorsArrany[i].Message);
            }

            _notifyExternalErrors(notificationErrorMessage);
        }

        var _parseAndNotifyApplicationErrors = function(applicationErrorsArrany){
            var msg = 'Existem Erros no pedido:';
            for(var i=0; i < applicationErrorsArrany.length; i++) {
				var item = applicationErrorsArrany[i];
				msg += '<br>' + translationService.translate(item.Message);
			}

            _notifyWarning(msg);
        }

        var _getSingleOrDefault = function(array, condition){
            var items = $filter('filter')(array, condition);
            if(items && items.length > 0){
                return items[0];
            }

            return null;
        }

        var _arrayToMatrix = function(array, columnNumber){
            var matrix = [], i, k;

            for (i = 0, k = -1; i < array.length; i++) {
                if (i % columnNumber === 0) {
                    k++;
                    matrix[k] = [];
                }

                matrix[k].push(array[i]);
            }

            return matrix;
        }

        var _formatDate = function(dateObj){
            if(dateObj instanceof Date){
                var month = dateObj.getUTCMonth() + 1; //months from 1-12
                month = ("0" + month).slice(-2);
                var day = dateObj.getUTCDate();
                day = ("0" + day).slice(-2);
                var year = dateObj.getUTCFullYear();
                return `${year}-${month}-${day}`;
            }
            
            return null;
        }

        var _formatDateServerParameter = function(dateObj){
            if(dateObj instanceof Date){
                var month = dateObj.getMonth() + 1; //months from 1-12
                month = ("0" + month).slice(-2);
                var day = dateObj.getDate();
                day = ("0" + day).slice(-2);
                var year = dateObj.getFullYear();
                return `${year}${month}${day}`;
            }
            
            return null;
        }

        var _buildSearchItemsParameter = function(searchItems){
            var filters = '';            
            if(searchItems){
                for(var i=0; i<searchItems.length; i++){
                    var item = searchItems[i];
                    if(item.value && item.value.trim().length > 0) {
                        filters += `&${item.key}=${item.value}`; 
                    }
                }
            } 
            return filters;
        }

        var _reduceArrayBy = function(xs, key) {
            return xs.reduce(function(rv, x) {
              (rv[x[key]] = rv[x[key]] || []).push(x);
              return rv;
            }, {});
          };

        var _groupBy = (array, f) => {
            let groups = {};
            array.forEach(function (o) {
              var group = JSON.stringify(f(o));
              groups[group] = groups[group] || [];
              groups[group].push(o);
            });

            return Object.keys(groups).map(function (group) {
                return groups[group];
            })
      }



        this.reduceArrayBy = _reduceArrayBy;
        this.groupBy = _groupBy;
        this.numberOfItemsPerPage = _numberOfItemsPerPage;
        this.buildSearchItemsParameter = _buildSearchItemsParameter;
        this.formatDateServerParameter = _formatDateServerParameter;
        this.formatDate = _formatDate;
		this.parseErrors = _parseErrors;
        this.yesAndNoItems = _yesAndNoItems;
        this.notifyInvalidFormValidation = _notifyInvalidFormValidation;
        this.notifyForbiden = _notifyForbiden;
        this.notifySuccess = _notifySuccess;
        this.notifyWarning = _notifyWarning;
        this.notifyError = _notifyError;
        this.notifyExternalErrors = _notifyExternalErrors;
        this.parseAndNotifyExternalErrors = _parseAndNotifyExternalErrors;
        this.parseAndNotifyApplicationErrors = _parseAndNotifyApplicationErrors;

        this.getSingleOrDefault = _getSingleOrDefault;
        this.arrayToMatrix = _arrayToMatrix;
        
    }
})();