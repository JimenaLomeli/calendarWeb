$('#login_button').on('click', function(){
  let valEmail
  let valPassword 
  
  let email = $('#email').val()
  let password = $('#password').val()

  let email_error = $('#email_error')
  let password_error = $('#password_error')

  if (email === "" || valida_email(email.value)) {
    console.log(email === "")
    console.log(!valida_email(email.value))
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

  if (valPassword && valEmail) {
    json_to_send = {
      "email": email,
      "password" : password
    };
    json_to_send = JSON.stringify(json_to_send)
  
    $.ajax({
      url: 'https://calendario-back.herokuapp.com/login',
      headers: {
          'Content-Type':'application/json'
      },
      method: 'POST',
      dataType: 'json',
      data: json_to_send,
      success: function(data){
        // guardar token en localstorage o cookie
        localStorage.setItem('token', data.token)
        window.location = './calendar.html'
      },
      error: function(error_msg) {
        console.log(error_msg)
        // alert((error_msg["responseText"]))
      }
    })
  }
})

function valida_email(email) {
    var regexp_email = /\S+@\S+\.\S+/;
    return regexp_email.test(email);
}
