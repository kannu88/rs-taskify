var mainApp =angular.module('mainApp',['ngRoute','ui.bootstrap','ngAnimate', 'ngSanitize','ngFileUpload']);

mainApp.config(['$routeProvider',function($routeProvider){
    $routeProvider
    .when('/dashboard',{
        templateUrl:'dashboard.html',
        controller:'dashboardController'
    })
    .when('/project/:pageNo',{
        templateUrl:'project.html',
        controller:'listController'
    })
    .when('/project/:pageNo/:search',{
        templateUrl:'project.html',
        controller:'listController'
    })
    .when('/module/:pageNo',{
        templateUrl:'module.html',
        controller:'moduleController'
    })
    .when('/module/:pageNo/:search',{
        templateUrl:'module.html',
        controller:'moduleController'
    })
   
    .when('/task/:pageNo',{
        templateUrl:'task.html',
        controller:'taskController'
    })
    .when('/task/:pageNo/:search',{
        templateUrl:'task.html',
        controller:'taskController'
    })
    .when('/mytask/:pageNo',{
        templateUrl:'mytask.html',
        controller:'myTaskController'
    })

    .when('/updateProject/:id',{
        templateUrl:'updateProject.html',
        controller:'listController'
    })
    .when('/updateModule/:id',{
        templateUrl: 'updateModule.html',
        controller:'moduleController'
    })
    .when('/updateTask/:id1',{
        templateUrl:'updateTask.html',
        controller:'taskController'
    })
    .when('/addTask',{
        templateUrl:'addTask.html',
        controller:'taskController'
    })
    .when('/addModule',{
        templateUrl:'addModule.html',
        controller:'moduleController'
    })
    .when('/client/:pageNo',{
        templateUrl:'client.html',
        controller:'clientController'
    })
    .when('/client/:pageNo/:search',{
        templateUrl:'client.html',
        controller:'clientController'
    })
    .when('/myteam/:pageNo',{
        templateUrl:'myteam.html',
        controller:'profileController'
    })
    .when('/myteam/:pageNo/:search',{
        templateUrl:'myteam.html',
        controller:'profileController'
    })
    .when('/addClient',{
        templateUrl:"addClient.html",
        controller:'clientController'
    })
   .when('/updateClient/:id1',{
       templateUrl:'updateClient.html',
       controller:'clientController'
   })
    .when('/updateProfile',{
        templateUrl:'updateProfile.html',
        controller:'profileController'
    })
    .when('/comment/:pageNo/:id3',{
        templateUrl:'comment.html',
        controller:'commentController'
    })
    .otherwise({
        redirectTo:'/dashboard'
    })
}])
//controller for popup
mainApp.controller('listControllerpopup',function($scope){
    var modal = document.getElementById("myModal");
   
    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");
    
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    
    // When the user clicks the button, open the modal 
    btn.onclick = function() {
    modal.style.display = "block";
    }
    
    
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
    modal.style.display = "none";
    }
    
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
    if (event.target == modal) {
    modal.style.display = "none";
    }
    }
})
mainApp.controller('listController',function($scope,$http,$routeParams){
    $scope.users={};
    $scope.data1={};
    $scope.length=0;
    $scope.goBack = function(){
        window.history.back();
      }
    $scope.status=["Pending","Completed","On Hold","Review"];
    var config = {
        headers:{
            'authorization':localStorage.getItem('token')
        }
    }
    //get clients
    var url="/client/paging?userId="+localStorage.getItem('id');
   

$http.get(url,config).then(function(response){
    $scope.client= response.data.doc;
    console.log($scope.client);
})
    if($routeParams){
    var url1="/project/find/"+$routeParams.id;
$http.get(url1,config).then(function(response){
    
    if(response.data.success===true){
        $scope.userData = response.data.doc;
        console.log($scope.userData);
    }
})}

    $scope.msg="this is list Controller";

    //update project Function
    $scope.editProject = function(){
       
var url = "/project/update/"+$routeParams.id;
var config = {
    headers:{
        'authorization':localStorage.getItem('token')
    }
}
$scope.userData.user = localStorage.getItem('id');
$http.put(url,{userData:$scope.userData},config).then(function(response){
    console.log(response);
    if(response.data.success===true){
        Swal.fire({
            position: 'center',
            type: 'success',
            title: 'Project has been updated Successfully',
            confirmButtonColor: '#3085d6',
            showConfirmButton: true,
          }).then((result) => {
            if (result.value) {
              window.location.href="homePage.html"
            }
          })
        
    }
    else{   
        if(response.data.message==="alreadyExist")
        {
            Swal.fire({
                position: 'center',
                type: 'error',
                title: 'Project Name Alredy Exist',
                confirmButtonColor: '#3085d6',
                showConfirmButton: true,
              })
        }
        else{
        Swal.fire({
            position: 'center',
            type: 'error',
            title: 'There is an error in updating project',
            confirmButtonColor: '#3085d6',
            showConfirmButton: true,
          })}
    }
})

}

    //create Project Function
    $scope.createProject =   function(){
        
var url = "/project/insert";
 
  
var config = {
    headers:{
        'authorization':localStorage.getItem('token')
    }
}

$scope.userData.user=(localStorage.getItem('id'));
$http.post(url,
{userData: $scope.userData},
   config
).then(function(response){
console.log(response);
console.log($scope.userData);


if(response.data.success===true)
{
    
    Swal.fire({
        position: 'center',
        type: 'success',
        title: 'Project has been Created Successfully',
        confirmButtonColor: '#3085d6',
        showConfirmButton: true,
      }).then((result) => {
        if (result.value) {
          window.location.href="#project/1"
        }
      })
}
else{
    if(response.data.message==="alreadyExist"){
        Swal.fire({
            position: 'center',
            type: 'error',
            title: 'Same name Project already exist',
            confirmButtonColor: '#3085d6',
            showConfirmButton: true,
          })
    }
    else{
    Swal.fire({
        position: 'center',
        type: 'error',
        title: 'There is an error in Adding project',
        confirmButtonColor: '#3085d6',
        showConfirmButton: true,
      })}
}
})
}
$scope.search = function(){
    window.location.href="#project/1/"+$scope.search1;
}
if($routeParams.search){
    var value = $routeParams.search;
    var url="/project/paging?search="+$routeParams.search;
    var config = {
    headers:{
        'authorization':localStorage.getItem('token')
    }
}
$scope.size;
$http.get(url,config).then(function(response){
    $scope.users = response.data.doc;
    console.log(response);
    $scope.size=$scope.users.length;
    $scope.totalItems = $scope.size;
    $scope.currentPage = 1;
    
    $scope.setPage = function (pageNo) {
      $scope.currentPage = pageNo;
    };
    
    $scope.pageChanged = function() {
      log.log('Page changed to: ' + $scope.currentPage);
     
    };
    $scope.pageChange = function(){
        window.location.href="#project/"+$scope.bigCurrentPage+"/"+value;
        
    }
    $scope.maxSize = 5;
    $scope.bigTotalItems = $scope.size;
    $scope.bigCurrentPage = $routeParams.pageNo;
    if($routeParams.pageNo){
    var url2 = "/project/paging?size=10&pageNo="+$routeParams.pageNo+"&search="+$routeParams.search;
    $http.get(url2,config).then(function(response1){
        $scope.data1 = response1.data.doc;
       
          
        console.log($scope.data1);
    })}
})   
}
//get data for table
else{
url="/project/paging?userId="+localStorage.getItem('id');
    
    var config = {
    headers:{
        'authorization':localStorage.getItem('token')
    }
}
$scope.size;
$http.get(url,config).then(function(response){
    $scope.users= response.data.doc;
    $scope.size = $scope.users.length;
    console.log($scope.size);
    $scope.totalItems = $scope.size;
$scope.currentPage = 1;

$scope.setPage = function (pageNo) {
  $scope.currentPage = pageNo;
};

$scope.pageChanged = function() {
  log.log('Page changed to: ' + $scope.currentPage);
 
};
$scope.pageChange = function(){
    window.location.href="#project/"+$scope.bigCurrentPage;
    
}
$scope.maxSize = 5;
$scope.bigTotalItems = $scope.size;
$scope.bigCurrentPage = $routeParams.pageNo;
if($routeParams.pageNo){
var url2 = "/project/paging?size=10&userId="+localStorage.getItem('id')+"&pageNo="+$routeParams.pageNo;
$http.get(url2,config).then(function(response1){
    $scope.data1 = response1.data.doc;
    console.log($scope.data1);
})}
})
}
})
//module Controller
mainApp.controller('moduleController',function($scope,$http,$routeParams){
    $scope.msg="this is the Module";
    $scope.goBack = function(){
		window.history.back();
	  }
    $scope.project={};
    var url="/project/paging?userId="+localStorage.getItem('id');
    var config = {
    headers:{
        'authorization':localStorage.getItem('token')
    }
}

$http.get(url,config).then(function(response){
    $scope.project= response.data.doc;
    console.log($scope.project);
})

$scope.data1={};
$scope.data2={};
if($routeParams){
var url1="/module/find/"+$routeParams.id;
$http.get(url1,config).then(function(response){

if(response.data.success===true){
    $scope.userData = response.data.doc;
    console.log($scope.userData);
}
})}
//module update
$scope.editModule = function(){
    var url = "/module/update/"+$routeParams.id;
    var config = {
        headers:{
            'authorization':localStorage.getItem('token')
        }
    }
    
    $http.put(url,{userData:$scope.userData},config).then(function(response){
        console.log(response);
        if(response.data.success===true){
            Swal.fire({
                position: 'center',
                type: 'success',
                title: 'Module has been updated Successfully',
                confirmButtonColor: '#3085d6',
                showConfirmButton: true,
              }).then((result) => {
                if (result.value) {
                  window.location.href="#module/1"
                }
              })
            
        }
        else{   
            if(response.data.message==="alreadyExist"){
                Swal.fire({
                    position: 'center',
                    type: 'error',
                    title: 'Module Name already Exist',
                    confirmButtonColor: '#3085d6',
                    showConfirmButton: true,
                  })
            }
            else{
            Swal.fire({
                position: 'center',
                type: 'error',
                title: 'There is an error in updating module',
                confirmButtonColor: '#3085d6',
                showConfirmButton: true,
              })
        }
    }
    })
    
    }
    $scope.search = function(){
        window.location.href="#module/1/"+$scope.search1;
    }
    if($routeParams.search){
        var value = $routeParams.search;
        var url="/module/paging?search="+$routeParams.search;
        var config = {
        headers:{
            'authorization':localStorage.getItem('token')
        }
    }
    $scope.size;
    $http.get(url,config).then(function(response){
        $scope.users = response.data.doc;
        console.log(response);
        $scope.size=$scope.users.length;
        $scope.totalItems = $scope.size;
        $scope.currentPage = 1;
        
        $scope.setPage = function (pageNo) {
          $scope.currentPage = pageNo;
        };
        
        $scope.pageChanged = function() {
          log.log('Page changed to: ' + $scope.currentPage);
         
        };
        $scope.pageChange = function(){
            window.location.href="#module/"+$scope.bigCurrentPage+"/"+value;
            
        }
        $scope.maxSize = 5;
        $scope.bigTotalItems = $scope.size;
        $scope.bigCurrentPage = $routeParams.pageNo;
        if($routeParams.pageNo){
        var url2 = "/module/paging?size=10&pageNo="+$routeParams.pageNo+"&search="+$routeParams.search;
        $http.get(url2,config).then(function(response1){
            $scope.data1 = response1.data.doc;
           
              
            console.log($scope.data1);
        })}
    })   
    }
    else{
    var url="/module/paging?userId="+localStorage.getItem('id');
    var config = {
    headers:{
        'authorization':localStorage.getItem('token')
    }
}
    $scope.size;
$http.get(url,config).then(function(response){
    $scope.users = response.data.doc;
    console.log($scope.users);
    $scope.size=$scope.users.length;
    $scope.totalItems = $scope.size;
    $scope.currentPage = 1;
    
    $scope.setPage = function (pageNo) {
      $scope.currentPage = pageNo;
    };
    
    $scope.pageChanged = function() {
      log.log('Page changed to: ' + $scope.currentPage);
     
    };
    $scope.pageChange = function(){
        window.location.href="#module/"+$scope.bigCurrentPage;
        
    }
    $scope.maxSize = 5;
    $scope.bigTotalItems = $scope.size;
    $scope.bigCurrentPage = $routeParams.pageNo;
    if($routeParams.pageNo){
    var url2 = "/module/paging?size=10&userId="+localStorage.getItem('id')+"&pageNo="+$routeParams.pageNo;
    $http.get(url2,config).then(function(response1){
        $scope.data1 = response1.data.doc;
        console.log($scope.data1);
    })}
})
    }
//Create Module
$scope.createModule =   function(){
   

    var url = "/module/insert";
      
      
    var config = {
        headers:{
            'authorization':localStorage.getItem('token')
        }
    }
    $scope.userData.user = localStorage.getItem('id');
    $http.post(url,
    {userData: $scope.userData},
       config
    ).then(function(response){
    console.log(response);
    console.log($scope.userData);
    
    
    if(response.data.success===true)
    {
        
        Swal.fire({
            position: 'center',
            type: 'success',
            title: 'Module has been Added Successfully',
            confirmButtonColor: '#3085d6',
            showConfirmButton: true,
          }).then((result) => {
            if (result.value) {
              window.location.href="#module/1"
            }
          })
      
    }
    else{   
        if(response.data.message==="alreadyExist"){
            Swal.fire({
                position: 'center',
                type: 'error',
                title: 'Module Name for Same Project Already Exist',
                confirmButtonColor: '#3085d6',
                showConfirmButton: true,
              })
        }
        else{
        Swal.fire({
            position: 'center',
            type: 'error',
            title: 'There is an error in Adding Module',
            confirmButtonColor: '#3085d6',
            showConfirmButton: true,
          })
    }}
    })
    }   
})

