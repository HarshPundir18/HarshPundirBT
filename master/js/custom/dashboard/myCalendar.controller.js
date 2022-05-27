(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('MyCalendarController', MyCalendarController);

        MyCalendarController.$inject = ['$scope', '$q', '$log', 'ChartData', '$timeout', '$compile',
                                    'oauthService', 'establishmentService', 'dummyService'];
    function MyCalendarController($scope, $q, $log, ChartData, $timeout, $compile,
                                    oauthService, establishmentService, dummyService) {
        var vm = this;
        console.log('MyCalendarController');

        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        console.log(`${y}-${m}-${d}`);
        
        $scope.changeTo = 'Hungarian';
        /* event source that pulls from google.com */
        $scope.eventSource = {
                url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
                className: 'gcal-event',           // an option!
                currentTimezone: 'America/Chicago' // an option!
        };

        /* event source that contains custom events on the scope */
        $scope.events = [
          {title: 'All Day Event',start: new Date(y, m, 1), allDay: true},
          {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
          {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
          {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
          {title: 'Birthday Party 19-20',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 20, 30),allDay: false},
          {title: 'My',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m+1, 10, 20, 30),allDay: false},          
          {title: 'Birthday Party',start: new Date(y, m, d + 1, 13, 0),end: new Date(y, m, d + 1, 13, 30),allDay: false},
          {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
        ];
        /* event source that calls a function on every view switch */
        $scope.eventsF = function (start, end, timezone, callback) {
          var s = new Date(start).getTime() / 1000;
          var e = new Date(end).getTime() / 1000;
          var m = new Date(start).getMonth();
          var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
          callback(events);
        };
    
        $scope.calEventsExt = {
           color: '#f00',
           textColor: 'yellow',
           events: [ 
              {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
              {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
              {type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
            ]
        };
        /* alert on eventClick */
        $scope.alertOnEventClick = function( date, jsEvent, view){
            //$scope.alertMessage = (date.title + ' was clicked ');
            console.log(date.title + ' was clicked ');
        };
        /* alert on Drop */
         $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
           $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
        };
        /* alert on Resize */
        $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
           $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
        };
        /* add and removes an event source of choice */
        $scope.addRemoveEventSource = function(sources,source) {
          var canAdd = 0;
          angular.forEach(sources,function(value, key){
            if(sources[key] === source){
              sources.splice(key,1);
              canAdd = 1;
            }
          });
          if(canAdd === 0){
            sources.push(source);
          }
        };
        /* add custom event*/
        $scope.addEvent = function() {
          $scope.events.push({
            title: 'Open Sesame',
            start: new Date(y, m, 28),
            end: new Date(y, m+1, 10),
            className: ['openSesame']
          });
        };
        /* remove event */
        $scope.remove = function(index) {
          $scope.events.splice(index,1);
        };
        /* Change View */
        $scope.changeView = function(view,calendar) {
          uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
        };
        /* Change View */
        $scope.renderCalender = function(calendar) {
          //debugger
          if(uiCalendarConfig.calendars[calendar]){
            uiCalendarConfig.calendars[calendar].fullCalendar('render');
          }
        };
         /* Render Tooltip */
        $scope.eventRender = function( event, element, view ) { 
            console.log('eventRender');
            element.attr({'title': event.title });
            element.find('.fc-content').addClass('vertical-border-green'); //.attr({'class': 'vertical-border-green'});
            element.find('.fc-content').append($scope.formatWeekEvent(event));

            

            $compile(element)($scope);
        };

        $scope.formatWeekEvent = function (event) {
            return '<a whole bunch of html to render the button>' +
            '<a ng-click="editActivityModal(event, $event)">Edit</a>' +
            '<a ng-click="deleteActivityModal(event, $event)">Delete</a>'
        };

        /* config object */
        $scope.uiConfig = {
          calendar:{
            //height: "70%",
            height: 850,
            editable: true,
            eventStartEditable: true,
            eventDurationEditable: true,
            eventResizableFromStart: true,
            eventResourceEditable: true,
            displayEventTime : true,
            locale: 'pt-br',
            header: {
                left: 'myCustomButton month,agendaWeek,agendaDay',
                center: 'title',
                right: 'today list,prev,next'
            },
            customButtons: {
                myCustomButton: {
                  text: 'custom!',
                  click: function() {
                    alert('clicked the custom button!');
                  }
                }
              },
            allDayText: 'todooo',
            buttonText: {
                today:    'Hoje',
                month:    'mes',
                week:     'semana',
                day:      'dia',
                list:     'listaaa',
            },
            dayClick: function( date, allDay, jsEvent, view ) {
                console.log('dayClick: test ok ');
            },
            eventClick: function (event) {
                var d = event.start._d.getDate();
                var m = event.start._d.getMonth();
                var y = event.start._d.getFullYear();
                console.log(`${y}-${m}-${d}`);
                console.log(event.start._d)
                console.log(event);
            },
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize,
            eventRender: $scope.eventRender,

            dayRender: function( dayRenderInfo ) { 
                
            },
            // eventTimeFormat: { // like '14:30:00'
            //     hour: '2-digit',
            //     minute: '2-digit',
            //     second: '2-digit',
            //     hour12: false
            // },
            eventBorderColor: "#000",
            eventBackgroundColor: "#fff",
            eventTextColor: 'red'
          }
        };
    
        $scope.changeLang = function() {
          if($scope.changeTo === 'Hungarian'){
            $scope.uiConfig.calendar.dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
            $scope.uiConfig.calendar.dayNamesShort = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
            $scope.uiConfig.calendar.monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
            $scope.changeTo= 'English';
          } else {
            $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            $scope.changeTo = 'Hungarian';
          }
        };
        /* event sources array*/
        $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
        $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
    }
})();