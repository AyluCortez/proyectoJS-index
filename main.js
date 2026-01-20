// === 1. DEFINICIÓN DE ESTRUCTURAS Y DATOS ===
// --- FUNCIÓN CONSTRUCTORA---
function ProductoTextil(id, nombre, precio, imagen, descripcion) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.imagen = imagen; 
    this.descripcion = descripcion;
}

// --- FUNCIÓN CONSTRUCTORA: Consultas ---
function ConsultaCliente(id, nombre, email, mensaje) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.mensaje = mensaje;
}

// --- ARRAY DE DATOS (Stock) ---
const catalogoStock = [
    new ProductoTextil(1, "Punto", 7.5, "../img/catalogo13.jpeg", "Especiales por su rinde, dejando un mayor margen de ganancia."),
    new ProductoTextil(2, "Plano", 15.9, "../img/catalogo7.jpeg", "Especifico para prendas únicas de alto nivel."),
    new ProductoTextil(3, "Sastreria", 22.0, "../img/catalogo2.jpeg", "Ideal para atuendos elegantes, con variedad de tipos."),
    new ProductoTextil(4, "Vestidos", 8.0, "../img/catalogo11.jpeg", "Exquisitos para este verano, liviano, economico y hermosos."),
    new ProductoTextil(5, "Tejidos", 30.5, "../img/tejidos20.jpeg", "Destaca tu marca por tejidos que los nacionales no pueden."),
    new ProductoTextil(6, "Gabardina", 12.5, "../img/gabardina.jpeg", "Clasicos de todos, pero ahora con renovación."),
    new ProductoTextil(7, "Estampados", 9.9, "../img/catalogo9.jpeg", "En la estación que estemos, lo van a seguir buscando.")
];



// === 2. LÓGICA PARA LA PÁGINA DE CATÁLOGO ===


const contenedorCatalogo = document.getElementById('catalogo-contenedor');

if (contenedorCatalogo) {
    
    // 1. CONTENEDOR DE ANÁLISIS 
    const contenedorAnalisis = document.createElement('section');
    contenedorAnalisis.id = 'analisis-stock-dinamico'; // Le damos un ID interno
    contenedorAnalisis.classList.add('seccion-analisis'); 
    
    const contenedorPadre = contenedorCatalogo.parentElement;
    

    contenedorPadre.insertBefore(contenedorAnalisis, contenedorCatalogo); 



    function renderizarCatalogo() {
        contenedorCatalogo.innerHTML = ''; // Limpiamos el contenido estático
        
        catalogoStock.forEach(producto => {
            // **DOM: Crear elemento principal (Tarjeta de producto)**
            let tarjeta = document.createElement('div');
            tarjeta.classList.add('objeto'); 
            
            tarjeta.innerHTML = `
                <img src="${producto.imagen}" alt="Imagen de producto textil ${producto.nombre}">
                <a href=""><h3>${producto.nombre}</h3></a>
                <p>${producto.descripcion}</p>
                <a class="btn-catalogo" id="info-${producto.id}"> <b>Más info</b></a>
            `;
            
            contenedorCatalogo.appendChild(tarjeta); 

            document.getElementById(`info-${producto.id}`).addEventListener('click', () => {
                sessionStorage.setItem('productoSeleccionadoID', producto.id);
                console.log(` ID Producto ${producto.id} guardado temporalmente.`);
                alert(`Seleccionaste ${producto.nombre}. guardado temporalmente en sesión.`);
            });
        });
        

        realizarAnalisisStock(contenedorAnalisis); 
        generarReporteStock(); 
    }


    function realizarAnalisisStock(contenedorParaInyectar) { 
        const precioLimite = 10;
        

        const productosEconomicos = catalogoStock.filter(producto => 
            producto.precio <= precioLimite
        );


        const costoTotal = productosEconomicos.reduce((acumulador, producto) => 
            acumulador + producto.precio, 0
        );
        

        contenedorParaInyectar.innerHTML = `
            <h2>Análisis Rápido de Stock</h2>
            <p>Se encontraron <b>${productosEconomicos.length}</b> tipos de telas a un precio menor o igual a $${precioLimite}.</p>
            <p>El costo total de esta selección es: <b>$${costoTotal}</b></p>
            <hr>
        `;

        console.log(` Análisis de precios completado.`);
        console.table(productosEconomicos);
    }
    


    function generarReporteStock() {
        console.log(" --- REPORTE RÁPIDO DE STOCK COMPLETO ---");
        let contador = 0;

        for (const producto of catalogoStock) {
            console.log(`Tela [${producto.id}]: ${producto.nombre} - Precio: $${producto.precio}`);
            contador++;
        }
        console.log(`Total de productos listados en el reporte: ${contador}.`);
    }

    renderizarCatalogo();
}
// === 3 FORMULARIO DE CONTACTO ===

const formularioContacto = document.getElementById('formulario-contacto'); 

if (formularioContacto) {
    
    let consultasRecibidas;
    const datosGuardados = localStorage.getItem('textileriaConsultas');

    if (datosGuardados) {
        consultasRecibidas = JSON.parse(datosGuardados);
    } else {
        consultasRecibidas = [];
    }
    console.log("Consultas cargadas:", consultasRecibidas);

    const inputNombre = document.getElementById('name'); 
    const inputEmail = document.getElementById('email');
    const inputMensaje = document.getElementById('message');

    inputNombre.addEventListener('change', (event) => {
        console.log(`El valor final del nombre es: ${event.target.value}`);
    });
    
    function manejarEnvioFormulario(e) {
        const nombreInput = inputNombre.value;
        const emailInput = inputEmail.value;
        const mensajeInput = inputMensaje.value;

        // Validamos que los campos no estén vacíos
        if (nombreInput === "") {
            alert('Por favor, complete el campo Nombre.');
            return;
        }
        if (emailInput === "") {
            alert('Por favor, complete el campo Email.');
            return;
        }
        if (mensajeInput === "") {
            alert('Por favor, complete el campo Mensaje.');
            return;
        }
        
        const nuevoId = consultasRecibidas.length + 1;
        const nuevaConsulta = new ConsultaCliente(nuevoId, nombreInput, emailInput, mensajeInput);

        consultasRecibidas.push(nuevaConsulta);

        localStorage.setItem('textileriaConsultas', JSON.stringify(consultasRecibidas));
        
        console.log(`[CONSOLA] Dato guardado en localStorage ANTES de recarga.`);
        console.table(consultasRecibidas);

    }

    // Escuchamos el evento 'submit' en el formulario porque si lo cambio el submit a botton no funcionara el formulario que se agarro de boostrap
    formularioContacto.addEventListener('submit', manejarEnvioFormulario);
}