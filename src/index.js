/*
    Simulador de créditos
*/

// Clases
// Credito
class SimuladorPagos {
  constructor (banco, tasa, horizonte, monto) {
    this._banco = banco;
    this._tasa = tasa;
    this._horizonte = horizonte;
    this._monto = monto;
  }
  // Getters
  get banco() {
    return this._banco;
  }
  get tasa() {
    return this._tasa;
  }
  get horizonte() {
    return this._horizonte;
  }
  get monto() {
    return this._monto;
  }

  // Setters
  set banco(newBanco) {
    this._banco = newBanco;
  }
  set tasa(newTasa) {
    this._tasa = newTasa;
  }
  set horizonte(newHorizonte) {
    this._horizonte = newHorizonte;
  }
  set monto(newMonto) {
    this._monto = newMonto;
  }

  // Methods
  // Pagos
  payment(horizonteVal) {
    return ((this._monto * ((1 + (this._tasa/100))**horizonteVal)) - this._monto).toFixed(2);
  }

  // Pago total
  totalPayment() {
    return this.payment(this._horizonte);
  }

  // Simulacion de pagos
  simulationPayments() {
    let payments = [];
    for (let i = 0; i < this._horizonte; i++) {
      let paymentVal = this.payment(i);
      payments.push(paymentVal);
    }
    return payments;
  }
}

// Producto
class Producto {
  constructor(banco, nombre, tasa, plazo, monto) {
    this._banco = banco;
    this._nombre = nombre;
    this._tasa = tasa;
    this._plazo = plazo;
    this._monto = monto;
  }
  // Getters
  get banco() {
    return this._banco;
  }
  get nombre() {
    return this._nombre;
  }
  get tasa() {
    return this._tasa
  }
  get plazo() {
    return this._plazo;
  }
  get monto() {
    return this._monto;
  }

  // Setters
  set banco(newBanco) {
    this._banco = newBanco;
  }
  set nombre(newNombre) {
    this._nombre = newNombre;
  }
  set tasa(newTasa) {
    this._tasa = newTasa;
  }
  set plazo(newPlazo) {
    this._plazo = newPlazo;
  }
  set monto(newMonto) {
    this._monto = newMonto;
  }

  // Methods
  crearCard (mes, payment, element) {
    const card = document.createElement('div');

    card.className = 'card m-2 p-3';

    card.innerHTML = `<h2>Mes: ${mes}</h2>
    <h3>Pago: ${payment}</h3>`

    $(element).append(card);
  }
} 

// Funciones auxiliares
// Numero aleatorio
const randomInteger = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Crea cards
const creaCard = (mes, monto, element) => {
    const card = document.createElement('div');

    card.className = 'card m-2 p-3';

    card.innerHTML = `<h2>Mes: ${mes}</h2>
    <h3>Pago: ${monto}</h3>`;

    $(element).append(card);
}


// Datos
const main = $('#main');
const buttonCalc = $('#btnCalculo');
const form = $('#data-form');

// Creamos una nueva sección cotenendora
nuevaSeccion = document.createElement('section');

// Local Session
if (localStorage.getItem('Producto')) {
  var productoJSON = JSON.parse(localStorage.getItem('Producto'));
  var payments_ls = JSON.parse('[' + localStorage.getItem('Payments') + ']');
  var producto_Local = new Producto(
    productoJSON._banco, 
    productoJSON._nombre, 
    productoJSON._tasa, 
    productoJSON._plazo, 
    productoJSON._monto);
  for (var i = 0; i < payments_ls.length; i++) {
    producto_Local.crearCard(i + 1, payments_ls[i], nuevaSeccion)
    $('#main').append(nuevaSeccion);
  }
}

