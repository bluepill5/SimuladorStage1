/* 
    Simulador de créditos
*/

// Funciones auxiliares
// Pagos
const paymentFun = (monto, tasa, horizonte) => {
    return (monto * ((1 + (tasa/100))**horizonte)) - monto;
};

// Simulacion de pagos
const simulationPayments = (monto, tasa, horizonte) => {
    let payments = [];
    for (i = 0; i < horizonte; i++) {
        payment = paymentFun(monto, tasa, i).toFixed(2);
        payments.push(payment);
    }
    return payments;
};

// Crea cards
const creaCard = (mes, monto, element) => {
    const card = document.createElement('div');

    card.className = 'card m-2 p-3';

    card.innerHTML = `<h2>Mes: ${mes}</h2>
    <h3>Pago: ${monto}</h3>`;

    element.appendChild(card);
}

// Datos
const main = document.getElementById('main');
const buttonCalc = document.getElementById('btnCalculo');
const form = document.getElementById('data-form');

// Creamos una nueva sección cotenendora
nuevaSeccion = document.createElement('section');

// Accedemos a algunos elementos
const bancoHTML = document.getElementById('Banco');
const tasaHTML = document.getElementById('Tasa');
const horizonteHTML = document.getElementById('Horizonte');
const montoHTML = document.getElementById('Monto');


// Listeners
const calculoClick = (event) => {
  event.preventDefault();
  // Borramos si ya se hizo una simulacion
  let cardsHTML = document.getElementsByClassName('card');

  if (cardsHTML.length > 0) {
      while (cardsHTML[0]) {
        cardsHTML[0].remove();
      }
  }
  // Datos
  let banco = bancoHTML.value;
  let tasa = parseFloat(tasaHTML.value);
  let horizonte = parseFloat(horizonteHTML.value);
  let monto = parseFloat(montoHTML.value);
  // calculo
  // Validamos la tasa y el horizonte de tiempo
  const alertMessage = document.createElement('div');
  if (Number.isNaN(tasa) || Number.isNaN(horizonte) || Number.isNaN(monto)) {
    alertMessage.className = 'alert alert-danger';
    alertMessage.innerHTML = 'Faltan campos';
    form.appendChild(alertMessage);
    // Eliminamos la alerta
    const alertHTML = document.getElementsByClassName('alert')[0];
    setTimeout(function () {
      alertHTML.remove();
    }, 1000);
  } else {
    if (tasa === 0) {
        alertMessage.className = 'alert alert-danger';
        alertMessage.innerHTML =
          'Lo sentimos pero no se tienen créditos a tasa cero.';
        form.appendChild(alertMessage);
        // Eliminamos la alerta
        const alertHTML = document.getElementsByClassName('alert')[0];
        setTimeout(function () {
          alertHTML.remove();
        }, 1000);
    } else {
      totalPayment = paymentFun(monto, tasa, horizonte).toFixed(2);

      alertMessage.className = 'alert alert-success';
      alertMessage.innerHTML = `Gracias, el Banco ${banco} tiene el producto XXXX a una tasa del ${tasa}% Usted terminaría pagando ${totalPayment}`;
      form.appendChild(alertMessage);
      // Eliminamos la alerta
      const alertHTML = document.getElementsByClassName('alert')[0];
      setTimeout(function () {
        alertHTML.remove();
      }, 10000);

      simulationPayments(monto, tasa, horizonte).forEach((payment, index) => {
        creaCard(index + 1, payment, nuevaSeccion);
      });
    }
  };

  main.appendChild(nuevaSeccion);

  // Ingresamos los datos
  bancoHTML.value = banco;
  tasaHTML.value = tasa;
  horizonteHTML.value = horizonte;
  montoHTML.value = monto;
};


buttonCalc.addEventListener('click', calculoClick);






