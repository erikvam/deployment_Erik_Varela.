// Array con diferentes precios para la comparación (ejemplo en COP)
const preciosComparacion = [
    { nombre: 'Precio Actual', precio: 0 }, 
    { nombre: 'Primax', precio: 4332 },
    { nombre: 'Terpel', precio: 4329 },
    { nombre: 'Texaco', precio: 4345 }
];

// Función de formato de moneda
const formatCurrency = (amount) => {
    // Retorna el valor formateado con separadores de miles y dos decimales
    return `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};


function calcularConsumo() {
    // 1. Obtener y validar valores
    const kmRecorridos = parseFloat(document.getElementById('kmRecorridos').value);
    const litrosConsumidos = parseFloat(document.getElementById('litrosConsumidos').value);
    const precioLitro = parseFloat(document.getElementById('precioLitro').value);

    if (isNaN(kmRecorridos) || isNaN(litrosConsumidos) || isNaN(precioLitro) || 
        kmRecorridos <= 0 || litrosConsumidos <= 0 || precioLitro <= 0) {
        
        document.getElementById('consumoPromedio').textContent = '--';
        document.getElementById('costoKm').textContent = '--';
        document.getElementById('costoTotal').textContent = '--';
        document.getElementById('comparadorResultados').innerHTML = '<p class="initial-msg">Ingresa valores válidos y positivos.</p>';
        return;
    }

    // 2. CÁLCULOS PRINCIPALES
    const consumoPromedio = kmRecorridos / litrosConsumidos;
    const costoTotalViaje = litrosConsumidos * precioLitro;
    const costoPorKm = costoTotalViaje / kmRecorridos; 
    
    // 3. Mostrar Resultados Principales
    document.getElementById('consumoPromedio').textContent = `${consumoPromedio.toFixed(2)} km/l`;
    document.getElementById('costoKm').textContent = formatCurrency(costoPorKm);
    document.getElementById('costoTotal').textContent = formatCurrency(costoTotalViaje);


    // 4. COMPARADOR CON DIFERENTES PRECIOS
    let comparadorHTML = '';
    let menorCosto = Infinity;
    let mejorOpcion = '';
    
    // Clonar el array para usar el precio actual sin modificar la lista original
    const comparador = JSON.parse(JSON.stringify(preciosComparacion));
    comparador[0].precio = precioLitro; // El primer elemento toma el precio ingresado por el usuario

    // Añadir una cabecera para las columnas (para el diseño grid del CSS)
    comparadorHTML += `
        <div class="comparador-header">
            <p><strong>Estación</strong></p>
            <p><strong>Precio Litro</strong></p>
            <p><strong>Costo Total</strong></p>
        </div>
    `;

    comparador.forEach(item => {
        const costoViajeComparado = litrosConsumidos * item.precio;
        const costoFormateado = formatCurrency(costoViajeComparado);
        const precioLitroFormateado = formatCurrency(item.precio); // Formato de moneda para el precio por litro
        
        // Determinar la mejor opción
        if (costoViajeComparado < menorCosto) {
            menorCosto = costoViajeComparado;
            mejorOpcion = item.nombre;
        }

        // Generar el HTML con las tres columnas
        comparadorHTML += `
            <div class="comparador-item" data-nombre="${item.nombre}">
                <p><strong>${item.nombre}</strong></p>
                <p class="precio-litro">${precioLitroFormateado}</p>
                <p class="costo-total">${costoFormateado}</p>
            </div>
        `;
    });

    // 5. Actualizar el HTML del comparador
    
    // Mensaje de la mejor opción
    const resultadoMejor = `<p class="best-option-msg">¡Mejor Opción: ${mejorOpcion}!</p>`;
    
    document.getElementById('comparadorResultados').innerHTML = resultadoMejor + comparadorHTML;

    // Resaltar la mejor opción
    const items = document.querySelectorAll('.comparador-item');
    items.forEach(item => {
        if (item.getAttribute('data-nombre') === mejorOpcion) {
             item.classList.add('highlight');
        }
    });
}

// Ejecuta la función al cargar la página (para mostrar resultados iniciales)
window.onload = function() {
    calcularConsumo();
};