// Listeners
const calculoClick = (event) => {
  event.preventDefault();
  // Borramos si ya se hizo una simulacion
  localStorage.clear();
  let cardsHTML = document.getElementsByClassName("card");

  if (cardsHTML.length > 0) {
    while (cardsHTML[0]) {
      cardsHTML[0].remove();
    }
  }
  // Datos
  // Accedemos a algunos elementos
  let banco = $('#Banco').val();
  let nombre = $('#Producto').val();
  let tasa = parseFloat($('#Tasa').val());
  let horizonte = parseFloat($('#Horizonte').val());
  let monto = parseFloat($('#Monto').val());

  let simulacion = new SimuladorPagos(
    banco,
    tasa,
    horizonte,
    monto
  );

  let producto = new Producto(
    banco, 
    nombre,
    tasa,
    horizonte ,
    monto
  );

  // Calculo
  // Validamos la tasa y el horizonte de tiempo
  const alertMessage = document.createElement("div");
  if (Number.isNaN(simulacion.tasa) || Number.isNaN(simulacion.horizonte) || Number.isNaN(simulacion.monto)) {
    alertMessage.className = "alert alert-danger";
    alertMessage.innerHTML = "Faltan campos";
    form.append(alertMessage);
    // Eliminamos la alerta
    const alertHTML = $('.alert')[0];
    setTimeout(function () {
      alertHTML.remove();
    }, 1000);
  } else {
    if (tasa === 0) {
      alertMessage.className = "alert alert-danger";
      alertMessage.innerHTML =
        "Lo sentimos pero no se tienen créditos a tasa cero.";
      form.append(alertMessage);
      // Eliminamos la alerta
      const alertHTML = $('.alert')[0];
      setTimeout(function () {
        alertHTML.remove();
      }, 1000);
    } else {
      totalPayment = simulacion.totalPayment();

      alertMessage.className = "alert alert-success";
      alertMessage.innerHTML = `Gracias, el Banco ${banco} tiene el producto ${nombre} a una tasa del ${tasa}% Usted terminaría pagando ${totalPayment}`;
      form.append(alertMessage);
      // Eliminamos la alerta
      const alertHTML = $('.alert')[0];
      setTimeout(function () {
        alertHTML.remove();
      }, 10000);

      let payment_loc = [];

      simulacion.simulationPayments().forEach((payment, index) => {
        producto.crearCard(index, payment, nuevaSeccion);
        payment_loc.push(payment);
        localStorage.setItem(index + 1, payment);
        localStorage.setItem("Producto", JSON.stringify(producto));
      });

      localStorage.setItem("Payments", payment_loc);

    }
  }

  $('#main').append(nuevaSeccion);
};

// buttonCalc.addEventListener("click", calculoClick);
buttonCalc.on('click', calculoClick);

$(document).ready(function () {
  // GET Rick and Morty API
  const URL = "https://rickandmortyapi.com/api/character";
  results_get = [];
  $.ajax({
    url: URL, 
    async: true,
    dataType: 'json',
    success: function(data) {
      results_get.push(data.results);
    },
    error: function() {
      results_get.push({"name": " ... "});
    }
  });

  setTimeout(function() {
    let index = randomInteger(0, 19);
    console.log(results_get[0][index].name);
  }, 1000);

  // Animaciones
  $("#bp5").toggle(4000);
  $("#btnCalculo").click(function () {
    let index = randomInteger(0, 19);
    $("#img-circle").attr('src', results_get[0][index].image);
  });

  // JSON
  const URL_BANCOS = 'https://raw.githubusercontent.com/bluepill5/JSONFiles/main/bancos.json';
  // Banco
  let banco_dropdown = $('#Banco');
  banco_dropdown.empty();
  banco_dropdown.append('<option selected="true" disabled>Seleccionar Banco</option>');
  banco_dropdown.prop('selectedIndex', 0);

  // Producto
  let producto_dropdown = $('#Producto');
  producto_dropdown.empty();
  producto_dropdown.append('<option selected="true" disabled>Seleccionar Producto</option>');

  $.getJSON(URL_BANCOS, (data) => {
    $.each(data, (key, entry) => {
      banco_dropdown.append($('<option></option>').attr('value', entry.abbreviation).text(entry.name));
    });
  });

  $('#Banco').change(() => {
    $.getJSON(URL_BANCOS, (data) => {
      let banco = $('#Banco').val();
      producto_dropdown.empty();
      producto_dropdown.append('<option selected="true" disabled>Seleccionar Producto</option>');
      $.each(data, (key, entry) => {
        if (entry.name === banco) {
          $.each(entry.productos, (key, product) => {
            producto_dropdown.append($('<option></option>').attr('value', product.abbreviation).text(key));
          });
        }
      });
    });
  });
  
});


