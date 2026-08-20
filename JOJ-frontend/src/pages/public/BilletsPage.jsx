import React from "react";
import Billets from "../../components/billets";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";

export default function BilletsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
      <Header />
      <main className="flex-1 py-8">
        <Billets />
      </main>
      <Footer />
    </div>
  );
}
