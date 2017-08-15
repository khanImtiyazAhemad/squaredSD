  angular.module("avaanaController").controller("bookingCtrl", function(spinnerService, $scope, $state, uiCalendarConfig, $mdDialog, $rootScope, $sce, $filter, $mdpTimePicker, apiService, $stateParams, $uibModal, $timeout) {
      $scope.booking = {}
      spinnerService.show("html5spinner");
      var d = new Date();
      $scope.toady_nodatas = false;
      $scope.more = 'Show more'
      data = {
          lat: localStorage.lat,
          lng: localStorage.lng,
      }
      $scope.Math = Math
      apiService.getData('a_get_indiviual_business_offer/' + $stateParams.key + "/", data, 'post').then(function(res) {
          if (res.data.status == 200) {
           // console.log(JSON.stringify(res.data.Offers_Data))
            $scope.payment_details = res.data.Offers_Data
            booking_data();
          } else {
            // spinnerService.hide("html5spinner");
          }
      })
      var filter_weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
      var days = apiService.days
      if ($stateParams.date == null || $stateParams.date == '' || $stateParams.date == undefined) {
          d = new Date()
          d.setHours(0, 0, 0)
      } else {
          d = new Date($stateParams.date)
          $scope.booking.appointmnt_date = d
          d.setHours(0, 0, 0)
      }
      $scope.booking.appointment_Day = $filter('date')(d, 'EEEE, dd MMMM');
      $scope.booking.current_year = $filter('date')(d, 'yyyy');
      $scope.booking.end_time = ''

      // function invoke when above api response
      var event_date_time = function(date) {
          e_date = new Date(date);
//          e_date.setDate(e_date.getDate());
          $scope.booking.event_date = $filter('date')(e_date, 'EEEE, dd MMMM');
          $scope.booking.event_time = $scope.booking.appointment_times_List.length ? $scope.booking.appointment_times_List[0].time : $filter('date')(e_date, 'hh:mm a');
          cancel_date = new Date(e_date)
          event_Time_Array = $scope.booking.event_time.split(/[\s:]+/);
          cancel_date.setHours(event_Time_Array[2] == "PM" ? parseInt(event_Time_Array[0]) + 12 : event_Time_Array[0], event_Time_Array[1], 0)
          $scope.booking.cancel_date = $filter('date')(cancel_date.setHours(cancel_date.getHours() - cancel_hours), 'EEEE, dd MMMM, hh:mm a');
      }
      var booking_data = function() {
          $scope.booking.businessname = $scope.payment_details.business_data.name;
          $scope.booking.correct_image = $scope.payment_details.business_data.business_detail['correct_image'];
          $scope.booking.distance = $scope.payment_details.business_data.business_location['distance'];
          $scope.booking.address = $scope.payment_details.business_data.business_location['address'];
          $scope.booking.street = $scope.payment_details.business_data.business_location['street'];
          $scope.booking.city = $scope.payment_details.business_data.business_location['city'];
          $scope.booking.state = $scope.payment_details.business_data.business_location['state'];
          $scope.booking.country = $scope.payment_details.business_data.business_location['country'];
          $scope.booking.postal_code = $scope.payment_details.business_data.business_location['postal_code'];
          $scope.booking.business_cliniko = $scope.payment_details.business_data.business_detail.business_cliniko.appointments;
          $scope.lat = $scope.payment_details.business_data.business_location['lat'];
          $scope.lng = $scope.payment_details.business_data.business_location['lng'];
          $scope.booking.service_name = $scope.payment_details.service_name;
          $scope.booking.length_of_service = $scope.payment_details.length_of_service;
          $scope.booking.rating = $scope.payment_details.business_data.business_rating;
          $scope.booking.timing = $scope.payment_details.business_data.business_timing;
          $scope.booking.practitionerArray = []
          for (i = 0; i < $scope.payment_details.business_data.business_practitioner.length; i++) {
              if ($scope.payment_details.service_practitioner.includes($scope.payment_details.business_data.business_practitioner[i].name)) {
                  $scope.booking.practitionerArray.push($scope.payment_details.business_data.business_practitioner[i])
              }
          }
          var prac_Array = $scope.booking.practitionerArray;
          $scope.booking.practitionerName = $scope.booking.practitionerArray[0].name;
          $scope.booking.current_practitioner = $scope.booking.practitionerArray[0];
          $scope.booking.price = $scope.payment_details.discount == 0 || $scope.payment_details.discount == $scope.payment_details.price ? $scope.payment_details.price : $scope.payment_details.discount;
          cancel_hours = $scope.payment_details.business_data.business_detail.cancelation_policy
          $scope.lead_time = $scope.payment_details.business_data.business_detail.max_lead_time
          businessHoliday();
          practitionerAppointments($scope.booking.current_practitioner, d)
          // spinnerService.hide("html5spinner");
      }
      $scope.booking.ChangePractitioner = function(practitioner) {
          spinnerService.show("html5spinner");
          $scope.booking.current_practitioner = practitioner
          var current_date = $scope.booking.appointmnt_date;
          if ($scope.booking.appointmnt_date == '' || $scope.booking.appointmnt_date == undefined || $scope.booking.appointmnt_date == null) {
              current_date = new Date($stateParams.date)
          }
          practitionerAppointments($scope.booking.current_practitioner, current_date)
      }

      function datePush(date_value) {
              var date = new Date(date_value);
              date.setHours(00, 00, 00)
              return date.toString()
          }
          // To Disable Business Holiday and Unavaivlbel Days on Calender

      $scope.close_days = []
      var businessHoliday = function() {
          $scope.close_days = []
          for (var j = 0; j < $scope.booking.timing.length; j++) {
              if ($scope.booking.timing[j].day_status == "Closed") {
                  if ($scope.booking.timing[j].business_day == filter_weekday[new Date().getDay()]) {
                      $scope.toady_nodatas = true;
                      $('.time_btn ').html("")
                  } else {

                  }

                  $scope.close_days.push(days[$scope.booking.timing[j].business_day]);
              }
          }
      }



      $scope.onlyWeekdaysPredicate = function(date) {
          current_date = new Date();
          current_date.setHours(0, 0, 0)
          var day = date.getDay();
          // return day;
          if (!$scope.close_days.includes(day) && (date.toString() == current_date.toString() || date >= current_date)) {

              return date;

          }

      };



      var unavailble_time = function(appointment_date_obj, appointment_start_time, appointment_end_time, calender_date_value, type, appointment_obj) {
          appointment_date = new Date(appointment_date_obj)
          // console.log("Booking"+appointment_date)
          start_res = appointment_start_time.split(/[\s:]+/);
          var n_d = new Date(appointment_date_obj)
          end_res = appointment_end_time.split(/[\s:]+/);
          appointment_date.setHours(start_res[2] == "PM" && start_res[0]!=12 ? parseInt(start_res[0]) + 12 : start_res[0])
          appointment_date.setMinutes(start_res[1])
          bound_time = ($filter('timeformat')($scope.booking.length_of_service)) / 15;

          if (calender_date_value.getDate() == appointment_date.getDate() && calender_date_value.getFullYear() == appointment_date.getFullYear()) {
              for (j = 0; j < bound_time; j++) {
                  var slot_time = $filter('date')(appointment_date, 'hh:mm a');
                  if (!$scope.booking.not_AvailableTime.includes(slot_time))
                      $scope.booking.not_AvailableTime.push(slot_time)
                  appointment_date.setMinutes(appointment_date.getMinutes() - 15)
              }
              appointment_date.setHours(start_res[2] == "PM" ? parseInt(start_res[0]) + 12 : start_res[0])
              appointment_date.setMinutes(start_res[1])
              n_d.setHours(end_res[2] == "PM" ? parseInt(end_res[0]) + 12 : end_res[0])
              n_d.setMinutes(end_res[1])
              var r_time = (n_d.getTime() - appointment_date.getTime()) / (15 * 60 * 1000)
              for (j = 0; j < r_time; j++) {
                  slot_time = $filter('date')(appointment_date, 'hh:mm a');
                  if (!$scope.booking.not_AvailableTime.includes(slot_time))
                      $scope.booking.not_AvailableTime.push(slot_time)
                  appointment_date.setMinutes(appointment_date.getMinutes() + 15)
              }
          }
          // console.log("Unavailable"+$scope.booking.not_AvailableTime)
      }



      var repeat_end_type_method = function(block_obj) {
          var repeat_end_date
          if (block_obj.end_type == "Never") {
              var repeat_end_date = new Date('2020-12-30')
          } else if (block_obj.end_type == "After Occurence") {
              occurance_end_date = new Date(block_obj.blocked_date)
              if (block_obj.repeat_type == 'Daily') {
                  repeat_days = 1
              } else if (block_obj.repeat_type == 'Weekly' || block_obj.repeat_type == 'Every Weekday') {
                  repeat_days = 7
              }
              repeat_end_date = occurance_end_date.setDate(occurance_end_date.getDate() + repeat_days * block_obj.repeat_occurance)
          } else if (block_obj.end_type == "End On") {
              var repeat_end_date = new Date(block_obj.end_on)
          }
          return repeat_end_date
      }

      var repeat_type = function(appointment_date_obj, appointment_start_time, appointment_end_time, calender_date_value, type, appointment_obj) {
          appointment_date = new Date(appointment_date_obj)
          appointment_date.setHours(00, 00, 00)
          var end_date = repeat_end_type_method(appointment_obj)
          if (appointment_obj.repeat_type == 'Daily' || appointment_obj.repeat_type == 'Every Weekday' || appointment_obj.repeat_type == 'Weekly') {
              if (appointment_date <= calender_date_value <= end_date && appointment_obj.weekly_days.includes(calender_date_value.getDay())) {
                  unavailble_time(appointment_date_obj, appointment_start_time, appointment_end_time, calender_date_value, type, appointment_obj)
              }
          } else if (appointment_obj.repeat_type == 'Monthly') {
              if (appointment_date <= calender_date_value <= end_date && appointment_obj.monthly_type == "Day of the month" && (appointment_date.getDate() == calender_date_value.getDate())) {
                  unavailble_time(appointment_date_obj, appointment_start_time, appointment_end_time, calender_date_value, type, appointment_obj)
              } else if (appointment_date <= calender_date_value <= end_date && appointment_obj.monthly_type == "Day of the week") {
                  day_of_week_date = apiService.getspecificDay(calender_date_value, appointment_obj.monthly_day, appointment_obj.monthly_week)
                  if (calender_date_value.toString() == day_of_week_date.toString()) {
                      unavailble_time(appointment_date_obj, appointment_start_time, appointment_end_time, calender_date_value, type, appointment_obj)
                  }
              }
          } else if (appointment_obj.repeat_type == 'Yearly') {
              if (appointment_date <= calender_date_value <= end_date && calender_date_value.getDate() == appointment_date.getDate() && calender_date_value.getMonth() == appointment_date.getMonth()) {
                  unavailble_time(appointment_date_obj, appointment_start_time, appointment_end_time, calender_date_value, type, appointment_obj)
              }
          }
      }
      var appointmentsDetail = function(appointment_date_obj, appointment_start_time, appointment_end_time, calender_date_value, type, appointment_obj) {
          appointment_date = new Date(appointment_date_obj)
          // console.log(appointment_date)
          appointment_date.setHours(00, 00, 00)
          if (appointment_obj) {
              if (appointment_obj.repeat_mode == 'Single') {
                  if (calender_date_value.toString() == appointment_date.toString()) {
                      unavailble_time(appointment_date_obj, appointment_start_time, appointment_end_time, calender_date_value, type, appointment_obj)
                  }
              } else {
                  repeat_type(appointment_date_obj, appointment_start_time, appointment_end_time, calender_date_value, type, appointment_obj)
              }
          } else {
              if (calender_date_value.toString() == appointment_date.toString()) {
                  unavailble_time(appointment_date_obj, appointment_start_time, appointment_end_time, calender_date_value, type, appointment_obj)
              }
          }
      }
      var practitionerAppointments = function(practitioner, calender_date_value) {
              c_date = new Date(calender_date_value);
              $scope.booking.not_AvailableTime = []
              for (var i = 0; i < practitioner.practiitioner_appointments.length; i++) {
                  appointmentsDetail(practitioner.practiitioner_appointments[i].appointment_date, practitioner.practiitioner_appointments[i].appointment_start_time, practitioner.practiitioner_appointments[i].appointment_end_time, c_date, "Appointment", "")
              }
              for (var j = 0; j < practitioner.practitioner_block_times.length; j++) {
                // console.log("A"+practitioner.practitioner_block_times[j].id)
                  appointmentsDetail(practitioner.practitioner_block_times[j].blocked_date, practitioner.practitioner_block_times[j].blocked_start_time, practitioner.practitioner_block_times[j].blocked_end_time, c_date, "Block Time", practitioner.practitioner_block_times[j])
              }
              for (var k = 0; k < practitioner.practitioner_new_appointments.length; k++) {
                  appointmentsDetail(practitioner.practitioner_new_appointments[k].appointment_date, practitioner.practitioner_new_appointments[k].appointment_start_time, practitioner.practitioner_new_appointments[k].appointment_end_time, c_date, "New Appointment", practitioner.practitioner_new_appointments[k])
              }
              if ($scope.booking.business_cliniko) {
                  for (var l = 0; l < $scope.booking.business_cliniko.length; l++) {
                      appointment_start = $filter('date')($scope.booking.business_cliniko[l].appointment_start, 'hh:mm a')
                      appointment_end = $filter('date')($scope.booking.business_cliniko[l].appointment_end, 'hh:mm a')
                      unavailble_time($scope.booking.business_cliniko[l].appointment_start, appointment_start, appointment_end, c_date)
                  }
              }

              available_timing(c_date);

          }
          // When Date Change from Calender then Available Appointment time  of Current Practitioner is Displayed into the time Block
      $scope.booking.dateChange = function() {
              // spinnerService.show("html5spinner");
//              console.log("Selected Date-----"+$scope.booking.appointmnt_date)
              $scope.booking.current_year = $filter('date')($scope.booking.appointmnt_date, 'yyyy');
              var prev_Date = next_Date = d
              $scope.booking.appointment_Day = $filter('date')($scope.booking.appointmnt_date, 'EEEE, dd MMMM');
              $scope.booking.eventDate = $scope.booking.appointment_Day;
              practitionerAppointments($scope.booking.current_practitioner, $scope.booking.appointmnt_date);
              $scope.toady_nodatas = false;
          }
          // Available Time
      var available_timing = function(date_value) {
              $scope.booking.appointment_times_List = []
              test_date = $filter('date')(date_value, 'dd-MM-yyyy')
              current_date_test = $filter('date')(new Date(), 'dd-MM-yyyy')
              days_list = Object.keys(days)
              for (j = 0; j < $scope.booking.timing.length; j++) {
                  if (($scope.booking.timing[j].business_day == days_list[date_value.getDay()]) && ($scope.booking.timing[j].day_status != 'Closed')) {
                      temp_date1 = new Date(date_value)
                      temp_date2 = new Date(date_value)
                      start_time = $scope.booking.timing[j].start_timing.split(/[\s:]+/);
                      end_time = $scope.booking.timing[j].end_timing.split(/[\s:]+/);
                      temp_date1.setHours(start_time[2] == "PM" && start_time[0] != "12" ? parseInt(start_time[0]) + 12 : start_time[2] == "PM" && start_time[0] == "12" ? 00 : start_time[0])
                      temp_date1.setMinutes(parseInt(start_time[1]))
                      temp_date1.setSeconds(00)
                      temp_date2.setHours(end_time[2] == "PM" && end_time[0] != "12" ? parseInt(end_time[0]) + 12 : end_time[2] == "PM" && end_time[0] == "12" ? 00 : end_time[0])
                      temp_date2.setMinutes(parseInt(end_time[1]))
                      temp_date2.setSeconds(00)
                      if (test_date == current_date_test) {
                          var current_time = new Date()
                          current_time.setHours(current_time.getHours() + $scope.lead_time)
                          if (temp_date2.getTime() < current_time.getTime()) {
                              date_value = new Date(date_value)
                              date_value.setDate(date_value.getDate() - 2);
                              // $scope.booking.appointmnt_date = date_value
                              $scope.notTodayErr = true
                              $timeout(function(){spinnerService.hide("html5spinner");},500)
                              // practitionerAppointments($scope.booking.current_practitioner, $scope.booking.appointmnt_date)
                              return;
                          }
                          if (temp_date1.getTime() < current_time.getTime()) {
                              temp_date1.setHours(current_time.getHours())
                              temp_date1.setMinutes((Math.floor(current_time.getMinutes() / 15) * 15) + 15)
                              temp_date1.setSeconds(00)
                          }
                      } else {
                          $scope.notTodayErr = null
                      }
                      bound_time = ($filter('timeformat')($scope.booking.length_of_service)) / 15;
                      var r_time = (temp_date2.getTime() - temp_date1.getTime()) / (15 * 60 * 1000)
                      $scope.Morning = 0;
                      $scope.Noon = 0;
                      $scope.Evening = 0;
                      for (i = 0; i <= r_time - bound_time; i++) {
                          var slot_time = $filter('date')(temp_date1, 'hh:mm a');
                          if (!$scope.booking.not_AvailableTime.includes(slot_time)) {
                              slotArray = slot_time.split(/[\s:]+/);
                              if (slotArray[2] == 'AM') {
                                  day_time = "Morning"
                                  $scope.Morning++;
                              } else if (slotArray[2] == "PM" && parseInt(slotArray[0]) <= 5 || parseInt(slotArray[0]) > 11) {
                                  day_time = "Noon"
                                  $scope.Noon++;
                              } else if (slotArray[2] == "PM" && parseInt(slotArray[0]) >= 6) {
                                  day_time = "Evening"
                                  $scope.Evening++
                              }
                              $scope.booking.appointment_times_List.push({
                                  "time": slot_time,
                                  "day_time": day_time
                              });
                          }
                          temp_date1.setMinutes(temp_date1.getMinutes() + 15)
                      }
                  }
              }
              event_date_time(date_value)
              $timeout(function(){spinnerService.hide("html5spinner");},3000)

          }
          // When Time Select
      $scope.booking.timeSelect = function(time) {
              $scope.booking.event_time = time
              var booking_end_time = new Date()
              end_booking_time = time.split(/[\s:]+/);
              cancel_date.setHours(end_booking_time[2] == "AM" ? parseInt(end_booking_time[0]) - 12 : end_booking_time[0])
              cancel_date.setMinutes(end_booking_time[1])

              $scope.booking.cancel_date = $filter('date')(cancel_date.setHours(cancel_date.getHours()), 'EEEE, dd MMMM, hh:mm a');
              if (end_booking_time[2] == "PM") {
                  end_booking_time[0] = parseInt(end_booking_time[0]) + 12;
              }
              booking_end_time.setHours(parseInt(end_booking_time[0]))
              booking_end_time.setMinutes(parseInt(end_booking_time[1]) + $filter('timeformat')($scope.booking.length_of_service))
              booking_end_time.setSeconds(00)
              $scope.booking.end_time = $filter('date')(booking_end_time, 'hh:mm a');
              if ($(window).width() < 769) {
                  $('html,body').animate({
                      'scrollTop': $('.calleft-boking').offset().top
                  });
              }
          }
          // Proceed To Checkout Listener
      $scope.booking.checkout = function() {
              if ($scope.booking.end_time == undefined || $scope.booking.end_time == null || $scope.booking.end_time == '') {
                  $scope.booking.practitionerErr = 'Please select an available date and time.';
                  return
              } else {
                  spinnerService.show("html5spinner");
                  localStorage.setItem('event_detail', JSON.stringify({
                      "startTime": $scope.booking.event_time,
                      "endTime": $scope.booking.end_time,
                      "eventDate": $scope.booking.event_date,
                      "pracName": $scope.booking.current_practitioner.name,
                      "practitioner_id": $scope.booking.current_practitioner.id,
                      "event_yr": $scope.booking.current_year,
                      "cancel_date": $scope.booking.cancel_date,
                  }));
                  data = {
                      business_email: $scope.payment_details.business_data.email,
                      business: $scope.payment_details.business_data.id,
                      service_name: $scope.payment_details.service_name,
                      service_id: $scope.payment_details.id,
                      appointment_date: $scope.booking.event_date,
                      appointment_start_time: $scope.booking.event_time,
                      appointment_end_time: $scope.booking.end_time,
                      business_practitioner: $scope.booking.current_practitioner.id,
                      event_year: $scope.booking.current_year,
                  }
                  // console.log("Data"+JSON.stringify(data))
                  apiService.getData('a_validate_appointment_request/', data, 'post').then(function(success) {
                      if (success.data.status == 200) {
                          spinnerService.hide("html5spinner");
                          $state.go('app.payment', {
                              key: $stateParams.key,
                              slug: $stateParams.slug,
                              appoint_slug: success.data.temp_appointment.temp_slug
                          })
                      } else {
                          spinnerService.hide("html5spinner");
                          $scope.booking.practitionerErr = success.data.Message;
                      }
                  },function(error){
                      spinnerService.hide("html5spinner");
                  });
              }
          }
          //*******************MAp DIALOG******************************
      $scope.showAdvanced = function(ev, address, city, postal_code) {
          $scope.location = {
              lat: $scope.lat,
              lng: $scope.lng,
              address: address,
              city: city,
              postal_code: postal_code
          }

          $scope.photoModel = $uibModal.open({
              templateUrl: 'static/templates/Auto_map.html',
              controller: 'mapCtrl',
              scope: $scope
          });
      };


      $scope.providerPage = function() {
          $state.go('app.provider', {
              "provider_name": $stateParams.slug,
              "subhurb":$scope.booking.city.replace(' ', '-'),
          });
      }

  });
