'use client';

import { useEffect, useState } from "react";

export default function RoomList() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch("/api/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Quartos Disponíveis</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.id} className="p-2 border-b">
            <strong>#{room.number}</strong> - {room.type} - R$ {room.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
