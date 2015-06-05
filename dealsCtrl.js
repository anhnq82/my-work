(function (angular) {
    'use strict';

    var module = angular.module('tango-cp.deals');

    module.controller('dealsCtrl', ['$scope', '$rootScope', 'DealDetailModel', 'TerritoriesCollection',
        function ($scope, $rootScope, DealDetailModel, TerritoriesCollection) {
            //Quang Anh
            //QA-Init
            $scope.address = {
                add1:"Warner Music Group",
                add2:"C/O Nicholas Cicale",
                add3:"1633 Broadway",
                city:"New York",
                state:"New York",
                zipCode:"10019",
                country:"United States"
            };
            $scope.addressChange = $.extend(true,{},$scope.address);           
            $scope.showAddressChangeForm =false;
            $scope.showSaveEditAlert = false;
            
            //QA-Process
            $scope.editInfo = function () {
                $scope.editAddressForm.$setPristine();
                $scope.showAddressChangeForm = true;    
            };
            $scope.resetForm = function () {
                $scope.addressChange = {};    
            };
            $scope.saveEdit = function () {
                $scope.showAddressChangeForm = false;
                $scope.showAddressForm = true;
                $scope.showSaveEditAlert = true;
                $scope.address = $.extend(true,{},$scope.addressChange);
            };
            $scope.cancelEdit = function () {
                $scope.showAddressChangeForm = false;
                $scope.showAddressForm = true;
                $scope.addressChange = $.extend(true,{},$scope.address); 
            };
            //Quang Anh
            $scope.dealDetail = new DealDetailModel();

            $scope.contractTypes = {
                list: {
                    "W001": "Administration",
                    "W105": "Assignment",
                    "W240": "Audit / Settlement",
                    "W019": "Co-Publishing",
                    "W003": "Exclusive Songwriter",
                    "W282": "Joint Venture",
                    "MAST": "Master Rights",
                    "W193": "Merchandising",
                    "PMMS": "Production Music Miscellaneous Services",
                    "W030": "Purchase",
                    "W017": "Settlement",
                    "W002": "Sub-Publishing",
                    "W122": "Finder"
                }
            };

            $scope.getDealDetail = function (callback) {
                DealDetailModel.prototype.$resource.query({
                    clientId: '74a168d3-2359-4c2c-bbdc-0a7fecf55c06',
                    dealId: '7685401c-d27f-42a5-84b4-846df46a87fe'
                }).$promise.then(function (dealDetail) {
                    if (dealDetail.id) {
                        $scope.dealDetail.id = dealDetail.id || 'N/A';
                        $scope.dealDetail.briefNumber = dealDetail.brief_number || 'N/A';
                        $scope.dealDetail.contractingParties = dealDetail.contracting_parties || 'N/A';
                        $scope.dealDetail.rightsTermPeriod = dealDetail.rights_term_period || 'N/A';
                        $scope.dealDetail.contractStartDate = dealDetail.contract_start_date || 'N/A';
                        $scope.dealDetail.contractEndDate = dealDetail.contract_end_date || 'N/A';
                        $scope.dealDetail.contractExecutedDate = dealDetail.contract_executed_date || 'N/A';
                        $scope.dealDetail.adminTerritoryPopover;
                        // Get Contract Type Name
                        if (dealDetail.contract_types) {
                            $scope.getContractTypes(dealDetail.contract_types);
                        } else {
                            $scope.dealDetail.contractTypes = 'N/A';
                        }

                        // Get Signing Territory Name
                        if (dealDetail.signing_territory) {
                            TerritoriesCollection.prototype.$resource.query({
                                territoryIds: dealDetail.signing_territory
                            }).$promise.then(function (territories) {
                                _.forEach(territories, function (territory) {
                                    if (angular.isUndefined($scope.dealDetail.signingTerritory)) {
                                        $scope.dealDetail.signingTerritory = territory.name[0].translation;
                                    } else {
                                        $scope.dealDetail.signingTerritory += ', ' + territory.name[0].translation;
                                    };
                                });
                            });
                        } else {
                            $scope.dealDetail.signingTerritory = 'N/A';
                        };

                        //Get Territory Of Administration Display Name
                        TerritoriesCollection.prototype.$resource.query({
                            territoryIds: dealDetail.replacement_cluster_codes
                        }).$promise.then(function (territories) {
                            var i = 0;
                            _.forEach(territories, function (territory) {
                                if (i == 0) {
                                    $scope.dealDetail.territoryOfAdministration = territory.name[0].translation;
                                } else {
                                    $scope.dealDetail.territoryOfAdministration += ', ' + territory.name[0].translation;
                                };
                                i++
                            });

                            //Get Territory Of Administration Display Name with exclution
                            if (dealDetail.excluded_cluster_territory_codes) {
                                TerritoriesCollection.prototype.$resource.query({
                                    territoryIds: dealDetail.excluded_cluster_territory_codes
                                }).$promise.then(function (territories) {

                                    var txt, i = 0;
                                    _.forEach(territories, function (territory) {
                                        if (i == 0) {
                                            txt = territory.name[0].translation;
                                        } else {
                                            txt += ' ,' + territory.name[0].translation;
                                        };
                                        i++;
                                    });
                                    $scope.dealDetail.territoryOfAdministration += ' excluding ' + txt;
                                });
                            };
                        });




                        //Get Territory Of Administration Popover
                        angular.forEach(dealDetail.territory_of_administration, function (key, value) {
                            if (angular.isUndefined($scope.dealDetail.adminTerritoryPopover)) {
                                $scope.dealDetail.adminTerritoryPopover = value;
                            } else {
                                $scope.dealDetail.adminTerritoryPopover += ', ' + value;
                            };
                        });
                        TerritoriesCollection.prototype.$resource.query({
                            territoryIds: $scope.dealDetail.adminTerritoryPopover
                        }).$promise.then(function (territories) {
                            $scope.dealDetail.countryCount = territories.length;
                            $scope.dealDetail.adminTerritoryPopover = undefined;
                            _.forEach(territories, function (territory) {
                                if (angular.isUndefined($scope.dealDetail.adminTerritoryPopover)) {
                                    $scope.dealDetail.adminTerritoryPopover = territory.name[0].translation;
                                } else {
                                    $scope.dealDetail.adminTerritoryPopover += ', ' + territory.name[0].translation;
                                };
                            });
                        });
                    }
                })
            };

            $scope.getContractTypes = function (contractTypeCodes) {
                angular.forEach(contractTypeCodes, function (value) {
                    if (angular.isUndefined($scope.dealDetail.contractTypes)) {
                        $scope.dealDetail.contractTypes = $scope.contractTypes.list[value];
                    } else {
                        $scope.dealDetail.contractTypes += ', ' + $scope.contractTypes.list[value];
                    };
                });
            };
        }]);
})(window.angular);