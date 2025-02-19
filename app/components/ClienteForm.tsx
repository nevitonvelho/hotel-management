'use client';
import { useState } from 'react';

export default function ClienteForm() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/clientes', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    });
    setFormData({ name: '', email: '', phone: '' });
  };

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Cadastrar Cliente</h2>
      <form onSubmit={handleSubmit} className='gap-3 flex flex-col'>
        <input
          type="text"
          placeholder="Nome do Cliente"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input input-bordered w-full"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="input input-bordered w-full"
        />
        <input
          type="text"
          placeholder="Telefone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-active btn-primary">Salvar</button>
      </form>
    </div>
  );
}
