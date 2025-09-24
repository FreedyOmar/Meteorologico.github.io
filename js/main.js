function redirigir() {
    window.location.href = "inicio.html"; 
}

// Función para crear una card
function crearCardClima(ciudad, temperatura, descripcion, icono) {
    let fecha = new Date();
    let opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: "2-digit", minute: "2-digit" };
    let fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);

    return `
        <div class="card" data-ciudad="${ciudad}">
            <div class="card__icon"><i class="fas fa-${icono}"></i></div>
            <h2 class="card__title">${ciudad}</h2>
            <p class="card__info">📅 ${fechaFormateada}</p>
            <p class="card__info">🌡️ ${temperatura}°C</p>
            <p class="card__info">☁️ ${descripcion}</p>
            <div class="details"></div>
        </div>
    `;
}

$(document).ready(function() {
    const ciudades = [ "Daule"];
    const apiKey = "b8beeefa1a7b28349e7e2f3046e47b08";

    // Función para cargar clima de una ciudad
    function cargarClima(ciudad) {
        $.getJSON(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad},EC&appid=${apiKey}&units=metric&lang=es`, function(data) {
            let nombre = data.name;
            let temp = Math.round(data.main.temp);
            let desc = data.weather[0].description;
            let icono = "cloud";

            let card = crearCardClima(nombre, temp, desc, icono);
            $("#cards").append(card);
        }).fail(function() {
            alert("⚠️ No se encontró la ciudad: " + ciudad);
        });
    }

    // Cargar tarjetas iniciales
    ciudades.forEach(ciudad => cargarClima(ciudad));

    // Click en tarjeta para ver detalles
    $(document).on("click", ".card", function() {
        let ciudad = $(this).data("ciudad");
        let $details = $(this).find(".details");

        if ($details.is(":visible")) {
            $details.slideUp();
            return;
        }

        $.getJSON(`https://api.openweathermap.org/data/2.5/forecast?q=${ciudad},EC&appid=${apiKey}&units=metric&lang=es`, function(data) {
            let humedad = data.list[0].main.humidity;
            let viento = data.list[0].wind.speed;
            let lluvia = data.list[0].pop * 100;

            let pronostico = "";
for (let i = 0; i < 5; i++) {  // 🔹 Ahora son 5 días
    let dia = new Date(data.list[i * 8].dt * 1000); // cada 8 intervalos ≈ 1 día
    let diaSemana = dia.toLocaleDateString("es-ES", { weekday: "long" });

    let tempMax = Math.round(data.list[i * 8].main.temp_max);
    let tempMin = Math.round(data.list[i * 8].main.temp_min);
    let humedadDia = data.list[i * 8].main.humidity;
    let vientoDia = data.list[i * 8].wind.speed;
    let lluviaDia = Math.round(data.list[i * 8].pop * 100);
    let desc = data.list[i * 8].weather[0].description;

    pronostico += `
        <div class="forecast-day">
            <p>📆 <strong>${diaSemana}</strong></p>
            <p>🌡️ Max: ${tempMax}°C | Min: ${tempMin}°C</p>
            <p>☁️ ${desc}</p>
            <p>💧 Humedad: ${humedadDia}%</p>
            <p>💨 Viento: ${vientoDia} km/h</p>
            <p>🌧️ Prob. lluvia: ${lluviaDia}%</p>
        </div>
        <hr>
    `;
}


            $details.html(`
                <p>💧 Humedad: ${humedad}%</p>
                <p>💨 Viento: ${viento} km/h</p>
                <p>🌧️ Prob. lluvia: ${lluvia}%</p>
                <h4>Pronóstico:</h4>
                ${pronostico}
            `);

            $details.slideDown();
        });
    });

    // 🔍 Buscar ciudad con botón o Enter
    $("#btnBuscar").on("click", function() {
        let ciudad = $("#buscarCiudad").val().trim();
        if (ciudad) {
            $("#cards").html(""); // Limpia resultados anteriores
            cargarClima(ciudad);
        }
    });

    $("#buscarCiudad").on("keypress", function(e) {
        if (e.which === 13) { // Enter
            $("#btnBuscar").click();
        }
    });
});
