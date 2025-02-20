'use client';
import Link from "next/link";
import { useEffect, useState } from "react";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [searchType, setSearchType] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({ number: '', type: '', price: '' });

  useEffect(() => {
    fetchRooms();
  }, [searchType, searchStatus]);

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRooms = async () => {
    let query = "";
    if (searchType) query += `?type=${searchType}`;
    if (searchStatus) query += `${query ? "&" : "?"}status=${searchStatus}`;

    const res = await fetch(`/api/rooms${query}`);
    const data = await res.json();
    setRooms(data);
  };

  const fetchRoomTypes = async () => {
    const res = await fetch(`/api/rooms/types`);
    const data = await res.json();
    setRoomTypes(data);
  };

  const handleEdit = (room) => {
    setSelectedRoom(room.id);
    setFormData({ number: room.number, type: room.type, price: room.price });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/rooms/${selectedRoom}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      setSelectedRoom(null);
      fetchRooms(); 
    } else {
      alert("Erro ao atualizar o quarto.");
    }
  };

  const handleDelete = async (id) => {
    await fetch(`/api/rooms/${id}`, { method: 'DELETE' });
    fetchRooms(); 
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">Gerenciamento de Quartos</h1>
        <Link href='/rooms/new'>
          <button className="btn btn-primary">Criar Novo Quarto</button>
        </Link>
      </div>

      <div className="mb-4 flex gap-3">
        <select
          className="input input-bordered"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="">Todos os Tipos</option>
          {roomTypes.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </select>

        <select
          className="input input-bordered"
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="available">Disponível</option>
          <option value="occupied">Ocupado</option>
        </select>

      </div>

      <div className="bg-white shadow p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Quartos Cadastrados</h2>
        <ul>
          {rooms.map((room) => (
            <li key={room.id} className={`flex justify-between items-center border-b p-2 ${room.isOccupied ? 'bg-red-200' : ''}`}>
              <span>
                #{room.number} - {room.type} - R$ {room.price} - 
                <strong className={room.isOccupied ? 'text-red-600' : 'text-green-600'}>
                  {room.isOccupied ? " Ocupado" : " Disponível"}
                </strong>
              </span>
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
              required
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-2 border rounded mb-2"
              required
            >
              <option value="">Selecione um Tipo</option>
              {roomTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Preço"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full p-2 border rounded mb-2"
              required
            />
            <button type="submit" className="btn btn-primary">Atualizar</button>
            <button
              type="button"
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
