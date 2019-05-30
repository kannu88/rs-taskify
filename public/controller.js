var mainApp =angular.module('mainApp',['ngRoute']);
    
mainApp.config(['$routeProvider',function($routeProvider){
    $routeProvider.
    when('/project',{
        templateUrl:'project.html',
        controller:'listController'
    })
    .when('/module',{
        templateUrl:'module.html',
        controller:'moduleController'
    })
    .when('/',{
        templateUrl:'project.html',
        controller:'listController'
        
    })
    .when('/task',{
        templateUrl:'task.html',
        controller:'taskController'
    })
    .when('/updateProject/:id',{
        templateUrl:'updateProject.html',
        controller:'listController'
    })
    .otherwise({
        redirectTo:'/'
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
    var config = {
        headers:{
            'authorization':localStorage.getItem('token')
        }
    }
    if($routeParams){
    var url1="http://localhost:3000/project/find/"+$routeParams.id;
$http.get(url1,config).then(function(response){
    
    if(response.data.success===true){
        $scope.data1 = response.data.doc;
        console.log($scope.data1);
    }
})}

    $scope.msg="this is list Controller";
    //update project Function
    $scope.editProject = function(){
var url = "http://localhost:3000/project/update/"+$routeParams.id;
var config = {
    headers:{
        'authorization':localStorage.getItem('token')
    }
}

$http.put(url,{userData:$scope.userData},config).then(function(response){
    console.log(response);
    if(response.data.success===true){
        window.alert("Project Updated Successfully");
        window.location.href='homePage.html';
    }
    else{
        window.alert("Project is not updated successfully");
    }
})

}
    //create Project Function
    $scope.createProject =   function(){
        
var url = "http://localhost:3000/project/insert";
  $scope.userData.status = "pending";
  
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
    
    window.alert("Project Added");
   window.location.href='homePage.html';
}
else{
    
    window.alert("Project Not Added");
}
})
}
//get data for table
    var url="http://localhost:3000/project/paging";
    var config = {
    headers:{
        'authorization':localStorage.getItem('token')
    }
}

$http.get(url,config).then(function(response){
    $scope.users= response.data.doc;
    console.log($scope.users);
})

 
})

mainApp.controller('moduleController',function($scope,$http){
    $scope.msg="this is the Module";
    var url="http://localhost:3000/module/find/5cd6804c33eaf51dbc1efc1d";
    var config = {
    headers:{
        'authorization':localStorage.getItem('token')
    }
}
$http.get(url,config).then(function(response){
    $scope.users = response.data.doc;
    console.log(response);
    
})

    
})
mainApp.controller('taskController',function($scope,$http){
    $scope.msg="This is task";
    console.log(localStorage.getItem('token'));
    var url="http://localhost:3000/task/paging";
    var config = {
    headers:{
        'authorization':localStorage.getItem('token')
    }
}
$http.get(url,config).then(function(response){
    $scope.users = response.data.doc;
    console.log(response);
})
//create Task
$scope.createTask =   function(){
    $scope.userData.status = "pending";
    $scope.userData.assigning="1234";
    $scope.userData.creator="jakj";
        
    var url = "http://localhost:3000/task/insert";
      $scope.userData.status = "pending";
      
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
        
        window.alert("Task Added");
       window.location.href='#task';
    }
    else{
        
        window.alert("Task Not Added");
    }
    })
    }

})
 mainApp.controller('profileController',function($scope,$http){


$scope.Logout = function()
{
    window.location.href="index.html";
    window.localStorage.clear();
}
})