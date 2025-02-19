import ReservaForm from "../../components/ReservaForm";

export default function ReservaPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Quartos</h1>
      <ReservaForm />
    </div>
  );
}
