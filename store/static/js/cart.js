var updateBtns = document.getElementsByClassName('update-cart')

for (var i = 0; i < updateBtns.length; i++){
  updateBtns[i].addEventListener('click', function(){
    var productId = this.dataset.product
    var action = this.dataset.action
    console.log('productId:', productId, 'action:', action)

    console.log('USER:', user)
    if (user == 'AnonymousUser'){
      addCookieItem(productId, action)
    }else{
      updateUserOrder(productId, action)
    }

  })
}

function addCookieItem(productId, action){
  console.log('Not logged in...')

  if (action == 'add'){
    if (cart[productId]==undefined){
      cart[productId]={'quantity':1}
    }else{
      cart[productId]['quantity'] += 1
    }
  }
  if (action == 'remove'){
      cart[productId]['quantity'] -= 1

      if (cart[productId]['quantity']<=0){
        console.log('Item should be deleted')
        delete cart[productId]
      }
    }
    console.log('Cart:', cart)
    document.cookie ='cart=' + JSON.stringify(cart) + ";domain=;path=/"
    location.reload()
}


function updateUserOrder(productId, action){
  console.log('User is Authenticathed, sending Data...')
    var url = '/update_item/'

    fetch(url, {
      method:'POST',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken
      },
      body:JSON.stringify({'productId':productId, 'action':action})
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log('Data:', data)
      location.reload()
    });
}


/*
function showGeolocationPopup() {
    document.getElementById("geolocation-popup").style.display = "block";
  }

  function hideGeolocationPopup() {
    document.getElementById("geolocation-popup").style.display = "none";
  }

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
      hideGeolocationPopup();
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    // Obtener el token CSRF de la cookie
    var csrftoken = getCookie('csrftoken');
    
    // Envía la información al servidor mediante una petición AJAX
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/ubicacion/');
    xhr.setRequestHeader('Content-Type', 'application/json');

    // Agrega el token CSRF al encabezado de la solicitud
    xhr.setRequestHeader('X-CSRFToken', csrftoken);
    
    xhr.onload = function() {
      if (xhr.status === 200) {
        console.log('La información de ubicación fue enviada al servidor correctamente');
      } else {
        console.log('Hubo un error al enviar la información de ubicación al servidor');
      }
    };
    xhr.send(JSON.stringify({latitude: latitude, longitude: longitude}));
  }

  setTimeout(showGeolocationPopup, 3000);

// Función para obtener el valor de la cookie 'csrftoken'
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Si la cookie comienza con 'csrftoken=', se devuelve su valor
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
*/
console.log('Hello World');