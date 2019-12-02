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
    scheduler.load("https://calendario-back.herokuapp.com/events");
}

function loadEvents() {
    $.ajax({
      url: 'https://calendario-back.herokuapp.com/events',
      headers: {
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + token
      },
      method: 'GET',
      dataType: 'json',
      success: function(data){
        scheduler.parse(data, "json");

        var evs = scheduler.getEvents()
        for (var i = 0; i < evs.length; i++){
            scheduler.changeEventId(evs[i].id, evs[i]._id);
        }
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
        url: 'https://calendario-back.herokuapp.com/events',
        headers: {
            'Content-Type':'application/json',
            'Authorization': 'Bearer ' + token
        },
        data: json_to_send,
        dataType: "json",
        type: "POST",
        success: function(response){
            scheduler.changeEventId(id, response._id);
            alert('The appointment ' + ev.text +  " has been succesfully created");
        },
        error: function(error){
            alert('Error: The appointment ' + ev.text + ' couldnt be created');
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
        url: 'https://calendario-back.herokuapp.com/events/' + id,
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

scheduler.attachEvent("onEventDeleted", function(id, ev){
    $.ajax({
        url: 'https://calendario-back.herokuapp.com/events/' + id,
        headers: {
            'Content-Type':'application/json',
            'Authorization': 'Bearer ' + token
        },
        dataType: "json",
        type: "DELETE",
        success: function(response) {
            alert("Appointment succesfully deleted");
            scheduler.eventRemove(id);
        },
        error: function(error) {
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
        console.log(data)
        window.location = './index.html'
      },
      error: function(error_msg) {
        console.log(error_msg)
        window.location = './index.html'
      }
    })
  })
  
  