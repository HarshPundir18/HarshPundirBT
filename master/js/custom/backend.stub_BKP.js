// 'use strict';

// (function(ng) {

//     // check if stubbedBackend session cookie is set or ?nobackend parameter exists in url
//     // if both false return and don't use stubbed backend
//     var isStubbedBackend = sessionStorage.getItem('stubbedBackend');

//     // if(!document.URL.match(/\?nobackend$/) && !isStubbedBackend) {
//     //     return;
//     // }

//     // if(!document.URL.match(/\?nobackend$/)) {
//     //       return;
//     // }

//     initializeStubbedBackend();

//     function getJsonFromFile(url) {
//         var request = new XMLHttpRequest();
//         request.open('GET', url, false);
//         request.send(null);
//         return [request.status, request.response, {}];
//     }

//     function initializeStubbedBackend() {
   
//         ng.module('custom')
//             .config(function($provide) {
//                 $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
//                 sessionStorage.setItem('stubbedBackend', true);
//             })
//             .run(function($httpBackend, $log) {

//                 var urlParameters = { 'offset' : false, 'limit' : false, 'urlParameters' : '' };

//                 // files (or api calls) that need to pass through
//                 // ----------------------------------------------
//                 $httpBackend.whenGET(/^i18n/).passThrough();
//                 $httpBackend.when('GET', /\.json/).passThrough();
//                 $httpBackend.when('GET', /\.html/).passThrough();


// /*
//                 $httpBackend.when('POST', /internal-api\/authorization\/bulk-reject/).passThrough();
//                 $httpBackend.when('POST', /internal-api\/authorization\/bulk-authorize/).passThrough();
// */

//                 // api calls that need to be mocked with datafixtures
//                 // --------------------------------------------------

//                 $httpBackend.when('GET', /api\/dummy\/get/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/10000_complex.json');
//                 });
                
//                 $httpBackend.when('GET', /api\/security\/GetVerticalMenus/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/mocks/gars.menu.sidebar.mock.js');
//                 });

//                 $httpBackend.when('GET', /api\/company\/getAll/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/10000_complex.json');
//                 });
// /*
//                 // internal-api/security
//                 $httpBackend.when('GET', /internal-api\/security/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/security.json');
//                 });

//                 //beforebooking mocks
//                 $httpBackend.when('GET',  /internal-api\/authorization\/overview\/before-booking\/count/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/beforeBookingFilterCounts.json');
//                 });
//                 $httpBackend.when('GET',  /internal-api\/authorization\/overview\/before-booking/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/beforeBookingAllList.json');
//                 });

//                 //afterbooking mocks
//                 $httpBackend.when('GET', /authorization\/overview-admin-company\?companyId=9916&filterBy=authoriser1/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/afterBookingAuthoriser1List.json');
//                 });

//                 $httpBackend.when('GET', /authorization\/overview-admin-company\?companyId=9916&filterBy=authoriser2/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/afterBookingAuthoriser2List.json');
//                 });

//                 $httpBackend.when('GET', /authorization\/overview-admin-company\?companyId=9916&filterBy=authoriser3/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/afterBookingAuthoriser3List.json');
//                 });

//                 $httpBackend.when('GET', /authorization\/overview-admin-company\?companyId=9916&filterBy=onhold/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/afterBookingOnHoldList.json');
//                 });

//                 $httpBackend.when('GET', /authorization\/overview-admin-company\?companyId/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/afterBookingAllList.json');
//                 });

//                 // internal-api/authoriseoverview
//                 $httpBackend.when('GET', /internal-api\/authorization\/overview-admin/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/authorisationOverview.json');
//                 });

//                 $httpBackend.when('GET', /authorization\/afterbooking\/count/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/afterBookingFilterCounts.json');
//                 });

//                 $httpBackend.when('GET', /internal-api\/authorization\/authorizers/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/afterBookingGetAuthorisers.json');
//                 });


//                 $httpBackend.when('POST', /internal-api\/authorization\/changeauthorizer/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/authorisationAfterBooking.changeauthoriser.json');
//                 });


//                 $httpBackend.when('GET', /internal-api\/authorization\/rejected/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/authorisationRejectBox.json');
//                 });

//                 // internal-api/transactionproposals
//                 $httpBackend.when('GET', /internal-api\/transactionproposals/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/transactionProposals.json');
//                 });

//                 $httpBackend.when('GET', /filterBy=onhold/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/toBeAuthorised.onhold.json');
//                 });

//                 // internal-api/tobeauthorised
//                 $httpBackend.when('GET', /internal-api\/authorization\/overview-authorizer/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/toBeAuthorised.json');
//                 });

//                 //mock get overview-count by state
//                 $httpBackend.when('GET', /internal-api\/authorization\/overview-admin\/count/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/authorisationAfterBookingFilterCounts.json');
//                 });

//                 $httpBackend.when('GET',  /internal-api\/authorization\/overview-admin\?filterBy=afterbooking/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/authorisationOverviewAfterBooking.json');
//                 });

//                 $httpBackend.when('GET',  /internal-api\/authorization\/overview-admin\?filterBy=beforebooking/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/authorisationOverviewBeforeBooking.json');
//                 });

