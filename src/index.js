/* 
    Simulador de créditos
*/

// Clases
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

// Funciones auxiliares
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
for (var i = 0; i < localStorage.length; i++) {
    let keyVal = localStorage.key(i);
    creaCard(i + 1, localStorage.getItem(i + 1), nuevaSeccion);
    $('#main').append(nuevaSeccion);
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
  let tasa = parseFloat($('#Tasa').val());
  let horizonte = parseFloat($('#Horizonte').val());
  let monto = parseFloat($('#Monto').val());
  
  let simulacion = new SimuladorPagos(
    banco,
    tasa,
    horizonte,
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
      alertMessage.innerHTML = `Gracias, el Banco ${banco} tiene el producto XXXX a una tasa del ${tasa}% Usted terminaría pagando ${totalPayment}`;
      form.append(alertMessage);
      // Eliminamos la alerta
      const alertHTML = $('.alert')[0];
      setTimeout(function () {
        alertHTML.remove();
      }, 10000);

      simulacion.simulationPayments().forEach((payment, index) => {
        creaCard(index + 1, payment, nuevaSeccion);
        localStorage.setItem(index + 1, payment);
      });
    }
  }

  $('#main').append(nuevaSeccion);
};

// buttonCalc.addEventListener("click", calculoClick);
buttonCalc.on('click', calculoClick);

