document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://pokeapi.co/api/v2/item/?limit=4';

    function obtenerProductos() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Asignar precios 
                data.results.forEach((producto, index) => {
                    producto.price = (index + 1) * 10; 
                });
                mostrarProductos(data.results);
            })
            .catch(error => console.error('Error al cargar los productos:', error));
    }

    function mostrarProductos(productos) {
        const productosContainer = document.getElementById('productos-container');

        productos.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto');
            productoDiv.innerHTML = `
                <h3>${producto.name}</h3>
                <p>Precio: $${producto.price}</p>
                <label for="cantidad-${producto.name}">Cantidad:</label>
                <input type="number" id="cantidad-${producto.name}" value="1" min="1">
                <button onclick="agregarAlCarrito('${producto.name}', ${producto.price}, ${producto.id})">Añadir al Carrito</button>
            `;
            productosContainer.appendChild(productoDiv);
        });
    }

// Función para agregar un artículo al carrito
window.agregarAlCarrito = function(nombre, precio, id) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const cantidad = parseInt(document.getElementById(`cantidad-${nombre}`).value);
    const subtotal = precio * cantidad;
    const productoIndex = carrito.findIndex(item => item.nombre === nombre);

    if (productoIndex !== -1) {
        // Si el producto ya está en el carrito, actualizar la cantidad
        carrito[productoIndex].cantidad += cantidad;
        carrito[productoIndex].subtotal += subtotal;
    } else {
        // Si el producto no está en el carrito, agregarlo
        carrito.push({ id: id, nombre: nombre, precio: precio, cantidad: cantidad, subtotal: subtotal });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
    mostrarTotalCarrito();

    // Mostrar SweetAlert2 cuando añado al carrito
    Swal.fire({
        icon: 'success',
        title: 'Producto añadido al carrito',
        showConfirmButton: false,
        timer: 2000
    });
};


    // mostrar los productos en el carrito
    function mostrarCarrito() {
        const carritoContainer = document.getElementById('carrito-container');
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

        carritoContainer.innerHTML = '';

        if (carrito.length === 0) {
            carritoContainer.textContent = 'El carrito está vacío';
        } else {
            carrito.forEach(producto => {
                const productoDiv = document.createElement('div');
                productoDiv.textContent = `${producto.nombre} - Cantidad: ${producto.cantidad} - Subtotal: $${producto.subtotal.toFixed(2)}`;
                carritoContainer.appendChild(productoDiv);
            });
        }
    }

    // vaciar el carrito
    window.vaciarCarrito = function() {
        localStorage.removeItem('carrito');
        mostrarCarrito();
        mostrarTotalCarrito();
    };

    //  mostrar el total del carrito
    function mostrarTotalCarrito() {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const totalCarrito = carrito.reduce((total, producto) => total + producto.subtotal, 0);
        const totalCarritoElement = document.getElementById('total-carrito');
        totalCarritoElement.textContent = `Total del carrito: $${totalCarrito.toFixed(2)}`;
    }

    obtenerProductos();
});
