document.addEventListener('DOMContentLoaded', function () {
  const confirmar = document.getElementById('botonconfirmar');

  const checkboxes = document.querySelectorAll('.skill-checkbox');
  const maxAllowed = 3;
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      const checkedCheckboxes = document.querySelectorAll('.skill-checkbox:checked');
      if (checkedCheckboxes.length > maxAllowed) {
        this.checked = false;
        alert('Solo puedes seleccionar hasta 3 habilidades.');
      }
    });
  });

  if (confirmar) {
    confirmar.addEventListener('click', function (e) {
      e.preventDefault();

      // Obtener los datos del formulario
      const nombre = document.getElementById('nombre').value;
      const profesion = document.getElementById('profesion').value;
      const telefono = document.getElementById('telefono').value;
      const correo = document.getElementById('correo').value;
      const linkedIn = document.getElementById('linkedIn').value;

      // Obtener habilidades seleccionadas
      const habilidades = Array.from(document.querySelectorAll('.skill-checkbox:checked')).map(checkbox => checkbox.value);

      // Enviar los datos al servidor
      fetch('http://127.0.0.1:3000/guardarDatos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, profesion, telefono, correo, linkedIn, habilidades })
      })
      .then(response => response.text())
      .then(data => {
        console.log(data);
        window.location.href = 'indextar.html';
      })
      .catch(error => console.error('Error:', error));
    });
  }

  // Obtener datos para mostrar en la tarjeta
  fetch('http://127.0.0.1:3000/obtenerDatos')
  .then(response => response.json())
  .then(data => {
    console.log('Datos recibidos para la tarjeta:', data); // Mensaje de depuración

    // Asegúrate de que los elementos del DOM existen
    const campoNombre = document.getElementById('campoNombre');
    const campoProfesion = document.getElementById('campoProfesion');
    const campoTelefono = document.getElementById('campoTelefono');
    const campoCorreo = document.getElementById('campoCorreo');
    const campoLinkedIn = document.getElementById('campoLinkedIn');
    const habilidadesTarjeta = document.getElementById('habilidades-tarjeta');
    const tarjeta = document.querySelector('.tarjeta');

    if (campoNombre && campoProfesion && campoTelefono && campoCorreo && campoLinkedIn && habilidadesTarjeta) {
      campoNombre.textContent = data.nombre;
      campoProfesion.textContent = data.profesion;
      campoTelefono.textContent = data.telefono;
      campoCorreo.textContent = data.correo;
      campoLinkedIn.textContent = data.linkedIn;

      // Mostrar habilidades en la tarjeta
      if (data.habilidades && data.habilidades.length > 0) {
        habilidadesTarjeta.innerHTML = data.habilidades.map(habilidad => `<span>${habilidad}</span>`).join(', ');
      } else {
        habilidadesTarjeta.textContent = 'No se han cargado habilidades';
      }

      // Mostrar la tarjeta
      tarjeta.style.display = 'block';
    } else {
      console.error('Uno o más elementos del DOM no se encontraron');
    }
  })
  .catch(error => console.error('Error al obtener los datos:', error));
});
document.getElementById('btnHome').addEventListener('click', function() {
  // Redirigir al usuario al home
  window.location.href = 'index.html'; // Reemplaza 'index.html' con la URL de tu página de inicio
});