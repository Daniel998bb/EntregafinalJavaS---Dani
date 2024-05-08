"use strict";

$(document).ready(function() {
    // Este código se ejecuta cuando el DOM está completamente cargado
    $("#ocultarParrafos").click(function() {
        // Este código se ejecuta cuando se hace clic en el botón con el ID #ocultarParrafos
        $("p").hide();
    });

    // Manejar clic en el botón "Mostrar párrafos"
    $("#mostrarParrafos").click(function() {
        $("p").show();
    });
});

const shopContent = document.getElementById("shopContent");
const verCarrito = document.getElementById("verCarrito");
const modalContainer = document.getElementById("modal-container");

let carrito = [];

// Función para obtener los productos desde el archivo JSON
const getProducts = async () => {
    try {
        const response = await fetch("../js/data.json");
        const data = await response.json();
        // Una vez que se obtienen los datos, puedo manipularlos y mostrar los productos
        showProducts(data);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
    }
}

// Función para mostrar los productos en la tienda en línea
const showProducts = (products) => {
    products.forEach((product) => {
        let content = document.createElement("div");
        content.className = "card";
        content.innerHTML = `
            <img src="${product.img}">
            <h3>${product.nombre}</h3>
            <p class="price">${product.precio} $</p>
        `;
        shopContent.appendChild(content);

        let comprar = document.createElement("button");
        comprar.innerText = "comprar";
        comprar.className = "comprar";
        content.appendChild(comprar);

        comprar.addEventListener("click", () => {
            // Verificar si el producto ya está en el carrito
            const existingProduct = carrito.find(item => item.id === product.id);
            if (existingProduct) {
                // Si el producto ya está en el carrito, aumentar su cantidad
                existingProduct.cantidad++;
            } else {
                // Si el producto no está en el carrito, agregarlo con cantidad 1
                carrito.push({
                    id: product.id,
                    img: product.img,
                    nombre: product.nombre,
                    precio: product.precio,
                    cantidad: 1
                });
            }
            console.log("Producto agregado al carrito:", carrito);
            guardarCarrito(); // Guardar el carrito en localStorage después de agregar un producto
            actualizarPrecioTotal(); // Actualizar el precio total
        });
    });
}

// Verificar si hay datos guardados en localStorage al cargar la página
if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
}

// Función para guardar el carrito en localStorage
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

verCarrito.addEventListener("click", () => {
    modalContainer.innerHTML = ""; // Limpiar el contenedor antes de mostrar el carrito
    modalContainer.style.display = "flex";
    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";
    modalHeader.innerHTML = `
        <h1 class="modal-header-title">Carrito.</h1>
    `;
    modalContainer.appendChild(modalHeader);

    const modalbutton = document.createElement("h1");
    modalbutton.innerText = "x";
    modalbutton.className = "modal-header-button";

    modalbutton.addEventListener("click", () => {
        modalContainer.style.display = "none";
    });

    modalHeader.appendChild(modalbutton);

    carrito.forEach((product, index) => {
        // Código para crear y agregar elementos de los productos al carrito
        let carritoContent = document.createElement("div");
        carritoContent.className = "modal-content";
        carritoContent.innerHTML = `
            <img src="${product.img}">
            <h3>${product.nombre}</h3>
            <p>${product.precio} $</p>
        `;

        // Selector de cantidad de productos
        let cantidadInput = document.createElement("input");
        cantidadInput.type = "number";
        cantidadInput.min = "1";
        cantidadInput.value = product.cantidad;
        cantidadInput.addEventListener("change", () => {
            // Actualizar la cantidad de productos en el carrito
            product.cantidad = parseInt(cantidadInput.value);
            console.log("Cantidad actualizada:", carrito);
            guardarCarrito(); // Guardar el carrito en localStorage después de actualizar la cantidad
            actualizarPrecioTotal(); // Actualizar el precio total
        });

        carritoContent.appendChild(cantidadInput);

        // Botón para eliminar productos del carrito
        let eliminarButton = document.createElement("button");
        eliminarButton.innerText = "Eliminar";
        eliminarButton.className = "eliminar-button";

        eliminarButton.addEventListener("click", () => {
            // Eliminar el producto del carrito y actualizar el precio total
            console.log("Antes de eliminar:", carrito);
            carrito = carrito.filter(item => item.id !== product.id);
            console.log("Después de eliminar:", carrito);
            carritoContent.remove();
            guardarCarrito(); // Guardar el carrito en localStorage después de eliminar un producto
            actualizarPrecioTotal(); // Actualizar el precio total
        });

        carritoContent.appendChild(eliminarButton);
        modalContainer.appendChild(carritoContent);
    });

    // Calcular el precio total y mostrarlo dentro del contenedor del carrito
    const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);
    const totalBuying = document.createElement("div");
    totalBuying.className = "total-content";
    totalBuying.innerText = `Total a pagar: ${total} $`;
    modalContainer.appendChild(totalBuying);
});

// Función para actualizar el precio total
function actualizarPrecioTotal() {
    const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);
    document.querySelector(".total-content").innerText = `Total a pagar: ${total} $`;
}

// Llamar a la función para obtener los productos cuando se cargue la página
window.addEventListener("DOMContentLoaded", () => {
    getProducts();
});
