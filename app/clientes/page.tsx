'use client';
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]); // ✅ Corrigido nome do estado
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  // 🔹 Carregar clientes
  useEffect(() => {
    fetch("/api/clientes")
      .then((res) => res.json())
      .then((data) => setClientes(data));
  }, []);

  // 🔹 Editar cliente
  const handleEdit = (cliente) => {
    setSelectedCliente(cliente.id);
    setFormData({ name: cliente.name, email: cliente.email, phone: cliente.phone });
  };

  // 🔹 Atualizar cliente
  const handleUpdate = async (e) => {
    e.preventDefault();
    await fetch(`/api/clientes/${selectedCliente}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    });
    setSelectedCliente(null);
    window.location.reload();
  };

  // 🔹 Deletar cliente
  const handleDelete = async (id) => {
    await fetch(`/api/clientes/${id}`, {
      method: 'DELETE',
    });
    window.location.reload();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold">Gerenciamento de Clientes</h1>
        </div>
        <Link href='/clientes/new'>
          <button className="btn btn-primary">Criar Novo Cliente</button>
        </Link>
      </div>

      {/* 🔹 Lista de Clientes */}
      <div className="bg-white shadow p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Clientes Cadastrados</h2>
        <ul>
          {clientes.map((cliente) => (
            <li key={cliente.id} className="flex justify-between items-center border-b p-2">
              <span>{cliente.name} - Email: {cliente.email} - {cliente.phone}</span>
              <div className="flex items-center gap-4">
                <button
                  className="btn btn-warning"
                  onClick={() => handleEdit(cliente)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-error"
                  onClick={() => handleDelete(cliente.id)}
                >
                  Deletar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 🔹 Formulário de Edição */}
      {selectedCliente && (
        <div className="bg-white shadow p-4 mt-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Editar Cliente</h2>
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              placeholder="Nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Telefone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2 border rounded mb-2"
            />
            <button type="submit" className="btn btn-active btn-primary">
              Atualizar
            </button>
            <button
              type="button"
              onClick={() => setSelectedCliente(null)}
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
