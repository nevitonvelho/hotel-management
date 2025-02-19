'use client';
import Link from "next/link";
import { useEffect, useState } from "react";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({ number: '', type: '', price: '' });

  useEffect(() => {
    fetch("/api/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));
  }, []);

  const handleEdit = (room) => {
    setSelectedRoom(room.id);
    setFormData({ number: room.number, type: room.type, price: room.price });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await fetch(`/api/rooms/${selectedRoom}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    });
    setSelectedRoom(null);
    window.location.reload();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/rooms/${id}`, {
      method: 'DELETE',
    });
    window.location.reload();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold ">Gerenciamento de Quartos</h1>
        </div>
        <Link href='/rooms/new'>
          <button className="btn btn-primary">Criar Novo Registro</button>
        </Link>
      </div>

      <div className="bg-white shadow p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Quartos Cadastrados</h2>
        <ul>
          {rooms.map((room) => (
            <li key={room.id} className="flex justify-between items-center border-b p-2">
              <span>#{room.number} - {room.type} - R$ {room.price}</span>
              <div className="flex items-center gap-4">
                <button
                  className="btn btn-warning"
                  onClick={() => handleEdit(room)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-error"
                  onClick={() => handleDelete(room.id)}
                >
                  Deletar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedRoom && (
        <div className="bg-white shadow p-4 mt-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Editar Quarto</h2>
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              placeholder="Número do Quarto"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Tipo de Quarto"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="number"
              placeholder="Preço"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full p-2 border rounded mb-2"
            />
            <button type="submit" className="btn btn-active btn-primary">
              Atualizar
            </button>
            <button
              onClick={() => setSelectedRoom(null)}
              className="ml-2 text-gray-600"
            >
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
