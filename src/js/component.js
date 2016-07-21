(function(){
	 
	angular
		.module('app')
		.component('inputSearch', {
		 template: '<div class="input-group" ng-class="{focus:$ctrl.isforcus}">'
                    +'<input  class="form-control" ng-model="$ctrl.value" ng-focus="$ctrl.rev_status()" ng-blur="$ctrl.rev_status()" id="navbarInput-01" type="search" placeholder="Search">'
                    +'<span class="input-group-btn">'
                    +'<button class="btn" ng-click="$ctrl.search()"><span class="fui-search"></span></button>'
                    +'</span>'
                   +'</div>',
		  controller: InputSearchController,		  
		  bindings:{ 
		  	onSearch: '&',
		  }}); 
 
	 
	function InputSearchController() {
		var ctrl = this;
		 
		ctrl.isforcus =false;
		ctrl.rev_status=function  (arguments) {
			ctrl.isforcus =!ctrl.isforcus;
		} 
		

		ctrl.search=function() {
			ctrl.onSearch({key:ctrl.value});
			  
			console.log("searchCMPT key :"+ctrl.value);
		}

	} 
})();


 