'use client';
import { useState, useEffect } from 'react';

export default function ReservaForm() {
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    roomId: '',
    customerId: '',
    guests: '1',
  });

  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);

  // 🔹 Carregar Quartos e Clientes disponíveis para seleção
  useEffect(() => {
    fetch("/api/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));

    fetch("/api/clientes")
      .then((res) => res.json())
      .then((data) => setCustomers(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/reservations', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    });
    setFormData({ checkIn: '', checkOut: '', roomId: '', customerId: '', guests: '1' });
  };

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Nova Reserva</h2>
      <form onSubmit={handleSubmit} className='gap-3 flex flex-col'>
        
        <label className="text-gray-600">Check-in:</label>
        <input
          type="date"
          value={formData.checkIn}
          onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
          className="input input-bordered w-full"
          required
        />

        <label className="text-gray-600">Check-out:</label>
        <input
          type="date"
          value={formData.checkOut}
          onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
          className="input input-bordered w-full"
          required
        />

        <label className="text-gray-600">Cliente:</label>
        <select
          value={formData.customerId}
          onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
          className="input input-bordered w-full"
          required
        >
          <option value="">Selecione um Cliente</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} - {customer.email}
            </option>
          ))}
        </select>

        <label className="text-gray-600">Quarto:</label>
        <select
          value={formData.roomId}
          onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
          className="input input-bordered w-full"
          required
        >
          <option value="">Selecione um Quarto</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              #{room.number} - {room.type} - R$ {room.price}
            </option>
          ))}
        </select>

        <label className="text-gray-600">Número de Hóspedes:</label>
        <input
          type="number"
          min="1"
          max="3"
          value={formData.guests}
          onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
          className="input input-bordered w-full"
          required
        />

        <button type="submit" className="btn btn-active btn-primary">Salvar Reserva</button>
      </form>
    </div>
  );
}
