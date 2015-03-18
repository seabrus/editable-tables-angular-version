/*
 * Edi-Table
 * Angular-based version
 * v. 0.1.0
 */

var app = angular.module('ediTables73', []);

app.controller('TableController', [ 'DataService', '$rootScope', function( DataService, $rootScope ) {
    var self = this;

//===============================================
//    Operations with data
//===============================================
    self.rows = [];
    DataService.getData().then(
        function( rows ) { self.rows = rows; self.calcMaxPage(); },
        function( err ) { alert('Error in TableController when getting data'); }
    );

    self.savingResult = 'Nothing saved yet';
    self.savingClass = function() {
        var success = (self.savingResult === 'success');
        var error = (self.savingResult === 'error');
        return {
            savingSuccess: success,
            savingError: error
        }
    };
    self.saveData = function() {
        DataService.save().then(
            function() { self.savingResult = 'success'; },
            function() { self.savingResult = 'error'; }
        );
    };

    self.loadData = function() {                       // It's used for testing
        alert('Number of rows = ' + self.rows.length);
    };

//===============================================
//    Data view and presentation
//===============================================
    self.sortBy = '';
    self.rowsOnPage = 5;
    self.pageNumber = 1;

    self.maxPage = '1';
    self.calcMaxPage = function() {
        self.maxPage = '' + Math.ceil( self.rows.length / self.rowsOnPage );
        if ( self.maxPage === '0' )  self.maxPage = '1';
    };
    self.calcMaxPage();

    self.paginate = function( row, index ) {
        return  index > ( (self.pageNumber-1) * self.rowsOnPage - 1 );
    };

//===============================================
//    Enter & Tab keys processing
//===============================================
    self.checkKey = function( event, isReadonly ) {
        if ( isReadonly && event.which === 13 )   return false;
        if ( isReadonly )   return true;
        if ( event.which === 13 || event.which === 27 )   return true;
        
        return false;
    }

//===============================================
//     Add / Delete rows
//===============================================
    var newRowIDBase = 1424390400000;   // Date.UTC(2015,1,20);

    self.addRow = function( rowID ) {
        for ( var i=0, len=self.rows.length; i<len; i++ ) {
            if ( rowID === self.rows[ i ].id ) break;
        }
        if ( i < len  ||  rowID === null ) {
            var buf = { id : "", tdArray: [ {id:"id", text:"0"}, {id:"company", text:"name"}, {id:"region", text:"region"},{id:"start_date", text:"01-01-2015"}, {id:"responsible", text:"name"}, {id:"status", text:"new"} ] };

            var uniqueID = (new Date()).getTime() - newRowIDBase;
            buf.id = 'new-row-' + uniqueID;

            if ( rowID === null ) self.rows.push( buf );
            else   self.rows.splice( i+1, 0, buf );
        }
    }

    self.deleteRow = function( rowID ) {
        for ( var i=0, len=self.rows.length; i<len; i++ )
            if ( rowID === self.rows[ i ].id ) break;

        if ( i < len )
            self.rows.splice( i, 1 );
    }


}]);   // end of app.controller( 'TableController' )


//===============================================
//     Data Service
//===============================================
app.factory('DataService', [ '$http', function( $http ) {
    var rows = [
        { id : "RID002p", tdArray: [ {id:"id", text:"01"}, {id:"company", text:"Cosmos"}, {id:"region", text:"Canada"},{id:"start_date", text:"20-11-2015"}, {id:"responsible", text:"Camel H."}, {id:"status", text:"moved"} ] },
        { id : "RID001p", tdArray: [ {id:"id", text:"02"}, {id:"company", text:"Caravan"}, {id:"region", text:"Barbados"},{id:"start_date", text:"01-12-2015"}, {id:"responsible", text:"Dodo H."}, {id:"status", text:"accepted"} ] },
        { id : "RID029p", tdArray: [ {id:"id", text:"29"}, {id:"company", text:"Mira"}, {id:"region", text:"Togo"},{id:"start_date", text:"11-03-2015"}, {id:"responsible", text:"Smith T."}, {id:"status", text:"deleted"} ] },
    ];

    return   {
        getData: function() {
            return $http.get( 'db/rows.json' )
                .then( function(response) { rows = response.data; return rows; },
                       function(errResponse) { alert('Error when reading data from the server. Dummy data is displayed');  return rows; }
                );
        },

        save: function() {
            return $http.post( '/db', rows );
        },
    };

}]);
