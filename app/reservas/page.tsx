'use client';
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ReservasPage() {
  const [reservas, setReservas] = useState([]); 
  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [formData, setFormData] = useState({ checkIn: '', checkOut: '', roomId: '', customerId: '', guests: '1' });

  useEffect(() => {
    fetch("/api/reservations")
      .then((res) => res.json())
      .then((data) => setReservas(data));

    fetch("/api/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));

    fetch("/api/clientes")
      .then((res) => res.json())
      .then((data) => setCustomers(data));
  }, []);

  const handleEdit = (reserva) => {
    setSelectedReserva(reserva.id);
    setFormData({ 
      checkIn: reserva.checkIn.split("T")[0], 
      checkOut: reserva.checkOut.split("T")[0], 
      roomId: reserva.room.id, 
      customerId: reserva.customer.id, 
      guests: reserva.guests 
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await fetch(`/api/reservations/${selectedReserva}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    });
    setSelectedReserva(null);
    window.location.reload();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/reservations/${id}`, {
      method: 'DELETE',
    });
    window.location.reload();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">Gerenciamento de Reservas</h1>
        <Link href='/reservas/new'>
          <button className="btn btn-primary">Criar Nova Reserva</button>
        </Link>
      </div>

      <div className="bg-white shadow p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Reservas Cadastradas</h2>
        <ul>
          {reservas.map((reserva) => (
            <li key={reserva.id} className="flex justify-between items-center border-b p-2">
              <span>
                Check-in: {reserva.checkIn.split("T")[0]} | Check-out: {reserva.checkOut.split("T")[0]} | 
                Cliente: {reserva.customer?.name} | Quarto: #{reserva.room?.number} | Hóspedes: {reserva.guests}
              </span>
              <div className="flex items-center gap-4">
                <button className="btn btn-warning" onClick={() => handleEdit(reserva)}>Editar</button>
                <button className="btn btn-error" onClick={() => handleDelete(reserva.id)}>Deletar</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedReserva && (
        <div className="bg-white shadow p-4 mt-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Editar Reserva</h2>
          <form onSubmit={handleUpdate} className="gap-3 flex flex-col">
            
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

            <button type="submit" className="btn btn-active btn-primary">
              Atualizar
            </button>
            <button type="button" onClick={() => setSelectedReserva(null)} className="ml-2 text-gray-600">
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
