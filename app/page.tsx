import DashboardCharts from "./components/DashboardCharts";

export default function Home() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard do Hotel</h1>
      <DashboardCharts />
    </div>
  );
}
