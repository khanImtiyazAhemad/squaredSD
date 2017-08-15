angular.module("avaanaController")
.controller("registerCtrl",function($scope,$window,authService,$state,$http,$uibModal,$timeout,apiService){


  $scope.register={};
  $scope.register.alreadylogin=function(){
    $state.go('app.login')
   }

 
 // var emailRegex=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
var emailRegex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})$/
var phoneRegex=/^(\+\d{1,3}[- ]?)?\d{10}$/
var nameRegex=/^[a-zA-Z ]{2,32}$/


//*********************Form VAlidation Start *************************//

  $scope.register.firstNameValidation=function(){
     if($scope.register.first_name=="" || $scope.register.first_name==undefined || $scope.register.first_name==null){
              $scope.register.firstnameErr = "Please enter your first name.";
            } else if(!nameRegex.test($scope.register.first_name))
               $scope.register.firstnameErr="Please enter a valid first name.  A name should not contain special characters or numbers and is between 2-32 characters."
            else{
              $scope.register.firstnameErr =null;
            }

  }
  $scope.register.lastNameValidation=function(){
     if($scope.register.last_name=="" || $scope.register.last_name==undefined || $scope.register.last_name==null){
              $scope.register.lastnameErr = "Please enter your last name.";
            } else if(!nameRegex.test($scope.register.last_name))
               $scope.register.lastnameErr="Please enter a valid last name.  A name should not contain special characters or numbers and is between 2-32 characters."
            else{
              $scope.register.lastnameErr =null;
          }

  }

  $scope.register.emailValidation=function(){
    
     if($scope.register.email=="" || $scope.register.email==undefined || $scope.register.email==null){
              $scope.register.emailErr = "Please enter your email address.";
            } else if(!emailRegex.test($scope.register.email)){
               $scope.register.emailErr="Please enter a valid email address.";
             }else if($scope.register.email.length>150){
              $scope.register.emailErr="Please enter a shorter email, if one is available.  If not, please email hello@avaana.com.au for assistance.";
            }
            else{
              $scope.register.emailErr =null;
          }

  }
   $scope.register.passwordValidation=function(){
   
       if($scope.register.password=="" || $scope.register.password==undefined || $scope.register.password==null){
          $scope.register.passwordErr = "Please enter a password.";
        }else if($scope.register.password.length>50 || $scope.register.password.length<7 ){
          $scope.register.passwordErr = "Please enter a password between 8 and 24 characters.";
        }
        else{
          $scope.register.passwordErr =null;
        }
     
     }
       $scope.register.phoneValidation=function(){
       if($scope.register.phone=="" || $scope.register.phone==undefined || $scope.register.phone==null){
          $scope.register.phoneErr = "Please enter a mobile number.";
         }      
        else if(!phoneRegex.test($scope.register.phone)){
            $scope.register.phoneErr = "Please use numbers only; no dashes or spaces.";
          }
        else{
          $scope.register.phoneErr =null;
        }
     
     }

 //**Validate button Listener ********


   $scope.register.signup = function(){
        $scope.register.firstNameValidation()
        $scope.register.lastNameValidation()
        $scope.register.emailValidation()
        $scope.register.passwordValidation()
        $scope.register.phoneValidation()
              
        if($scope.register.emailErr==null && $scope.register.passwordErr==null && $scope.register.firstnameErr ==null && $scope.register.lastnameErr ==null &&$scope.register.phoneErr ==null){

        data={
            first_name:$scope.register.first_name,
            last_name:$scope.register.last_name,
            email:$scope.register.email,
            password:$scope.register.password,
            phone_no:$scope.register.phone,
            provider:localStorage.loginType,
            u_id:$scope.register.u_id,
            avatar:$scope.myImage,
            is_customer:true,
            is_owner:false,
            is_practitioner:false,
            is_active:true
          }
          apiService.getData('a_signup/', data, 'post').then(function(success){
          if(success.data.status==200){
              localStorage.userId = success.data.User_Detail.id;
              //alert("userId: "+localStorage.userId)
              localStorage.auth_token = success.data.auth_token;
              localStorage.UserObject=JSON.stringify(success.data.User_Detail);
              $scope.$emit("loggedIn");
              $state.go("app.home");  
            $scope.register.emailErr=null;
          }else if(success.data.status==500){
            error_key=Object.keys(success.data.Message);
            if(error_key[0]==='email'){
              $scope.register.emailErr="Email address already exists.  Did you mean to log in instead?";
            }else if(error_key[0]==='password'){
              $scope.register.passwordErr="Password is too short.";
            }else{
              $scope.register.phoneErr=success.data.Error;
            }
          }
            
          },function(error){
          });
          }
        }

   if(localStorage.loginType == "google"){
     authService.getGoogleData().then(function(success){
          $scope.register.email = success.data.emails[0].value;
          $scope.register.first_name = success.data.name.givenName;
          $scope.register.last_name = success.data.name.familyName;
          $scope.register.u_id=success.data.id;
     },function(error){
        console.log("error: "+JSON.stringify(error));
     })
  }
  else if(localStorage.loginType == "facebook"){
     authService.getFacebookData().then(function(success){
        console.log("Success: "+JSON.stringify(success));
          $scope.register.email = success.data.email;
          $scope.register.first_name = success.data.first_name;
          $scope.register.last_name = success.data.last_name;
          $scope.register.u_id=success.data.id;
     },function(error){
        console.log("error: "+JSON.stringify(error));
     })
  } 

  // Modal of Photo
    $scope.register.openPhotoModal = function(type) {
      $scope.shomMyImage = false;
      $scope.photoModel = $uibModal.open({
          templateUrl: 'static/templates/photoModal.html',
          controller: 'photo_Ctrl',
          scope: $scope
      });
      $scope.type = type;
      $scope.photoModel.rendered.then(function(success) {
          $scope.myImage = '';
          $scope.myCroppedImage = '';
          var handleFileSelect = function(evt) {
              var file = evt.currentTarget.files[0];
              var reader = new FileReader();
              reader.onload = function(evt) {
                  $scope.$apply(function($scope) {
                      $scope.myImage = evt.target.result;
                      $scope.shomMyImage = true;
                  });
              };
              reader.readAsDataURL(file);
          };
          angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
      }, function(error) {})
  }



})