// === 1. DEFINICIÓN DE ESTRUCTURAS Y DATOS ===
// --- FUNCIÓN CONSTRUCTORA---
// === 1. DEFINICIÓN DE ESTRUCTURAS ===
function ConsultaCliente(id, nombre, email, mensaje) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.mensaje = mensaje;
}

// === 2. LÓGICA DE CATÁLOGO Y CARRITO ===
const contenedorCatalogo = document.getElementById('catalogo-contenedor');
let productos = []; // Aquí se guardará lo del JSON
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

if (contenedorCatalogo) {
    // Crear contenedor de análisis arriba
    const contenedorAnalisis = document.createElement('section');
    contenedorAnalisis.id = 'analisis-stock-dinamico';
    contenedorAnalisis.classList.add('seccion-analisis');
    contenedorCatalogo.parentElement.insertBefore(contenedorAnalisis, contenedorCatalogo);

    // --- FUNCIÓN ASINCRÓNICA (Trae los datos) ---
    async function obtenerProductos() {
        try {
            const response = await fetch('./productos.json'); 
            productos = await response.json();
            
            // Una vez que tenemos los productos, disparamos todo lo demás
            renderizarCatalogo(productos);
            realizarAnalisisStock(productos, contenedorAnalisis);
            actualizarVistaCarrito(); // Para que se vea lo que ya estaba en localStorage
        } catch (error) {
            console.error("Error cargando productos:", error);
        }
    }

    // --- RENDERIZAR TARJETAS ---
    function renderizarCatalogo(lista) {
        contenedorCatalogo.innerHTML = '';
        lista.forEach(producto => {
            let tarjeta = document.createElement('div');
            tarjeta.classList.add('objeto'); 
            tarjeta.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <p><b>$${producto.precio}</b></p>
                <button class="btn-catalogo" id="btn-add-${producto.id}">Agregar al Carrito</button>
            `;
            contenedorCatalogo.appendChild(tarjeta);

            // EVENTO PARA AGREGAR
            document.getElementById(`btn-add-${producto.id}`).addEventListener('click', () => {
                agregarAlCarrito(producto.id);
            });
        });
    }

    // --- AGREGAR AL CARRITO ---
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

    // --- ACTUALIZAR VISTA DEL CARRITO (La lista del costado) ---
    function actualizarVistaCarrito() {
        const listaCarrito = document.getElementById('lista-carrito');
        const totalCarrito = document.getElementById('total-carrito');
        if (!listaCarrito) return;

        listaCarrito.innerHTML = '';
        carrito.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${item.nombre} - $${item.precio} 
                <button onclick="eliminarDelCarrito(${index})" style="color:red; border:none; background:none; cursor:pointer;"> [x] </button>
            `;
            listaCarrito.appendChild(li);
        });

        const total = carrito.reduce((acc, prod) => acc + prod.precio, 0);
        totalCarrito.innerText = total.toFixed(2);
    }

    // Iniciar carga
    obtenerProductos();
}

// --- FUNCIÓN PARA ELIMINAR (Debe ser global para el onclick) ---
window.eliminarDelCarrito = function(index) {
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    // Necesitamos llamar a actualizarVistaCarrito, pero está dentro del IF. 
    // Lo ideal es sacarla del IF o llamarla mediante una referencia.
    location.reload(); // Forma rápida para este ejercicio, o mueve la función fuera del if.
};
// === 3 FORMULARIO DE CONTACTO ===

// 1. Seleccionamos el formulario usando su ID
const formularioContacto = document.getElementById('formulario-contacto');

if (formularioContacto) {
    // 2. Cargamos las consultas previas del LocalStorage o empezamos de cero
    let consultasRecibidas = JSON.parse(localStorage.getItem('textileriaConsultas')) || [];

    // 3. Escuchamos el evento 'submit'
    formularioContacto.addEventListener('submit', (e) => {
        // ¡ESTO ES LO MÁS IMPORTANTE! Detiene la recarga de la página
        e.preventDefault();

        // 4. Capturamos los valores de los inputs
        const nombreInput = document.getElementById('name').value;
        const emailInput = document.getElementById('email').value;
        const mensajeInput = document.getElementById('message').value;

        // 5. Validamos (aunque el HTML tiene 'required', esto asegura que no haya solo espacios)
        if (nombreInput.trim() === "" || emailInput.trim() === "" || mensajeInput.trim() === "") {
            Swal.fire({
                title: 'Error',
                text: 'Por favor, completa todos los campos correctamente.',
                icon: 'error',
                confirmButtonColor: '#d33'
            });
            return;
        }

        // 6. Creamos el objeto de la consulta
        const nuevaConsulta = {
            id: Date.now(), // Usamos la fecha como ID único
            nombre: nombreInput,
            email: emailInput,
            mensaje: mensajeInput
        };

        // 7. Guardamos en el Array y luego en LocalStorage
        consultasRecibidas.push(nuevaConsulta);
        localStorage.setItem('textileriaConsultas', JSON.stringify(consultasRecibidas));

        // 8. MOSTRAMOS EL MENSAJE DE ÉXITO (SweetAlert2)
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