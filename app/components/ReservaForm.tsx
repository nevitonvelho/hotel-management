'use client';
import { useState, useEffect } from 'react';

export default function ReservaForm() {
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    roomId: '',
    customerId: '',
    guests: [],
  });

  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetch("/api/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));

    fetch("/api/clientes")
      .then((res) => res.json())
      .then((data) => setCustomers(data));
  }, []);

  const handleGuestSelection = (customerId) => {
    let updatedGuests = [...formData.guests];

    if (updatedGuests.includes(customerId)) {
      updatedGuests = updatedGuests.filter(id => id !== customerId);
    } else {
      if (updatedGuests.length < 3) {
        updatedGuests.push(customerId);
      } else {
        alert("Máximo de 3 hóspedes por quarto.");
      }
    }

    setFormData({ ...formData, guests: updatedGuests });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/reservations', { 
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      alert(error.error || "Erro ao criar reserva");
      return;
    }

    setFormData({ checkIn: '', checkOut: '', roomId: '', customerId: '', guests: [] });
  };

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Nova Reserva</h2>
      <form onSubmit={handleSubmit} className='gap-3 flex flex-col'>

        <label>Check-in:</label>
        <input
          type="date"
          value={formData.checkIn}
          onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
          required
          className="input input-bordered w-full"
        />

        <label>Check-out:</label>
        <input
          type="date"
          value={formData.checkOut}
          onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
          required
          className="input input-bordered w-full"
        />

        <label>Cliente (Pagante):</label>
        <select
          value={formData.customerId}
          onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
          required
          className="input input-bordered w-full"
        >
          <option value="">Selecione um Cliente</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} - {customer.email}
            </option>
          ))}
        </select>

        <label>Hóspedes (Máx: 3):</label>
        <div className="flex flex-wrap gap-2">
          {customers.map((customer) => (
            <label key={customer.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.guests.includes(customer.id)}
                onChange={() => handleGuestSelection(customer.id)}
                className="checkbox checkbox-primary"
              />
              {customer.name}
            </label>
          ))}
        </div>

        <label>Quarto:</label>
        <select
          value={formData.roomId}
          onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
          required
          className="input input-bordered w-full"
        >
          <option value="">Selecione um Quarto</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              #{room.number} - {room.type} - R$ {room.price}
            </option>
          ))}
        </select>

        <button type="submit" className="btn btn-primary">Criar Reserva</button>
      </form>
    </div>
  );
}
