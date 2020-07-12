// limpia los campos cuando terminas de ingresar un vehiculo
function clearFields() {
    document.getElementById('placa').value = ''
    document.getElementById('nombrePropietario').value = ''
    document.getElementById('idPropietario').value = ''
    document.getElementById('desVehiculo').value = ''
}

// para cerrar el modal y elimanr ese modal que se creó
function cerrarModal() {

    const modal = document.querySelector('#modalId')
    modal.classList.remove('is-active')
    document.body.removeChild(modal)

}

// muestra el modal al momentode agregar un vehiculo
function ShowModal(id) {
    const modal = document.createElement('div')
    modal.id = 'modalId'
    modal.classList.add('modal')


    modal.innerHTML = `
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Vehiculo parqueado exitosamente !</p>
      <button class="delete" aria-label="close"></button>
    </header>
    <section class="modal-card-body">
     <div class="content">
        <h4> ID : ${id} </h4>
      </div>
    </section>
    <footer class="modal-card-foot">
      <button onclick="cerrarModal()" class="button">Cerrar</button>
    </footer>
  </div>
    `
    document.body.appendChild(modal)
    modal.classList.add('is-active')

}

// añade un nuevo vehiculo al parqueadero
function addVehiculo() {

    const btnSendVehiculo = document.getElementById('btnIngresarVehiculo')

    btnSendVehiculo.addEventListener('click', e => {
        e.preventDefault()
        let desVehiculo = 'null'
        let tipoVehiculo = 1
        const placa = document.getElementById('placa'),
            nombrePropietario = document.getElementById('nombrePropietario'),
            idPropietario = document.getElementById('idPropietario')

        if (placa.value.length == 0 || nombrePropietario.value.length == 0 || idPropietario.value.length == 0) {
            alert('DEBES RELLENAR TODOS LOS CAMPOS')

        } else {

            if (document.getElementById('tipoVehiculo').value == 'Bicicleta') {
                tipoVehiculo = 2
            }

            if (document.getElementById('inputTextArea').checked) {
                desVehiculo = document.getElementById('desVehiculo').value
            }

            let nuevoVehiculo = {
                placa: placa.value,
                descripcion: desVehiculo,
                tipo: tipoVehiculo,
                estado: true,
                ['fecha-ingreso']: {
                    nanoseconds: 0,
                    seconds: new Date().valueOf() / 1000
                },
                propietario: {
                    nombre: nombrePropietario.value,
                    identificacion: idPropietario.value
                }
            }

            console.log(nuevoVehiculo)


            db.collection("vehiculos").add(nuevoVehiculo)
                .then(function (docRef) {
                    clearFields()
                    ShowModal(docRef.id)
                    console.log("Document written with ID: ", docRef.id);
                })
                .catch(function (error) {
                    console.error("Error adding document: ", error);
                });



        }

    })
}

// rebibe un placa y retorna el id 
function getIdByPlaca(placa) {
    return new Promise((res, rej) => {
        db.collection('vehiculos').where('placa', '==', placa).get().then((els) => {
            if (els.empty) {
                alert(`No se encontro esta placa : ${placa}`)
                btnRetirarVehiculo.classList.remove('is-loading')
                rej('No se encontro la placa socitada')
            } else {
                res(els.docs[0].id)
            }
        })
    });
}