//task Controller
mainApp.controller('taskController',function($scope,$http,$routeParams){
    $scope.msg="This is task";
    $scope.project={};
    $scope.data2={};
    $scope.goBack = function(){
		window.history.back();
	  }
    $scope.priority="Medium";
    var url="/project/paging?userId="+localStorage.getItem('id');
    var config = {
    headers:{
        'authorization':localStorage.getItem('token')
    }
}

$http.get(url,config).then(function(response){
    $scope.project= response.data.doc;
    console.log($scope.project);
})
    $scope.priority=["Very High","High","Medium","Low"];
    $scope.status=["Pending","Completed","On Hold","Review"];
    var config = {
        headers:{
            'authorization':localStorage.getItem('token')
        }
    }
    if($routeParams){
        console.log($routeParams.id1)
        var url1="/task/find/"+$routeParams.id1;
        $http.get(url1,config).then(function(response){
        
        if(response.data.success===true){
            $scope.userData = response.data.doc;
            console.log($scope.userData);
        }
        })}
        //update task
        $scope.editTask = function(){
            var url = "/task/update/"+$routeParams.id1;
            var config = {
                headers:{
                    'authorization':localStorage.getItem('token')
                }
            }
           if($scope.userData.creator!=localStorage.getItem('id')&& $scope.userData.assigning!=localStorage.getItem('id')){
                console.log($scope.userData.assigning)
                Swal.fire({
                position: 'center',
                type: 'error',
                title: 'You are not authorized to update task',
                confirmButtonColor: '#3085d6',
                showConfirmButton: true,
              }).then((result) => {
                if (result.value) {
                  
                }
              })

           }
           else{
            $http.put(url,{userData:$scope.userData},config).then(function(response){
                console.log(response);
                if(response.data.success===true){
                    Swal.fire({
                        position: 'center',
                        type: 'success',
                        title: 'Task has been updated Successfully',
                        confirmButtonColor: '#3085d6',
                        showConfirmButton: true,
                      }).then((result) => {
                        if (result.value) {
                          window.location.href="#task/1"
                        }
                      })
                    
                }
                else{   
                    if(response.data.message==="alreadyExist"){
                        Swal.fire({
                            position: 'center',
                            type: 'error',
                            title: 'Task Name already Exist for the project ',
                            confirmButtonColor: '#3085d6',
                            showConfirmButton: true,
                          })
                }
                else{

                
                    Swal.fire({
                        position: 'center',
                        type: 'error',
                        title: 'There is an error in updating Task',
                        confirmButtonColor: '#3085d6',
                        showConfirmButton: true,
                      })
                }}
            })
        }
            }
    $scope.search = function(){
        window.location.href="#task/1/"+$scope.search1;
    }
    if($routeParams.search){
        var value = $routeParams.search;
        var url="/task/paging?search="+$routeParams.search;
        var config = {
        headers:{
            'authorization':localStorage.getItem('token')
        }
    }
    $scope.size;
    $http.get(url,config).then(function(response){
        $scope.users = response.data.doc;
        console.log(response);
        $scope.size=$scope.users.length;
        $scope.totalItems = $scope.size;
        $scope.currentPage = 1;
        
        $scope.setPage = function (pageNo) {
          $scope.currentPage = pageNo;
        };
        
        $scope.pageChanged = function() {
          log.log('Page changed to: ' + $scope.currentPage);
         
        };
        $scope.pageChange = function(){
            window.location.href="#task/"+$scope.bigCurrentPage+"/"+value;
            
        }
        $scope.maxSize = 5;
        $scope.bigTotalItems = $scope.size;
        $scope.bigCurrentPage = $routeParams.pageNo;
        if($routeParams.pageNo){
        var url2 = "/task/paging?size=10&pageNo="+$routeParams.pageNo+"&search="+$routeParams.search;
        $http.get(url2,config).then(function(response1){
            $scope.data2 = response1.data.doc;
           
              
            console.log($scope.data2);
        })}
    })   
    }
//get data for table
else{
    console.log(localStorage.getItem('token'));
    var url="/task/paging";
    var config = {
    headers:{
        'authorization':localStorage.getItem('token')
    }
}
$scope.size;
$http.get(url,config).then(function(response){
    $scope.users = response.data.doc;
    console.log(response);
    $scope.size=$scope.users.length;
    $scope.totalItems = $scope.size;
    $scope.currentPage = 1;
    
    $scope.setPage = function (pageNo) {
      $scope.currentPage = pageNo;
    };
    
    $scope.pageChanged = function() {
      log.log('Page changed to: ' + $scope.currentPage);
     
    };
    $scope.pageChange = function(){
        window.location.href="#task/"+$scope.bigCurrentPage;
        
    }
    $scope.maxSize = 5;
    $scope.bigTotalItems = $scope.size;
    $scope.bigCurrentPage = $routeParams.pageNo;
    if($routeParams.pageNo){
    var url2 = "/task/paging?size=10&pageNo="+$routeParams.pageNo;
    $http.get(url2,config).then(function(response1){
        $scope.data2 = response1.data.doc;
       
          
        console.log($scope.data2);
    })}
})
}
//finding users
var url3 = "/user/paging";
$http.get(url3,config).then(function(response){
    $scope.data3 = response.data.doc;
    console.log($scope.data3);
})
//create Task
$scope.createTask =   function(){

   
   
    $scope.userData.creator=localStorage.getItem('id');
    $scope.userData.user=localStorage.getItem('id');


    var url = "/task/insert";
      
      
    var config = {
        headers:{
            'authorization':localStorage.getItem('token')
        }
    }
    
    $http.post(url,
    {userData: $scope.userData},
       config
    ).then(function(response){
    console.log(response);
    console.log($scope.userData);
    
    
    if(response.data.success===true)
    {
        
        Swal.fire({
            position: 'center',
            type: 'success',
            title: 'Project has been updated Successfully',
            confirmButtonColor: '#3085d6',
            showConfirmButton: true,
          }).then((result) => {
            if (result.value) {
              window.location.href="#task/1"
            }
          })
       
    }
    else{
        if(response.data.message==="alreadyExist"){
            Swal.fire({
                position: 'center',
                type: 'error',
                title: 'Task Name Already exist for project',
                confirmButtonColor: '#3085d6',
                showConfirmButton: true,
              })
        }
        else{
        Swal.fire({
            position: 'center',
            type: 'error',
            title: 'There is an error in Adding Task',
            confirmButtonColor: '#3085d6',
            showConfirmButton: true,
          })
    }
    }})
    }
    
})
//my task controller
mainApp.controller('myTaskController',function($scope,$http,$routeParams){
    console.log("in the my task controller");
    console.log(localStorage.getItem('token'));
    var url="/task/paging?assigning="+localStorage.getItem('id');
    var config = {
    headers:{
        'authorization':localStorage.getItem('token')
    }
}
$scope.color={
    Pending:"warning",
    Completed:"success",
    Review:"danger",
}
$scope.size;
$http.get(url,config).then(function(response){
    $scope.users = response.data.doc;
    console.log(response);
    $scope.size=$scope.users.length;
    $scope.totalItems = $scope.size;
    $scope.currentPage = 1;
    
    $scope.setPage = function (pageNo) {
      $scope.currentPage = pageNo;
    };
    
    $scope.pageChanged = function() {
      log.log('Page changed to: ' + $scope.currentPage);
     
    };
    $scope.pageChange = function(){
        window.location.href="#mytask/"+$scope.bigCurrentPage;
        
    }
    $scope.maxSize = 5;
    $scope.bigTotalItems = $scope.size;
    $scope.bigCurrentPage = $routeParams.pageNo;
    if($routeParams.pageNo){
    var url2 = "/task/paging?size=10&pageNo="+$routeParams.pageNo+"&assigning="+localStorage.getItem('id');
    $http.get(url2,config).then(function(response1){
        $scope.data2 = response1.data.doc;
        console.log($scope.data2);
    })}
})
})
//profile Controller
 mainApp.controller('profileController',function($scope,$http,Upload,$routeParams){
    $scope.goBack = function(){
		window.history.back();
	  }
    var config = {
        headers:{
            'authorization':localStorage.getItem('token')
        }
    }
    $scope.users={};
    $scope.search = function(){
        window.location.href="#myteam/1/"+$scope.search1;
    }
    if($routeParams.search){
        var value = $routeParams.search;
        var url="/user/paging?search="+$routeParams.search;
        var config = {
        headers:{
            'authorization':localStorage.getItem('token')
        }
    }
    $scope.size;
    $http.get(url,config).then(function(response){
        $scope.users = response.data.doc;
        console.log(response);
        $scope.size=$scope.users.length;
        $scope.totalItems = $scope.size;
        $scope.currentPage = 1;
        
        $scope.setPage = function (pageNo) {
          $scope.currentPage = pageNo;
        };
        
        $scope.pageChanged = function() {
          log.log('Page changed to: ' + $scope.currentPage);
         
        };
        $scope.pageChange = function(){
            window.location.href="#myteam/"+$scope.bigCurrentPage+"/"+value;
            
        }
        $scope.maxSize = 5;
        $scope.bigTotalItems = $scope.size;
        $scope.bigCurrentPage = $routeParams.pageNo;
        if($routeParams.pageNo){
        var url2 = "/user/paging?size=10&pageNo="+$routeParams.pageNo+"&search="+$routeParams.search;
        $http.get(url2,config).then(function(response1){
            $scope.data2 = response1.data.doc;
           
              
            console.log($scope.data2);
        })}
    })   
    }
//data for the users list
else{
var url = "/user/paging";
    var config = {
    headers:{
        'authorization':localStorage.getItem('token')
    }
}
$scope.size;
$http.get(url,config).then(function(response){
    $scope.users = response.data.doc;
    console.log(response);
    $scope.size=$scope.users.length;
    $scope.totalItems = $scope.size;
    $scope.currentPage = 1;
    
    $scope.setPage = function (pageNo) {
      $scope.currentPage = pageNo;
    };
    
    $scope.pageChanged = function() {
      log.log('Page changed to: ' + $scope.currentPage);
     
    };
    $scope.pageChange = function(){
        window.location.href="#myteam/"+$scope.bigCurrentPage;
        
    }
    $scope.maxSize = 5;
    $scope.bigTotalItems = $scope.size;
    $scope.bigCurrentPage = $routeParams.pageNo;
    if($routeParams.pageNo){
    var url2 = "/user/paging?size=10&pageNo="+$routeParams.pageNo;
    $http.get(url2,config).then(function(response1){
        $scope.data2 = response1.data.doc;
        console.log($scope.data2);
    })}
})
}
var url="/user/find/"+localStorage.getItem('id');
$http.get(url,config).then(function(response){
    $scope.userData = response.data.doc;
    console.log($scope.userData);
})

    $scope.submit = function() {
        if ($scope.form.file.$valid && $scope.file) {
          $scope.upload($scope.file);
          window.location.href="#updateProfile";
        }
      };
   
      // upload on file select or drop
      $scope.upload = function (file) {
          Upload.upload({
              url: '/user/upload/'+localStorage.getItem('id'),
              data: {file: file}
          }).then(function (resp) {
              console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
          }, function (resp) {
              console.log('Error status: ' + resp.status);
          }, function (evt) {
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
          });
      }; 

$scope.Logout = function()
{
    window.location.href="login.html";
    window.localStorage.clear();
}

$scope.updateUser = function(){
    var url = "/user/update/"+localStorage.getItem('id');
            var config = {
                headers:{
                    'authorization':localStorage.getItem('token')
                }
            }
            
            $http.put(url,{userData:$scope.userData},config).then(function(response){
                console.log(response);
                if(response.data.success===true){
                    Swal.fire({
                        position: 'center',
                        type: 'success',
                        title: 'User has been updated Successfully',
                        confirmButtonColor: '#3085d6',
                        showConfirmButton: true,
                      }).then((result) => {
                        if (result.value) {
                          window.location.href="homePage.html"
                        }
                      })
                   
                }
                else{
                    Swal.fire({
                        position: 'center',
                        type: 'error',
                        title: 'There is an error in updating user',
                        confirmButtonColor: '#3085d6',
                        showConfirmButton: true,
                      })
                }
            })
            
}
});
mainApp.controller('clientController',function($scope,$http,$routeParams){
    $scope.msg="Client Controller";
    $scope.goBack = function(){
		window.history.back();
	  }
   //update Client
   var config = {
    headers:{
        'authorization':localStorage.getItem('token')
    }
}
if($routeParams){
    console.log($routeParams.id1)
    var url1="/client/find/"+$routeParams.id1;
    $http.get(url1,config).then(function(response){
    
    if(response.data.success===true){
        $scope.userData = response.data.doc;
        console.log($scope.userData);
    }
    })}
  
    $scope.editClient = function(){
        $scope.userData.user=(localStorage.getItem('id'));
        var url = "/client/update/"+$routeParams.id1;
        var config = {
            headers:{
                'authorization':localStorage.getItem('token')
            }
        }
        
        $http.put(url,{userData:$scope.userData},config).then(function(response){
            console.log(response);
            if(response.data.success===true){
                Swal.fire({
                    position: 'center',
                    type: 'success',
                    title: 'Client has been updated Successfully',
                    confirmButtonColor: '#3085d6',
                    showConfirmButton: true,
                  }).then((result) => {
                    if (result.value) {
                      window.location.href="#client/1"
                    }
                  })
                
            }
            else{   
                if(response.data.message==="alreadyExist"){
                    Swal.fire({
                        position: 'center',
                        type: 'error',
                        title: 'Client Email already Exist',
                        confirmButtonColor: '#3085d6',
                        showConfirmButton: true,
                      })
            }
            else{

            
                Swal.fire({
                    position: 'center',
                    type: 'error',
                    title: 'There is an error in updating Task',
                    confirmButtonColor: '#3085d6',
                    showConfirmButton: true,
                  })
            }}
        })
        
        }
    //create client 
    $scope.createClient =   function(){
        
        var url = "/client/insert";
         
          
        var config = {
            headers:{
                'authorization':localStorage.getItem('token')
            }
        }
        $scope.userData.user=(localStorage.getItem('id'));
        $http.post(url,
        {userData: $scope.userData},
           config
        ).then(function(response){
        console.log(response);
        console.log($scope.userData);
        
        
        if(response.data.success===true)
        {
            
            Swal.fire({
                position: 'center',
                type: 'success',
                title: 'Client has been Added Successfully',
                confirmButtonColor: '#3085d6',
                showConfirmButton: true,
              }).then((result) => {
                if (result.value) {
                  window.location.href="#client/1"
                }
              })
        }
        else{
            if(response.data.message="alreadyExist"){
                Swal.fire({
                    position: 'center',
                    type: 'error',
                    title: 'Client Email Already Exist',
                    confirmButtonColor: '#3085d6',
                    showConfirmButton: true,
                  })
            }

            else{
            Swal.fire({
                position: 'center',
                type: 'error',
                title: 'There is an error in Adding Client',
                confirmButtonColor: '#3085d6',
                showConfirmButton: true,
              })
        }}
        })
        }
        $scope.search = function(){
            window.location.href="#client/1/"+$scope.search1;
        }
        if($routeParams.search){
            var value = $routeParams.search;
            var url="/client/paging?search="+$routeParams.search+"&userId1="+localStorage.getItem('id');
            var config = {
            headers:{
                'authorization':localStorage.getItem('token')
            }
        }
        $scope.size;
        $http.get(url,config).then(function(response){
            $scope.users = response.data.doc;
            console.log(response);
            $scope.size=$scope.users.length;
            $scope.totalItems = $scope.size;
            $scope.currentPage = 1;
            
            $scope.setPage = function (pageNo) {
              $scope.currentPage = pageNo;
            };
            
            $scope.pageChanged = function() {
              log.log('Page changed to: ' + $scope.currentPage);
             
            };
            $scope.pageChange = function(){
                window.location.href="#client/"+$scope.bigCurrentPage+"/"+value;
                
            }
            $scope.maxSize = 5;
            $scope.bigTotalItems = $scope.size;
            $scope.bigCurrentPage = $routeParams.pageNo;
            if($routeParams.pageNo){
            var url2 = "/client/paging?size=10&pageNo="+$routeParams.pageNo+"&search="+$routeParams.search;
            $http.get(url2,config).then(function(response1){
                $scope.data2 = response1.data.doc;
               
                  
                console.log($scope.data2);
            })}
        })   
        }
//get table for client
else{
var url="/client/paging?userId="+localStorage.getItem('id');
var config = {
headers:{
    'authorization':localStorage.getItem('token')
}
}
$scope.size;
$http.get(url,config).then(function(response){
$scope.users = response.data.doc;
console.log(response);
$scope.size=$scope.users.length;
$scope.totalItems = $scope.size;
$scope.currentPage = 1;

$scope.setPage = function (pageNo) {
  $scope.currentPage = pageNo;
};

$scope.pageChanged = function() {
  log.log('Page changed to: ' + $scope.currentPage);
  
};
$scope.pageChange = function(){
    window.location.href="#client/"+$scope.bigCurrentPage;
    
}
$scope.maxSize = 5;
$scope.bigTotalItems = $scope.size;
$scope.bigCurrentPage = $routeParams.pageNo;
if($routeParams.pageNo){
var url2 = "/client/paging?size=10&userId="+localStorage.getItem('id')+"&pageNo="+$routeParams.pageNo;
$http.get(url2,config).then(function(response1){
    $scope.data2 = response1.data.doc;
    console.log($scope.data2);
})}
})
}
})
//comment controller
mainApp.controller('commentController',function($scope,$http,$routeParams){
    $scope.msg = "in comment controller";
    $scope.goBack = function(){
		window.history.back();
	  }
    var config = {
        headers:{
            'authorization':localStorage.getItem('token')
        }
    }
    $scope.user3={}
    console.log($scope.msg);
   //task details
   var url1="/task/find/"+$routeParams.id3;
    $http.get(url1,config).then(function(response){
    
    if(response.data.success===true){
        $scope.user3 = response.data.doc;
        console.log($scope.user3);
    }
    })
   
    $scope.addComment =   function(){
   

        var url = "/comment/insert";
          
          
        
        $scope.userData.user = localStorage.getItem('id');
        $scope.userData.task = $routeParams.id3;
        $http.post(url,
        {userData: $scope.userData},
           config
        ).then(function(response){
        console.log(response);
        console.log($scope.userData);
        
        
        if(response.data.success===true)
        {
            
            Swal.fire({
                position: 'center',
                type: 'success',
                title: 'Comment Added Successfully',
                confirmButtonColor: '#3085d6',
                showConfirmButton: true,
              }).then((result) => {
                if (result.value) {
                  window.location.href="#comment/1/"+$routeParams.id3
                }
              })
          
        }
        
            
            else{
            Swal.fire({
                position: 'center',
                type: 'error',
                title: 'There is an error in Adding Comment',
                confirmButtonColor: '#3085d6',
                showConfirmButton: true,
              })
        }
        })
        }

        //paging for comment
        url="/comment/paging?task="+$routeParams.id3;
    
    var config = {
    headers:{
        'authorization':localStorage.getItem('token')
    }
}
$scope.size;
$http.get(url,config).then(function(response){
    $scope.users= response.data.doc;
    $scope.size = $scope.users.length;
    console.log($scope.size);
    $scope.totalItems = $scope.size;
$scope.currentPage = 1;

$scope.setPage = function (pageNo) {
  $scope.currentPage = pageNo;
};

$scope.pageChanged = function() {
  log.log('Page changed to: ' + $scope.currentPage);
 
};
$scope.pageChange = function(){
    window.location.href="#comment/"+$scope.bigCurrentPage+"/"+$routeParams.id3;
    
}
$scope.maxSize = 5;
$scope.bigTotalItems = $scope.size;
$scope.bigCurrentPage = $routeParams.pageNo;
if($routeParams.pageNo){
var url2 = "/comment/paging?size=10&task="+$routeParams.id3+"&pageNo="+$routeParams.pageNo;
$http.get(url2,config).then(function(response1){
    $scope.data1 = response1.data.doc;
    console.log($scope.data1);
})}
})
})
mainApp.controller('dashboardController',function($scope,$http,$routeParams){
    $scope.msg="in Dashboard controller";
    if(localStorage.getItem('id')===null){
        window.location.href="login.html"
    }
    console.log($scope.msg);
    var config = {
        headers:{
            'authorization':localStorage.getItem('token')
        }
    }
    var url="/client/count?user="+localStorage.getItem('id');
    $http.get(url,config).then(function(response){
        $scope.clientCount = response.data.doc;
      
      
    })
    url="/project/paging?userId="+localStorage.getItem('id');
    $http.get(url,config).then(function(response){
        $scope.projectCount = response.data.doc.length;
    })
    url="/task/paging?assigning="+localStorage.getItem('id');
    $http.get(url,config).then(function(response){
        $scope.taskCount = response.data.doc.length;
    })
    url="/module/paging?userId="+localStorage.getItem('id');
    $http.get(url,config).then(function(response){
        $scope.moduleCount = response.data.doc.length;
    })
    //for my graph task
    url = "/task/count?assigning="+localStorage.getItem('id');
    $http.get(url,config).then(function(response){
        var task = response.data.doc; 
        var columns=[];
        var x={_id:"xxxx",count:0}
        var total=0;
        for(var i=0;i<4;i++)
        {   if(task[i]){
           columns.push(task[i])
        total += task[i].count}
           else{
               columns.push(x);
           }
            
        }
        $scope.taskpending=0;
        $scope.taskhold=0;
        $scope.taskcomplete=0;
        $scope.taskreview=0;
        for(i=0;i<4;i++){
            if(task[i]){
                if(task[i]._id==="Pending"){
                    $scope.taskpending=(task[i].count/total)*100;
                    $scope.taskpending=$scope.taskpending.toFixed(1);
                }
                if(task[i]._id==="On Hold"){
                    $scope.taskhold=(task[i].count/total)*100;
                    $scope.taskhold=$scope.taskhold.toFixed(1);
                }
                if(task[i]._id==="Completed"){
                    $scope.taskcomplete=(task[i].count/total)*100;
                    $scope.taskcomplete=$scope.taskcomplete.toFixed(1);
                }
                if(task[i]._id==="Review"){
                    $scope.taskreview=(task[i].count/total)*100;
                    $scope.taskreview=$scope.taskreview.toFixed(1);
                }
            }
        }
        console.log(columns)
        console.log(total);

        var chart = c3.generate({
            bindto: '#campaign',
            data: {
                columns: [
                    [columns[0]._id,columns[0].count],
                    [columns[1]._id,columns[1].count],
                    [columns[2]._id,columns[2].count],
                    [columns[3]._id,columns[3].count]
                ],
    
                type: 'donut',
                tooltip: {
                    show: true
                }
            },
            donut: {
                label: {
                    show: false
                },
                width: 15,
            },
    
            legend: {
                hide: true
            },
            color: {
                pattern: ['#137eff', '#8b5edd', '#5ac146', '#eceff1']
            }
        });
    })


    //for project graph
    url = "/project/count?userId="+localStorage.getItem('id');
    $http.get(url,config).then(function(response){
        var project = response.data.doc; 
        var columns=[];
        var x={_id:"xxxx",count:0}
        var total=0;
        for(var i=0;i<4;i++)
        {   if(project[i]){
           columns.push(project[i])
        total += project[i].count}
           else{
               columns.push(x);
           }
            
        }
        $scope.projectpending=0;
        $scope.projecthold=0;
        $scope.projectcomplete=0;
        $scope.projectreview=0;
        console.log(localStorage.getItem('id'));
        for(i=0;i<4;i++){
            if(project[i]){
                if(project[i]._id==="Pending"){
                    $scope.projectpending=(project[i].count/total)*100;
                    $scope.projectpending=$scope.projectpending.toFixed(1);
                }
                if(project[i]._id==="On Hold"){
                    $scope.projecthold=(project[i].count/total)*100;
                    $scope.projecthold=$scope.projecthold.toFixed(1);
                }
                if(project[i]._id==="Completed"){
                    $scope.projectcomplete=(project[i].count/total)*100;
                    $scope.projectcomplete=$scope.projectcomplete.toFixed(1);
                }
                if(project[i]._id==="Review"){
                    $scope.projectreview=(project[i].count/total)*100;
                    $scope.projectreview=$scope.projectreview.toFixed(1);
                }
            }
        }
        console.log(columns)
        console.log(total);

        var chart = c3.generate({
            bindto: '#project',
            data: {
                columns: [
                    [columns[0]._id,columns[0].count],
                    [columns[1]._id,columns[1].count],
                    [columns[2]._id,columns[2].count],
                    [columns[3]._id,columns[3].count]
                ],
    
                type: 'donut',
                tooltip: {
                    show: true
                }
            },
            donut: {
                label: {
                    show: false
                },
                width: 15,
            },
    
            legend: {
                hide: true
            },
            color: {
                pattern: ['#137eff', '#8b5edd', '#5ac146', '#eceff1']
            }
        });
    })

    //for task
    url = "/task/count1";
    $http.get(url,config).then(function(response){
        var task = response.data.doc; 
        var columns=[];
        var x={_id:"xxxx",count:0}
        var total=0;
        for(var i=0;i<4;i++)
        {   if(task[i]){
           columns.push(task[i])
        total += task[i].count}
           else{
               columns.push(x);
           }
            
        }
        $scope.pending=0;
        $scope.hold=0;
        $scope.complete=0;
        $scope.review=0;
        for(i=0;i<4;i++){
            if(task[i]){
                if(task[i]._id==="Pending"){
                    $scope.pending=(task[i].count/total)*100;
                    $scope.pending=$scope.pending.toFixed(1);
                }
                if(task[i]._id==="On Hold"){
                    $scope.hold=(task[i].count/total)*100;
                    $scope.hold=$scope.hold.toFixed(1);
                }
                if(task[i]._id==="Completed"){
                    $scope.complete=(task[i].count/total)*100;
                    $scope.complete=$scope.complete.toFixed(1);
                }
                if(task[i]._id==="Review"){
                    $scope.review=(task[i].count/total)*100;
                    $scope.review=$scope.review.toFixed(1);
                }
            }
        }
        console.log(columns)
        console.log(total);

        var chart = c3.generate({
            bindto: '#task',
            data: {
                columns: [
                    [columns[0]._id,columns[0].count],
                    [columns[1]._id,columns[1].count],
                    [columns[2]._id,columns[2].count],
                    [columns[3]._id,columns[3].count]
                ],
    
                type: 'donut',
                tooltip: {
                    
                    show: true
                }
            },
            donut: {
                label: {
                    show: false
                },
                width: 15,
            },
    
            legend: {
                hide: true
            },
            color: {
                pattern: ['#137eff', '#8b5edd', '#5ac146', '#eceff1']
            }
        });
    })

    //for getting recent comment
   url="/comment/recentcomment";
   $http.get(url,config).then(function(response){
       $scope.comment = response.data.doc;
       console.log($scope.comment);
   }) 

   url = "/task/recenttask?assigning="+localStorage.getItem('id');
   $http.get(url,config).then(function(response){
       $scope.recenttask = response.data.doc;
       console.log($scope.recenttask);
   })
})