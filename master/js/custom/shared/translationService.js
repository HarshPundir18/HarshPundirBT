(function(){
    'use strict';

    angular
        .module('custom')
        .service('translationService', translationService);

    translationService.$inject = ['$log', '$http', '$window'];
    function translationService ($log, $http, $window) {

		console.log("language " + $window.navigator.language);
		console.log("userLanguage " + $window.navigator.language.userLanguage);


		var _dataTableTranslations = function(){
			return {
				"decimal":        "",
				"emptyTable":     "Não existem registos",
				"info":           "_START_ a _END_ do total de _TOTAL_",
				"infoEmpty":      "",
				"infoFiltered":   "(filtered from _MAX_ total entries)",
				"infoPostFix":    "",
				"thousands":      ",",
				"lengthMenu":     "Show _MENU_ entries",
				"loadingRecords": "Loading...",
				"processing":     "A carregar registos...",
				"search":         "Pesquisa:",
				"zeroRecords":    "Não existem registos para a pesquisa",
				"paginate": {
					"first":      "Início",
					"last":       "Fim",
					"next":       "Prox.",
					"previous":   "Ant."
				},
				"aria": {
					"sortAscending":  ": activate to sort column ascending",
					"sortDescending": ": activate to sort column descending"
				}
			}
		}

		var translations = {
            'y': 'Sim',
            'n': 'Não',
            'EX_SITU': 'Ex Situ',
            'PRODUTOR_ESTABELECIMENTO': 'Produtor',
            'OLEOS_ALIMENTARES': 'Óleos alimentares',
            'OBRAS_RCD': 'RCD',
            'created': 'Criado',
            'running': 'Em progresso',
            'finished': 'Terminado',
            'finishederrors': 'Terminado c/ erros',
			'menu-dashboard': 'Dashboard',
			'menu-defaulEstablishment': 'Meu Estabelecimento',
            'menu-createDefaulEstablishment': 'Criar Meu Estabelecimento',
            'menu-clients': 'Clientes/Fornecedores',
			'menu-userEstablishments': 'Estabelecimento',
			'menu-egars': 'e-GARs',
			'menu-egars-new': 'Criar e-GAR',
			'menu-egars-list': 'Lista e-GARs',
			'menu-egars-import': 'Importar e-GAR',
			'menu-egars-sync': 'Sincronização',
			'menu-agenda': 'Agenda',
			'menu-agreements': 'Acordos',
			'menu-support': 'Suporte',
            'menu-mass-volumes': 'Volumes de massa',
            'menu-mass-volumes-2018': '2018',
            'menu-mass-volumes-2019': '2019',
			'menu-mass-volumes-2020': '2020',
			'menu-mass-volumes-2021': '2021',
			'menu-mass-volumes-2022': '2022',
			'menu-mass-volumes-2023': '2023',
			'menu-mass-volumes-2024': '2024',
			'menu-users': 'Utilizadores',
			'menu-settings': 'Configurações',
			'menu-super-admin': 'Super Admin',
			'menu-defaulEstablishments': 'Meus Estabelecimentos',
            'menu-reports': 'Relatórios',
            'menu-other-docs': 'Declarações de quantidades',
			'menu-other-docs-rcd-anexo3': 'Resíduos RCD (Anexo III)',
			'menu-other-docs-exsitu-quantities': 'Resíduos EX SITU',
			'menu-other-docs-general-quantities': 'Resíduos gerais',
            'menu-pickupPoints': 'Pontos de recolha',
            'menu-egar-archive': 'Arquivo e-Gars',
            'menu-egar-archive-2018': 'Arquivo e-Gar (2018)',
            'menu-egar-archive-2019': 'Arquivo e-Gar (2019)',
			'menu-egar-archive-2020': 'Arquivo e-Gar (2020)',
			'menu-egar-archive-2021': 'Arquivo e-Gar (2021)',
			'menu-egar-archive-2022': 'Arquivo e-Gar (2022)',
			'menu-egar-archive-2023': 'Arquivo e-Gar (2023)',
			'menu-egar-archive-2024': 'Arquivo e-Gar (2024)',
            'menu-product-codes': 'Etiquetas',
            'menu-product-new': 'Criar Etiqueta',
            'menu-product-list': 'Lista de Etiquetas',
            'menu-product-group-new': 'Criar Grupo de Etiquetas',
            'menu-product-group-list': 'Lista de Grupos de Etiquetas',
            'menu-service-areas': 'Áreas de Serviço',
            'menu-operation': 'Operação',
            'menu-import-pickupPoints': 'Importar Ponto de Recolha',
			'menu-egars-batch-acceptance': 'Aceitação em lote (destinatário)',
			'menu-egars-batch-accept-rectification': 'Aceitação em lote de rectificação (Produtor)',
			'menu-vehicles': 'Veículos',
			'menu-reportsHub': 'Central de Relatórios',
			'menu-equipments': 'Equipamentos',
			'menu-equipment-list': 'Lista de equipamentos',
			'menu-equipment-create': 'Criar equipamento',
			'menu-equipment-collection': 'Recolha de equipamentos',
			'menu-equipment-delivery': 'Entrega de equipamentos',
			'menu-equipment-map': 'Mapa de equipamentos',

			'invalid_apa_credentials': 'Acesso Inválido',
			'collapse_button': "Colapsar",
			"establishment_already_exists_as_client": "Estabelecimento existente como cliente",

			"contact_request_mobile_required": "Por favor indique-nos o seu contacto telefónico",
			"contact_request_name_required": "Por favor indique-nos o seu nome",
			"contact_request_email_required": "Por favor indique-nos o seu e-mail",

			"val_not_null": "Obrigatório",
			"val_not_empty": "Obrigatório",
			"val_invalid_email_format": "Formato inválido",
            "val_invalid_date_format": "Formato inválido",
            "val_invalid_int_format": "Formato inválido",
			"val_max_255": "Máximo 255 caracteres",
			"val_clientcode_unavailable": "Em utilização",
			"val_confirm_password_no_match": "A password de confirmação é diferente",
			"val_incorrect_password": "Password Inválida",
			"val_vatTransporter0_unkown": "Transportador não registado APA",
			"val_vatTransporter1_unkown": "Transportador não registado APA",
			"val_vatTransporter2_unkown": "Transportador não registado APA",
			"val_vatTransporter3_unkown": "Transportador não registado APA",
			"val_vatTransporter4_unkown": "Transportador não registado APA",
			"val_vatTransporter5_unkown": "Transportador não registado APA",
			"val_vatTransporter6_unkown": "Transportador não registado APA",
			"val_vatTransporter7_unkown": "Transportador não registado APA",
			"val_vatTransporter8_unkown": "Transportador não registado APA",
			"val_vatTransporter9_unkown": "Transportador não registado APA",
			"val_vatTransporter10_unkown": "Transportador não registado APA",
			"val_invalid_password_format": "Formato inválido. Devera ter entre 6 e 20 carcteres e conter apenas letras e números" ,
			"val_username_unavailable_for_client": "O Nome de Utilizador está a ser usado por outro utilizador",
			"val_email_unavailable_for_client": "O e-Mail está a ser usado por outro utilizador",
			"val_username_invalid_format": "Formato inválido. Devera ter entre 6 e 20 carcteres e conter apenas letras e números",
			"val_invalid_password_token": "Pedido inválido",
            "val_expired_recover_password_token": "O pedido de recuperação expirou a validade",
			"val_existent_product_group_code": "O código interno já existe no sistema!",
			'val_vehicle_associated_to_users': 'O veículo está associado a utilizador(es). <br> Por favor remova a associação no menu "Editar veículo" <i class="fa fa-pencil">',
			'val_must_have_at_least_three_chars': 'A pesquisa deve conter pelo menos 3 caracteres',
			'val_invalid_date_period_max_one_year': 'O período máximo de pesquisa é 1 ano',
			'val_at_least_one_period_defined': 'Por favor selecione "Data de Transporte" ou "Mês de fecho".',

			'ui_val_must_select_date_interval': 'Por favor selecione um intervalo de datas',
			'ui_val_must_be_between_one_year_limit': ' O período máximo é de um ano',
			'ui_val_must_be_same_civil_year': 'A pesquisa deve ser no mesmo ano civil',
			'ui_val_must_be_valid_period': 'O período selecionado é inválido',
			'ui_val_must_select_client': 'Por favor selecione um cliente/fornecedor',
			'ui_val_must_select_pickuppoint': 'Por favor selecione um ponto de recolha',
			'ui_val_must_select_date': 'Por favor selecione uma data',
			'ui_val_must_select_time': 'Por favor selecione uma hora',

			"demo_request": "Pedido de demonstração",
			"demo_request_description": "Indique-nos os seus dados e entraremos em contacto brevemente.",
			"contact_request": "Pedido de contacto",
			"contact_request_description": "Indique os seus dados e entraremos em contacto brevemente.",
			"contact_request_success": "Obrigado pelo seu contacto, seu pedido foi enviado com sucesso! <br> Entraremos em contacto consigo no prazo máxio de 24 horas",

            'page-header-massvolumes': 'Volumes de massa',

			'lbl-destin': 'Destinatário',
			'lbl-select-destin': 'Selectione destinatário',
			'lbl-tag': 'Etiqueta',
			'lbl-select-tag': 'Selectione etiqueta',
			"lbl-notifications": "Notificações",
			"lbl-newNotification": "Nova Notificação",
			"lbl-newNotifications": "Novas Notificações",
			"lbl-dashboard": "Painel de Controlo",
			"lbl-openEgars": "e-GARs Abertas",
			"lbl-totalEgars": "e-GARs Emitidas ",
			"lbl-lerCodes": "Códigos LER",
			"lbl-quantities": "Quantidade (Kg)",
			"lbl-lerCodeStockItemsChart": "Stock de resíduos",	
			"lbl-waitingAuthorizationEgars": "e-GARs Pendentes",
			"lbl-finishedEgars": "e-GARs Terminadas",
			"lbl-warehouseStockQuantity": "Resíduos em Armazem",
			"lbl-contractor": "Sub-contratado",
			'lbl-report-received-quantities-summary': 'Resumo Quantidades Recebidas - e-GARs Tipo 1 (Produtor)',
			'lbl-report-rcd-received-quantities-summary': 'Resumo Quantidades Recebidas - e-GARs Tipo 2 (RCD\'s)',
			'lbl-report-services-received-quantities-summary': 'Resumo Quantidades Recebidas - e-GARs Tipo 2 (Prestador de serviços)',
			'lbl-report-oua-received-quantities-summary': 'Resumo Quantidades Recebidas - e-GARs Tipo 2 (OAU\'s)',
			'lbl-report-exsitu-received-quantities-summary': 'Resumo Quantidades Recebidas - e-GARs Tipo 2 (EX SITU\'s)',
			'lbl-pickup-point': 'Ponto de recolha',
			'lbl-for-all-pickuppoints-of-vat': 'Para todos os pontos de recolha com o NIF',
			'lbl-for-all-pickuppoints-of-vat-no-vat-defined': 'O ponto de recolha não tem NIF definido',
			'lbl-single-pickuppoint': 'Apenas para o ponto de recolha',
			'lbl-import': 'Importar',

			"must-select-issuer": "Por favor serlecione o emissor",
            "forbiden_apa_access": "Acesso APA/SILIAMB inválido",
            "user_no_access_to_establishment": "Sem acesso ao Estabelecimento",
            "no_default_establishment_present": "Nenhum dos seus estabelecimento é interveniente na e-Gar! <br> Por favor selecione um estabelecimento válido",
            "no_valid_egar_issuer": "Nenhum dos seus estabelecimento é interveniente na e-Gar! <br> Por favor selecione um estabelecimento válido",
            'no_configured_apa_credentials': 'As credenciais de acesso APA são inválidas. <br> Por favor configure o acesso.',
            'no_valid_egar_issuer_for_user': 'O utilizador não tem permissão para emitir em nome do estabelecimento.',
            'user_cannot_create_egar_type': 'Não tem permissão para criar este tipo de e-GAR.',
			'user_report_being_generated_for_establishment': 'Um relatório para o estabelecimento selecionado está em geração, por favor aguarde a conclusão. <br>  Pode acompanhar a geração na área <br> <a ng-click="vm.sayHi()"><strong>Geração de Documentos</strong> <em class="mar-left10 fa fa-folder-open"></em></a>.',
			'account_report_being_generated_for_establishment': 'Um relatório da conta está a ser gerado, por favor aguarde a conclusão.',
			'user_no_required_permission': 'Sem permissão para realizar a operação.',
			'origin_must_be_account_establishment': 'O produtor selecionado deve ser um estabelecimento da conta.',
			'destin_must_be_account_establishment': 'O destinatário selecionado deve ser um estabelecimento da conta.',
			'not_authorized_operation': 'Operação não autorizada',

			'enum_Waiting': 'Em fila',
			'enum_FetchingRecords': 'Em geração',
			'enum_RecordsFetched': 'Em geração',
			'enum_FileCreated': 'Em geração',
			'enum_FinishedSuccess': 'Terminado',
			'enum_ExceptionFetchingRecords': 'Erro na geração',
			'enum_ExceptionCreatingFile': 'Erro na geração',
			'enum_ExceptionUploadingFile': 'Erro na geração',
		}

		var _dateTranslations = {
			'1': 'Janeiro',
			'2': 'Fevereiro',
			'3': 'Março',
			'4': 'Abril',
			'5': 'Maio',			
			'6': 'Junho',
			'7': 'Julho',
			'8': 'Agosto',
			'9': 'Setembro',
			'10': 'Outubro',
			'11': 'November',
			'12': 'Dezembro',
			'January': 'Janeiro',
			'February': 'Fevereiro',
			'March': 'Março',
			'April': 'Abril',
			'May': 'Maio',			
			'June': 'Junho',
			'July': 'Julho',
			'August': 'Agosto',
			'September': 'Setembro',
			'October': 'Outubro',
			'November': 'Novembro',
			'December': 'Dezembro',	
			'Monday': 'Segunda-Feira',
			'Tuesday': 'Terça-Feira',
			'Wednesday': 'Quarta-Feira',
			'Thursday': 'Quinta-Feira',
			'Friday': 'Sexta-Feira',
			'Saturday': 'Sabado',
			'Sunday': 'Domingo',
		}

		var _translate = function(key){
			// $http.get('/app/t/pt-pt.json')
			// .then(function(response) {
			// 	debugger
			// 	var t = response.data[key]
			// 	if(t){
			// 		return t;	
			// 	}
			// 	return key;
			// })
			// .catch(function(error){
			// 	debugger
			// 	return key;
			// });

			var t = translations[key]
			if(t){
			return t;
			}
			return key;
		}

		var _translateDateStuff = function(key){
			var t = _dateTranslations[key]
			if(t){
			return t;
			}
			return key;
		}

        var _translateBoolean = function(val){
            return val ? _translate('y') : _translate('n');
        }

		var _translateEnum = function(myEnum, value){
			for (var enumMember in myEnum) {
				if (myEnum[enumMember] == value) {
				   return _translate(`enum_${enumMember}`);
				}
			}
		};

		this.translateEnum = _translateEnum;
        this.translateBoolean = _translateBoolean;
		this.translate = _translate;
		this.dataTableTranslations = _dataTableTranslations;
		this.translateDateStuff = _translateDateStuff;
    }
})();
