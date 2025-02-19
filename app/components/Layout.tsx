'use client';

import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <Link href={'/'} className="flex items-center gap-3">
            <div className="w-[50px]">
              <img className="w-full h-full" src="hotel.png" alt="" />
            </div>
            <h1 className="text-xl font-bold">Hotel Gerenciamento</h1>
          </Link>

        <div className="flex items-center gap-4">
          <Link href='/rooms' className="flex flex-col items-center"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3s1.34 3 3 3m12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4"/></svg>Quartos</Link>
          <Link href='/clientes' className="flex flex-col items-center"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M14 20v-1.25q0-.4.163-.763t.437-.637l4.925-4.925q.225-.225.5-.325t.55-.1q.3 0 .575.113t.5.337l.925.925q.2.225.313.5t.112.55t-.1.563t-.325.512l-4.925 4.925q-.275.275-.637.425t-.763.15H15q-.425 0-.712-.288T14 20M4 19v-1.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13q.925 0 1.825.113t1.8.362l-2.75 2.75q-.425.425-.65.975T12 18.35V20H5q-.425 0-.712-.288T4 19m16.575-3.6l.925-.975l-.925-.925l-.95.95zM12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12"/></svg>Clientes</Link>
          <Link href='/reservas' className="flex flex-col items-center"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M15 3v2h-2v1.05c5.053.501 9 4.765 9 9.95H2c0-5.185 3.947-9.449 9-9.95V5H9V3zm8 17v-2H1v2z"/></svg>Reservas</Link>
        </div>
      </nav>
      <div className="container mx-auto p-4">{children}</div>
    </div>
  );
}
