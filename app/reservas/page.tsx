'use client';
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ReservasPage() {
  const [reservas, setReservas] = useState([]); 
  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    roomId: '',
    customerId: '',
    guests: []
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const reservationsRes = await fetch("/api/reservations");
        const roomsRes = await fetch("/api/rooms");
        const customersRes = await fetch("/api/clientes");

        const reservationsData = await reservationsRes.json();
        const roomsData = await roomsRes.json();
        const customersData = await customersRes.json();

        setReservas(reservationsData);
        setRooms(roomsData);
        setCustomers(customersData);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar os dados:", error);
      }
    }

    fetchData();
  }, []);

  const handleEdit = (reserva) => {
    setSelectedReserva(reserva.id);
    setFormData({ 
      checkIn: reserva.checkIn?.split("T")[0] || '', 
      checkOut: reserva.checkOut?.split("T")[0] || '', 
      roomId: reserva.room?.id || '', 
      customerId: reserva.customer?.id || '', 
      guests: reserva.guests || []
    });
  };

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

  if (loading) {
    return <div className="text-center text-gray-600">Carregando...</div>;
  }

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
                <strong>Check-in:</strong> {reserva.checkIn?.split("T")[0]} | 
                <strong> Check-out:</strong> {reserva.checkOut?.split("T")[0]} | 
                <strong> Cliente:</strong> {reserva.customer?.name || "Não informado"} | 
                <strong> Quarto:</strong> #{reserva.room?.number || "Não informado"} | 
                <strong> Hóspedes:</strong> {reserva.guests.map((guestId) => {
                  const guest = customers.find(c => c.id === guestId);
                  return guest ? guest.name : "Desconhecido";
                }).join(", ")}
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

            <label className="text-gray-600">Hóspedes (Máx: 3):</label>
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
