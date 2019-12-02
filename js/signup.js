$('#signup_button').on('click', function(){
  let valEmail
  let valPassword 
  let valName

  let password = $("#password").val()
  let email = $("#email").val()
  let name = $("#name").val()

  let email_error = $('#email_error')
  let password_error = $('#password_error')
  let name_error = $("#name_error")

  if (email === "") {
    email_error.removeClass('hidden');
    valEmail = false
  } else {
    email_error.addClass('hidden');
    valEmail = true
  }

  if (password === "") {
    password_error.removeClass('hidden');
    valPassword = false
  }
  else {
    password_error.addClass('hidden');
    valPassword = true
  }

  if (name === "") {
    name_error.removeClass('hidden');
    valName = false
  }
  else {
    name_error.addClass('hidden');
    valName = true
  }

  if (valPassword && valEmail && valName) {
    json_to_send = {
      "password" : password,
      "email": email,
      "name": name,
    };

    json_to_send = JSON.stringify(json_to_send);

    $.ajax({
      url: 'https://calendario-back.herokuapp.com/users',
      headers: {
          'Content-Type':'application/json'
      },
      method: 'POST',
      dataType: 'json',
      data: json_to_send,
      success: function(data){
        alert("Usuario creado con exito");
        console.log('success: '+ data);
        window.location = './index.html'
      },
      error: function(error_msg) {
        alert((error_msg['responseText']));
      }
    });
  }
});