//                 $httpBackend.when('GET',  /internal-api\/authorization\/overview-admin\?filterBy=onhold/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/authorisationOverviewOnhold.json');
//                 });


//                 // internal-api/companies/search
//                 $httpBackend.when('GET', /internal-api\/companies\/search/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/companyList.json');
//                 });

//                 //mock get overview-count by state
//                 $httpBackend.when('GET', /internal-api\/authorization\/rejectbox\/count/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/rejectBoxFilterCounts.json');
//                 });

//                 $httpBackend.when('GET',  /internal-api\/authorization\/rejectbox\?filterBy=CLOSED/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/authorisationRejectBox.closed.json');

//                 });

//                 $httpBackend.when('GET',  /internal-api\/authorization\/rejectbox\?filterBy=OPEN/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/authorisationRejectBox.open.json');
//                 });

//                 $httpBackend.when('GET',  /internal-api\/authorization\/rejectbox\?limit=20&offset=0/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/authorisationRejectBox1.json');
//                 });

//                 $httpBackend.when('GET',  /internal-api\/authorization\/rejectbox\?limit=20&offset=20/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/authorisationRejectBox2.json');
//                 });

//                 $httpBackend.when('GET',  /internal-api\/authorization\/rejectbox\?limit=20&offset=40/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/authorisationRejectBox3.json');
//                 });

//                 $httpBackend.when('GET',  /internal-api\/authorization\/rejectbox\?limit=20&offset=60/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/authorisationRejectBox4.json');
//                 });

//                 $httpBackend.when('GET',  /internal-api\/authorization\/rejectbox\?limit=20&offset=80/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/authorisationRejectBox5.json');
//                 });

//                 $httpBackend.when('POST',  /internal-api\/authorization\/rejectbox\/markasdone/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/authorisationRejectBox.markasdone.json');
//                 });

//                 $httpBackend.when('POST',  /internal-api\/authorization\/approvedbox\/markaspaid/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/authorisationRejectBox.markasdone.json');
//                 });

//                 $httpBackend.when('POST',  /internal-api\/authorization\/approvedbox\/markastobepaid/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/authorisationRejectBox.markasdone.json');
//                 });

//                 $httpBackend.when('POST',  /internal-api\/authorization\/approvedbox\/markasfinalised/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/authorisationRejectBox.markasdone.json');
//                 });

//                 function findOffsetLimitAndFilterBy(element){

//                     // push offset, limit and filterBy to urlParameters object
//                     if (element.indexOf('offset') !== -1 ) {
//                         urlParameters.offset = element.split('=')[1];
//                     }

//                     if (element.indexOf('limit') !== -1 ) {
//                         urlParameters.limit = element.split('=')[1];
//                     }

//                     if (element.indexOf('filterBy') !== -1 ) {
//                         urlParameters.filterBy = element.split('=')[1];
//                     }
//                 }

//                 //
//                 $httpBackend.when('GET',  /internal-api\/authorization\/approvedbox\?/).respond(function(method, url, data) {

//                     urlParameters.offset = 0;
//                     urlParameters.limit = 0;
//                     urlParameters.filterBy = '';

//                     var dataUrl = 'assets/data/paymentoverview/all.json';

//                     url = url.split('?')[1].split('&');

//                     // loop through array of url parameters and find offset and limit
//                     url.forEach(findOffsetLimitAndFilterBy);

//                     if( !!urlParameters && !!urlParameters.offset && !!urlParameters.limit) {

//                         var endSlice = ((urlParameters.offset + 1) * urlParameters.limit) - 1;

//                         if(urlParameters.filterBy.toLowerCase() === 'due') {
//                             dataUrl = 'assets/data/paymentoverview/due.json';
//                         }

//                         if(urlParameters.filterBy.toLowerCase() === 'paid') {
//                             dataUrl = 'assets/data/paymentoverview/paid.json';
//                         }

//                         data = getJsonFromFile(dataUrl);

//                         var dataOuter = JSON.parse(data[1]);
//                         var dataInner = dataOuter;

//                         dataInner = dataInner.documents.slice(0, endSlice);
//                         dataOuter.documents = dataInner;
//                         dataOuter.count = urlParameters.limit;

//                         data[1] = JSON.stringify(dataOuter);

//                         return data;
//                     }
//                 });

//                 $httpBackend.when('GET',  /internal-api\/authorization\/approvedbox\/count/).respond(function(method, url, data) {
//                     return getJsonFromFile('assets/data/paymentoverview/count.json');
//                 });

//                 $httpBackend.when('GET', /internal-api\/document\/(.*)\/comments/).respond(function(method, url, data) {
//                     $log.info('assets/data/documentViewerDocumentComments.json');
//                     return getJsonFromFile('assets/data/documentViewerDocumentComments.json');
//                 });

//                 $httpBackend.when('GET', /internal-api\/document\/(.*)\/visual/).respond(function(method, url, data) {
//                     $log.info('assets/data/document.jpg');
//                     return 'assets/data/document.jpg';
//                 });
// */

//             });
//     }
// })(angular);
