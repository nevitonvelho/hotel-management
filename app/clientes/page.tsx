'use client';
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [search, setSearch] = useState(""); // Estado para busca

  useEffect(() => {
    fetchClientes();
  }, [search]);

  const fetchClientes = async () => {
    const query = search ? `?search=${search}` : "";
    const res = await fetch(`/api/clientes${query}`);
    const data = await res.json();
    setClientes(data);
  };

  const handleEdit = (cliente) => {
    setSelectedCliente(cliente.id);
    setFormData({ name: cliente.name, email: cliente.email, phone: cliente.phone });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await fetch(`/api/clientes/${selectedCliente}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    });
    setSelectedCliente(null);
    fetchClientes(); 
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return;
  
    try {
      const res = await fetch(`/api/clientes/${id}`, { method: "DELETE" });
  
      if (!res.ok) {
        // Se houver erro, tenta ler a resposta JSON
        const errorData = await res.json().catch(() => ({ error: "Erro desconhecido" }));
        alert(errorData.error || "Erro ao deletar cliente");
        return;
      }
  
      alert("Cliente deletado com sucesso!");
  
      setClientes(clientes.filter(cliente => cliente.id !== id));
    } catch (error) {
      alert("Erro ao deletar cliente. Verifique o console.");
    }
  };
  
  

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">Gerenciamento de Clientes</h1>
        <Link href='/clientes/new'>
          <button className="btn btn-primary">Criar Novo Cliente</button>
        </Link>
      </div>

      <div className="mb-4 flex gap-3">
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered w-full"
        />
        <button onClick={fetchClientes} className="btn btn-secondary">Buscar</button>
      </div>

      <div className="bg-white shadow p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Clientes Cadastrados</h2>
        <ul>
          {clientes.map((cliente) => (
            <li key={cliente.id} className="flex justify-between items-center border-b p-2">
              <span>{cliente.name} - Email: {cliente.email} - {cliente.phone}</span>
              <div className="flex items-center gap-4">
                <button className="btn btn-warning" onClick={() => handleEdit(cliente)}>Editar</button>
                <button className="btn btn-error" onClick={() => handleDelete(cliente.id)}>Deletar</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

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
            <button type="submit" className="btn btn-primary">Atualizar</button>
            <button type="button" onClick={() => setSelectedCliente(null)} className="ml-2 text-gray-600">Cancelar</button>
          </form>
        </div>
      )}
    </div>
  );
}