// devuelve los los datos de un vehiculo
function getDatosVehiculo(id) {
    return new Promise((res, rej) => {
        db.collection("vehiculos").doc(id).get()
            .then((data) => {
                res(data.data())
            })
            .catch((error) => {
                rej(error)
            })
    })
}
// convierte de milsegundos a minutos
function milisegundosToMinutos(milisegundos) {
    let minutos = milisegundos / 60000
    return minutos
}
// muestra la factura del vehiculo que estamos retirando
function imprimirFactura(infFactura) {
    const contenedorFactura = document.getElementById('contenedorFactura');


    contenedorFactura.innerHTML = `
    
    <div class="message">
                            <div class="message-header">
                                <p>Factura de retiro</p>
                            </div>
                        </div>
                        <h2 class="has-text-centered is-size-4	">Informacion factura</h2>
                        <table class="table table is-fullwidth">
                            <thead>
                                <tr>
                                    <th>Datos</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>Placa</th>
                                    <td>${infFactura.placa}</td>
                                </tr>
                                <tr>
                                    <th>propietario</th>
                                    <td>${infFactura.propietario.nombre}</td>
                                </tr>
                                <tr>
                                    <th>Fecha ingreso</th>
                                    <td>${new Date(infFactura['fecha-ingreso'].seconds * 1000).toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <th>Fecha retiro</th>
                                    <td>${new Date(infFactura['fecha-salida'] * 1000).toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <th>duracion en minutos</th>
                                    <td><strong>$${1 * infFactura.duracion.minutos.toFixed(2)}</strong></td>
                                </tr>
                                <tr>
                                    <th>duracion en horas</th>
                                    <td><strong>$${1 * infFactura.duracion.horas.toFixed(2)}</strong></td>
                                </tr>
                                <tr>
                                    <th>Valor a pagar</th>
                                    <td><strong>$${1 * infFactura.valor.toFixed(2)}</strong></td>
                                </tr>
                                <tr>
                                    <th></th>
                                    <td><button class="button is-outlined">Imprimir</button></td>
                                </tr>
                            </tbody>
                        </table>`

    return 'llego hasta aqui xddd'

}
// ingrese facturaas s m bd
async function guardarFactura(vehiculo) {
    let tiempoIngreso = vehiculo['fecha-ingreso'].seconds * 1000;
    let fechaSalidaMilisegundo = new Date().valueOf();
    let tiempoQueDuroMilisegundo = fechaSalidaMilisegundo - tiempoIngreso;
    let factura = {
        ...vehiculo,
        ['fecha-salida']: new Date(fechaSalidaMilisegundo / 1000),
        duracion: {
            segundos: tiempoQueDuroMilisegundo,
            minutos: milisegundosToMinutos(tiempoQueDuroMilisegundo),
            horas: milisegundosToMinutos(tiempoQueDuroMilisegundo) / 60
        },
        valor: (milisegundosToMinutos(tiempoQueDuroMilisegundo)) * 100
    }
    db.collection("facturas").add(factura)
        .then(function (docRef) {

            imprimirFactura(factura)
            btnRetirarVehiculo.classList.remove('is-loading')
            console.log("Document written with ID: ", docRef.id);
            return 'se gurado todo'
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
}
// Funcion princpal para el proceso de retirar vehiculo
function retirarVehiculo(placaTest) {

    const btnRetirarVehiculo = document.getElementById('btnRetirarVehiculo')
    inputPlaca = document.getElementById('inputPlaca')
    btnRetirarVehiculo.addEventListener('click', async e => {
        var placa = inputPlaca.value;
        if (placa.length) {
            btnRetirarVehiculo.classList.add('is-loading')

            let vehiculoId = await getIdByPlaca(placa ? placa : placaTest)

            const contenedorFactura = document.querySelector('#contenedorFactura')
            contenedorFactura.style.backgroundImage = "none";

            let datosVehiculos = await getDatosVehiculo(vehiculoId)
            const l = await guardarFactura(datosVehiculos)
            debugger
            let laRef = db.collection("vehiculos").doc(vehiculoId);
            debugger
            let batch = db.batch();
            batch.delete(laRef);
            batch.commit().then(function () {
                console.log('se completo esto xddddddddddd')
            });


        } else {
            alert('debes introducir un numero de placa')
        }

    })

}

// Imprime el un mensaje, segun el id del elemento que le apsemos, en caso de no parseso, tomara el contenedor
// de consulta de informacion
function ImprimirMensaje(mensaje = null, id = null) {
    if (mensaje == null) {
        mensaje = 'Lo sentimos, no se encontro ningun vehiculo con esas caracteristicas.'

    }
    if (id == null) {
        contenedorVehiculoEncontrado.innerHTML = `
         <div class="notification" id='notificationId'>
            <button class="delete" id="closeMensaje"></button>
            ${mensaje}
        </div>              
    `
    } else {
        document.getElementById(id).innerHTML = `
         <div class="notification" id='notificationId'>
            <button class="delete" id="closeMensaje"></button>
            ${mensaje}
        </div>
        <br>                 
        `
    }

    closeMensaje.addEventListener('click', e => {
        contenedorVehiculoEncontrado.innerHTML = `
        <figure class="image  is-3by2">
            <img id="imgState" src="/img/buscarVehiculo.jpg" alt="buscar vehiculos">
        </figure>
        `
    })

}

// consula los vehiculos parqueados
function ConsultarVehiculos() {

    const SelecVehiculoABuscar = document.getElementById('SelecVehiculoABuscar')
    btnBuscarVehiculo.addEventListener('click', e => {
        const InputVehiculoABuscar = document.getElementById('InputVehiculoABuscar').value
        if (InputVehiculoABuscar.length == 0) {
            alert('Por favor introduce un criterio de busqueda')
        } else {
            // cambiar la imagen a cargando
            contenedorVehiculoEncontrado.innerHTML = `
                 <figure class="image  is-3by2">
                    <img id="imgState" src="./imagenes/cargando.gif" alt="buscar vehiculos">
                </figure>
            
            `

            // LOGICA PARA OPTENER LOS DATOS.

            switch (SelecVehiculoABuscar.value) {
                case 'placa':
                    db.collection('vehiculos').where('placa', '==', InputVehiculoABuscar).get().then((ele) => {
                        console.log(ele)
                        if (ele.empty) {
                            ImprimirMensaje()
                        } else {
                            //  alert(`Se encontraron ${ele.size}`)

                            MostrarVehiculos(ele.docs)

                        }
                    })

                    break;
                case 'identificacion':

                    db.collection('vehiculos').where('propietario.identificacion', '==', InputVehiculoABuscar).get().then((ele) => {
                        console.log(ele)
                        if (ele.empty) {
                            ImprimirMensaje()
                        } else {
                            // alert(`Se encontraron ${ele.size}`)
                            MostrarVehiculos(ele.docs)
                        }
                    })
                    break;

                case 'ID':
                    db.collection('vehiculos').doc(InputVehiculoABuscar)
                        .get().then((ele) => {
                            console.log(ele)
                            if (ele.exists) {
                                MostrarVehiculos([ele])
                            } else {
                                ImprimirMensaje('El ID ingresado no corresponde a ningun vehiculo parqueado')

                            }
                        })

                    break;
                default:
                    alert('Algo muy malo paso xddddddddddddddddd')
                    break;
            }
        }

    })










}

// imprime toods los vehiculos que le pasemos como parametro
function MostrarVehiculos(vehiculos) {

    const fragmen = document.createDocumentFragment()
    const contenedorVehiculoEncontrado = document.getElementById('contenedorVehiculoEncontrado')
    vehiculos.forEach((vehiculo) => {

        const contenedorVehiculoEncontrado = document.getElementById('contenedorVehiculoEncontrado')
        let { placa, tipo, propietario, } = vehiculo.data()

        if (tipo == 1) {
            tipo = 'Automovil'
        } else if (tipo == 2) {
            tipo = 'Bicicleta'
        }

        let fecha_ingreso = new Date(vehiculo.data()['fecha-ingreso'].seconds * 1000).toLocaleDateString()

        let tr = document.createElement('tr')
        tr.innerHTML = `
                <td>${vehiculo.id}</td>
                <td>${placa}</td>
                <td>${propietario.nombre}</td>
                <td>${propietario.identificacion}</td>
                <td>${tipo}</td>
                <td>${fecha_ingreso}</td>
        `
        fragmen.appendChild(tr)
    })

    contenedorVehiculoEncontrado.innerHTML = `
          <article class="message">
           <div class="message-header">
               <p>Vehiculos Parqueados respecto a su busqueda</p>
           </div>
           <div class="message-body">
               <div class="table-container">
                   <table class="table is-bordered is-striped is-fullwidth">
                       <thead>
                           <tr>
                               <td>ID</td>
                               <td>Placa</td>
                               <td>Nom.propietario</td>
                               <td>C.C propietario</td>
                               <td>Tipo</td>
                               <td>Fecha ingreso</td>
                           </tr>
                       </thead>
                       <tbody id='tabla_body'>
                       </tbody>
                   </table>
               </div>
           </div>
   </article >
   `

    document.getElementById('tabla_body').appendChild(fragmen)



}


const showAllVehiculos = vehiculos => {
    const fragmen = document.createDocumentFragment()
    vehiculos.forEach((vehiculo) => {


        let { placa, tipo, propietario, } = vehiculo.data()

        if (tipo == 1) {
            tipo = 'Automovil'
        } else if (tipo == 2) {
            tipo = 'Bicicleta'
        }

        let fecha_ingreso = new Date(vehiculo.data()['fecha-ingreso'].seconds * 1000).toLocaleDateString()

        let tr = document.createElement('tr')
        tr.innerHTML = `
                <td>${vehiculo.id}</td>
                <td>${placa}</td>
                <td>${propietario.nombre}</td>
                <td>${propietario.identificacion}</td>
                <td>${tipo}</td>
                <td>${fecha_ingreso}</td>
        `
        fragmen.appendChild(tr)
    })

    listaVehiculosEnParquedero.innerHTML = `
          <article class="message">
           <div class="message-header">
               <p>Lista de vehiculos parqueados</p>
           </div>
           <div class="message-body">
               <div class="table-container">
                   <table class="table is-bordered is-striped is-fullwidth">
                       <thead>
                           <tr>
                               <td>ID</td>
                               <td>Placa</td>
                               <td>Nom.propietario</td>
                               <td>C.C propietario</td>
                               <td>Tipo</td>
                               <td>Fecha ingreso</td>
                           </tr>
                       </thead>
                       <tbody id='tabla_body_lista'>
                       </tbody>
                   </table>
               </div>
           </div>
   </article >

    <hr>
    <br>

   `

    document.getElementById('tabla_body_lista').appendChild(fragmen)
}

const showAllFacturas = facturas => {
    const fragmen = document.createDocumentFragment()
    facturas.forEach((vehiculo) => {


        let { placa, tipo, propietario, duracion, valor } = vehiculo.data()
        console.log(placa)
        console.log(tipo)

        console.log(propietario)
        console.log(duracion)
        console.log(valor)
        console.log(vehiculo.id)

        if (tipo == 1) {
            tipo = 'Automovil'
        } else if (tipo == 2) {
            tipo = 'Bicicleta'
        }
        let fecha_salida = new Date(vehiculo.data()['fecha-salida'] * 1000).toLocaleDateString()
        let fecha_ingreso = new Date(vehiculo.data()['fecha-ingreso'].seconds * 1000).toLocaleDateString()

        let tr = document.createElement('tr')
        tr.innerHTML = `
                <td>${vehiculo.id}</td>
                <td>${placa}</td>
                <td>${propietario.nombre}</td>
                <td>${propietario.identificacion}</td>
                <td>${tipo}</td>
                <td>${fecha_ingreso}</td>
                <td>${fecha_salida}</td>
                <td>${duracion.minutos}</td>
                <td>${valor}</td>
        `
        fragmen.appendChild(tr)
    })
    listaVehiculosEnParquedero.innerHTML = `
          <article class="message">
           <div class="message-header">
               <p>Lista de Facturas emitidas</p>
           </div>
           <div class="message-body">
               <div class="table-container">
                   <table class="table is-bordered is-striped is-fullwidth">
                       <thead>
                           <tr>
                               <td>ID</td>
                               <td>Placa</td>
                               <td>Nom.propietario</td>
                               <td>C.C propietario</td>
                               <td>Tipo</td>
                               <td>Fecha ingreso</td>
                               <td>Fecha retiro</td>
                               <td>Tiempo durado(minutos)</td>
                               <td>Valor pagado</td>
                           </tr>
                       </thead>
                       <tbody id='tabla_body_lista'>
                       </tbody>
                   </table>
               </div>
           </div>
   </article >
    <hr>
    <br>

   `
    document.getElementById('tabla_body_lista').appendChild(fragmen)
}


function MostrarTodosLosVehiculosParqueados() {

    btnListar.addEventListener('click', event => {

        listaVehiculosEnParquedero.innerHTML = 'Cargando.........................'

        let v = SelecMostrarFacturas.value
        if (v == 'Vehiculos') {
            const consultarVehiculosList = db.collection('vehiculos')
            consultarVehiculosList.get()
                .then((ele) => {
                    if (ele.empty) {
                        ImprimirMensaje()
                    } else {
                        //  alert(`Se encontraron ${ele.size}`)

                        showAllVehiculos(ele.docs)

                    }
                })
                .catch((error) => {
                    console.log(error)
                    ImprimirMensaje(`${error}`, 'listaVehiculosEnParquedero')
                })
        } else if (v == 'Facturas') {
            const consultarFacturas = db.collection('facturas')
            consultarFacturas.get()
                .then((ele) => {
                    if (ele.empty) {
                        ImprimirMensaje()
                    } else {
                        //  alert(`Se encontraron ${ele.size}`)

                        showAllFacturas(ele.docs)

                    }
                })
                .catch((error) => {
                    console.log(error)
                    ImprimirMensaje(`${error}`, 'listaVehiculosEnParquedero')
                })
        }
    })



}



ConsultarVehiculos()
retirarVehiculo()
addVehiculo()
MostrarTodosLosVehiculosParqueados()
