class TheaterBooking {
  constructor() {
    this.totalSeats = 81;
    this.rows = 9;
    this.seatsPerRow = 9;
    this.reservations = new Map();
    this.selectedSeat = null;
    
    this.initializeSeats();
    this.setupEventListeners();
    this.updateReservationsList();
  }

  initializeSeats() {
    const seatingMap = document.getElementById('seating-map');
    seatingMap.innerHTML = '';

    // Comenzamos desde la última fila (I) hasta la primera (A)
    for (let row = this.rows - 1; row >= 0; row--) {
      for (let seat = 0; seat < this.seatsPerRow; seat++) {
        const seatElement = document.createElement('div');
        seatElement.className = 'seat available';
        seatElement.dataset.row = String.fromCharCode(65 + row); // A-I
        seatElement.dataset.seat = seat + 1;
        seatElement.textContent = `${String.fromCharCode(65 + row)}${seat + 1}`;
        seatingMap.appendChild(seatElement);
      }
    }
  }

  setupEventListeners() {
    document.getElementById('seating-map').addEventListener('click', (e) => {
      if (e.target.classList.contains('seat') && !e.target.classList.contains('reserved')) {
        this.handleSeatSelection(e.target);
      }
    });

    document.getElementById('booking-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleReservation();
    });

    document.getElementById('cancel-btn').addEventListener('click', () => {
      this.cancelSelection();
    });

    // Add event delegation for delete buttons
    document.querySelector('.reservations-table tbody').addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-btn')) {
        this.deleteReservation(e.target.dataset.seat);
      }
    });
  }

  deleteReservation(reservationKey) {
    // Encuentra el asiento en el mapa visual
    const seatElement = document.querySelector(`.seat[data-row="${reservationKey[0]}"][data-seat="${reservationKey.slice(1)}"]`);
    
    if (seatElement) {
      // Restaurar el estado visual del asiento
      seatElement.classList.remove('reserved');
      seatElement.classList.add('available');
    }

    // Eliminar la reservación del Map
    this.reservations.delete(reservationKey);

    // Actualizar la lista de reservaciones
    this.updateReservationsList();

    alert('Reservación eliminada exitosamente');
  }

  handleSeatSelection(seatElement) {
    // Deseleccionar asiento previo si existe
    if (this.selectedSeat) {
      this.selectedSeat.classList.remove('selected');
    }

    // Seleccionar nuevo asiento
    seatElement.classList.add('selected');
    this.selectedSeat = seatElement;

    // Actualizar formulario
    const form = document.getElementById('reservation-form');
    form.style.display = 'block';
    document.getElementById('row').value = seatElement.dataset.row;
    document.getElementById('seat').value = seatElement.dataset.seat;
  }

  handleReservation() {
    if (!this.selectedSeat) return;

    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const row = document.getElementById('row').value;
    const seat = document.getElementById('seat').value;

    // Guardar reservación
    const reservationKey = `${row}${seat}`;
    this.reservations.set(reservationKey, {
      name,
      price,
      row,
      seat
    });

    // Actualizar visualización
    this.selectedSeat.classList.remove('selected');
    this.selectedSeat.classList.add('reserved');
    this.selectedSeat = null;

    // Resetear formulario
    document.getElementById('booking-form').reset();
    document.getElementById('reservation-form').style.display = 'none';

    // Actualizar lista de reservaciones
    this.updateReservationsList();

    alert(`¡Reserva confirmada!\nNombre: ${name}\nAsiento: ${row}${seat}\nPrecio: $${price}`);
  }

  updateReservationsList() {
    const tbody = document.querySelector('.reservations-table tbody');
    tbody.innerHTML = '';

    const sortedReservations = Array.from(this.reservations.entries())
      .sort(([, a], [, b]) => {
        if (a.row !== b.row) {
          return a.row.localeCompare(b.row);
        }
        return parseInt(a.seat) - parseInt(b.seat);
      });

    sortedReservations.forEach(([key, reservation]) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${reservation.name}</td>
        <td>${reservation.row}${reservation.seat}</td>
        <td>$${reservation.price}</td>
        <td>
          <button class="delete-btn" data-seat="${key}">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  cancelSelection() {
    if (this.selectedSeat) {
      this.selectedSeat.classList.remove('selected');
      this.selectedSeat = null;
    }
    document.getElementById('booking-form').reset();
    document.getElementById('reservation-form').style.display = 'none';
  }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
  new TheaterBooking();
});