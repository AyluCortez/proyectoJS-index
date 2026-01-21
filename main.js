// estructura del proyecto
function ConsultaCliente(id, nombre, email, mensaje) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.mensaje = mensaje;
}

// Estas quedan afuera para que todas las funciones puedan verlas
let productos = []; 
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// === catalogo y carrito ===
const contenedorCatalogo = document.getElementById('catalogo-contenedor');
const listaCarrito = document.getElementById('lista-carrito');
const totalCarrito = document.getElementById('total-carrito');

// funcion vista del carrito
// La sacamos del IF para que sea accesible globalmente
function actualizarVistaCarrito() {
    if (!listaCarrito || !totalCarrito) return;

    listaCarrito.innerHTML = '';
    carrito.forEach((item, index) => {
        const li = document.createElement('li');
        li.style.listStyle = "none";
        li.style.marginBottom = "5px";
        li.innerHTML = `
            ${item.nombre} - $${item.precio} 
            <button onclick="eliminarDelCarrito(${index})" style="color:red; border:none; background:none; cursor:pointer; font-weight:bold;"> [x] </button>
        `;
        listaCarrito.appendChild(li);
    });

    const total = carrito.reduce((acc, prod) => acc + prod.precio, 0);
    totalCarrito.innerText = total.toFixed(2);
}

// funcion eliminar del carrito 
window.eliminarDelCarrito = function(index) {
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarVistaCarrito(); // Ahora actualiza sin recargar la página
};

// funcion agregar al carrito
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        carrito.push(producto);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        Toastify({
            text: `¡${producto.nombre} agregado!`,
            duration: 2000,
            gravity: "top",
            position: "right",
            style: { background: "linear-gradient(to right, #00b09b, #96c93d)" }
        }).showToast();

        actualizarVistaCarrito();
    }
}

// función de análisis de stock 
function realizarAnalisisStock(lista) {
    // Buscamos el div vacío dentro del cuadro de análisis
    const divContenido = document.getElementById('analisis-contenido');
    
    if (!divContenido) return; // Si no lo encuentra, no hace nada

    const precioLimite = 10;
    
    // Filtrado de productos económicos
    const economicos = lista.filter(prod => prod.precio <= precioLimite);

    // Cálculo del costo total de esa selección
    const costoTotal = economicos.reduce((acc, prod) => acc + prod.precio, 0);

    // texto descriptivo
    divContenido.innerHTML = `
        <p>Actualmente tenemos <b>${economicos.length}</b> tipos de telas en oferta (menos de $${precioLimite}).</p>
        <p>Costo base de selección: <b>$${costoTotal.toFixed(2)}</b></p>
        <p style="font-size: 0.8em; color: gray;">* Análisis actualizado en tiempo real.</p>
    `;
}
async function obtenerProductos() {
    try {
        const response = await fetch('../productos.json'); 
        productos = await response.json();
        
        renderizarCatalogo(productos);
        actualizarVistaCarrito();
        realizarAnalisisStock(productos); 
        
    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

function renderizarCatalogo(lista) {
    if (!contenedorCatalogo) return;
    contenedorCatalogo.innerHTML = '';
    
    lista.forEach(producto => {
        let tarjeta = document.createElement('div');
        tarjeta.classList.add('objeto'); 
        tarjeta.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p><b>$${producto.precio}</b></p>
            <div class="botones-container" style="display:flex; gap:10px; justify-content:center;">
                <button class="btn-catalogo" id="btn-add-${producto.id}">Agregar</button>
                <a class="btn-catalogo" href="https://wa.me/5491128310172" target="_blank" style="text-decoration:none; background:#25d366;">WhatsApp</a>
            </div>
        `;
        contenedorCatalogo.appendChild(tarjeta);

        document.getElementById(`btn-add-${producto.id}`).addEventListener('click', () => {
            agregarAlCarrito(producto.id);
        });
    });
}

// fetch para obtener los productos
async function obtenerProductos() {
    try {
        const response = await fetch('../productos.json'); 
        productos = await response.json();
        
        const contenedorAnalisis = document.getElementById('analisis-stock-dinamico');
        
        renderizarCatalogo(productos);
        realizarAnalisisStock(productos, contenedorAnalisis);
        actualizarVistaCarrito();
    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

// inicio de la app
if (contenedorCatalogo) {
    if (!document.getElementById('analisis-stock-dinamico')) {
        const divAnalisis = document.createElement('div');
        divAnalisis.id = 'analisis-stock-dinamico';
        contenedorCatalogo.parentElement.insertBefore(divAnalisis, contenedorCatalogo);
    }
    obtenerProductos();
}
// formulario (parte de CONTACTO)

const formularioContacto = document.getElementById('formulario-contacto');

if (formularioContacto) {
    // se guarda las consultas en local storage
    let consultasRecibidas = JSON.parse(localStorage.getItem('textileriaConsultas')) || [];

    formularioContacto.addEventListener('submit', (e) => {
        e.preventDefault();


        const nombreInput = document.getElementById('name').value;
        const emailInput = document.getElementById('email').value;
        const mensajeInput = document.getElementById('message').value;
        //Valida que los campos no estén vacíos
        if (nombreInput.trim() === "" || emailInput.trim() === "" || mensajeInput.trim() === "") {
            Swal.fire({
                title: 'Error',
                text: 'Por favor, completa todos los campos correctamente.',
                icon: 'error',
                confirmButtonColor: '#d33'
            });
            return;
        }

        // Creamos el objeto de la consulta
        const nuevaConsulta = {
            id: Date.now(), 
            nombre: nombreInput,
            email: emailInput,
            mensaje: mensajeInput
        };

        // 7. Guardamos en el Array y luego en LocalStorage
        consultasRecibidas.push(nuevaConsulta);
        localStorage.setItem('textileriaConsultas', JSON.stringify(consultasRecibidas));

        //mensaje de exito !
        Swal.fire({
            title: '¡Mensaje Enviado!',
            text: `Gracias ${nombreInput}, hemos recibido tu mensaje correctamente.`,
            icon: 'success',
            confirmButtonColor: '#28a745'
        });

        // 9. Limpiamos el formulario para que quede listo para otra consulta
        formularioContacto.reset();
        
        // Opcional: ver en consola que se guardó
        console.log("Consulta guardada con éxito:", nuevaConsulta);
    });
}