'use client';
import { useState } from 'react';

export default function RoomForm() {
  const [formData, setFormData] = useState({ number: '', type: '', price: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/rooms', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    });
    setFormData({ number: '', type: '', price: '' });
  };

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Cadastrar Quarto</h2>
      <form onSubmit={handleSubmit} className='gap-3 flex flex-col'>
        <input
          type="text"
          placeholder="Número do Quarto"
          value={formData.number}
          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
          className="input input-bordered w-full"
        />
        <input
          type="text"
          placeholder="Tipo de Quarto"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="input input-bordered w-full"
        />
        <input
          type="number"
          placeholder="Preço"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-active btn-primary">Salvar</button>
      </form>
    </div>
  );
}
