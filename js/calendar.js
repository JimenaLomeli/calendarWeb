var token = localStorage.getItem('token');
if (token) {
  token = token.replace(/^"(.*)"$/, '$1'); // Remove quotes from token start/end.
}

function init() {
    scheduler.config.date_format = "%Y-%m-%d %H:%i";
    
    scheduler.init('scheduler_here',new Date(2019,11,10),"month");
    scheduler.templates.parse_date = function(value){ 
        return new Date(value); 
    };

    loadEvents()
    
    scheduler.load("http://calendario-back.herokuapp.com/events");
}

function loadEvents() {
    $.ajax({
      url: 'http://calendario-back.herokuapp.com/events',
      headers: {
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + token
      },
      method: 'GET',
      dataType: 'json',
      success: function(data){
        scheduler.parse(data, "json");
      },
      error: function(error_msg) {
        alert((error_msg['responseText']));
      }
    });
}

scheduler.attachEvent("onEventAdded", function(id, ev){
    json_to_send = {
        "text" : ev.text,
        "start_date": ev.start_date,
        "end_date": ev.end_date
    };
    json_to_send = JSON.stringify(json_to_send);
    $.ajax({
        url: 'http://calendario-back.herokuapp.com/events',
        headers: {
            'Content-Type':'application/json',
            'Authorization': 'Bearer ' + token
        },
        data: json_to_send,
        dataType: "json",
        type: "POST",
        success: function(response){
            scheduler.changeEventId(ev.id , response._id);

            alert('The appointment ' + ev.text +  " has been succesfully created");
        },
        error:function(error){
            alert('Error: The appointment '+ev.text+' couldnt be created');
            console.log(error);
        }
    }); 
});

scheduler.attachEvent("onEventChanged", function(id, ev){
    json_to_send = {
        "text" : ev.text,
        "start_date": ev.start_date,
        "end_date": ev.end_date
    };
    json_to_send = JSON.stringify(json_to_send);
    $.ajax({
        url: 'http://calendario-back.herokuapp.com/events/' + ev._id,
        headers: {
            'Content-Type':'application/json',
            'Authorization': 'Bearer ' + token
        },
        data: json_to_send,
        dataType: "json",
        type: "PATCH",
        success: function(response){
            alert("Event succesfully updated !");
        },
        error: function(err){
            alert("Error: Cannot save changes");
            console.error(err);
        }
    }); 
});

scheduler.attachEvent("onConfirmedBeforeEventDelete", function(id, ev){
    $.ajax({
        url: 'http://calendario-back.herokuapp.com/events/' + ev._id,
        headers: {
            'Content-Type':'application/json',
            'Authorization': 'Bearer ' + token
        },
        dataType: "json",
        type: "DELETE",
        success: function(response){
            if (response.status == "success"){
                if(!ev.willDeleted){
                    alert("Appointment succesfully deleted");
                }
            } else if(response.status == "error"){
                alert("Error: Cannot delete appointment");
            }
        },
        error:function(error){
            alert("Error: Cannot delete appointment: " + ev.text);
            console.log(error);
        }
    }); 
});

$('#logout_button').on('click', function(){
    $.ajax({
      url: 'http://calendario-back.herokuapp.com/logout',
      headers: {
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + token
      },
      method: 'POST',
      dataType: 'json',
      success: function(data) {
        window.location = './index.html'
      },
      error: function(error_msg) {
        window.location = './index.html'
      }
    })
  })
  
  