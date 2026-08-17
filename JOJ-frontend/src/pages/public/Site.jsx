import React from 'react'

export default function Site() {
  return (
    <> 
    <header class="hero-bg h-96 flex items-center">
    <div class="max-w-7xl mx-auto px-6 w-full">
      <div class="grid md:grid-cols-2 gap-8 items-center">
        <div class="text-white">
          <h1 class="text-5xl md:text-6xl font-bold leading-tight mb-4">
            Les Sites<br/>
            <span class="text-brand-orange">Olympiques</span>
          </h1>
          <p class="text-lg text-gray-300 mb-6">Dakar · Diamniadio · Saly</p>
          <button class="bg-brand-orange hover:bg-orange-600 px-6 py-3 rounded-lg font-medium transition">
            Explorer tous les sites
          </button>
        </div>
        <div class="hidden md:block">
          <img src="https://images.unsplash.com/photo-1560965388-3c540a63d0c9?w=600&h=400&fit=crop" alt="Stade olympique" class="rounded-2xl shadow-2xl"/>
        </div>
        <div class="absolute bottom-6 right-6">
          <div class="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm">
            📅 Dakar 2026
          </div>
        </div>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-6 py-16">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold mb-4">Sites</h2>
      <p class="text-gray-600 max-w-2xl mx-auto">Sélectionnez un site pour obtenir la localisation et les informations clés.</p>
    </div>

    <div class="grid md:grid-cols-3 gap-8">
      <div class="border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition">
        <img src="https://images.unsplash.com/photo-1579952363873-27f4b3f4de58?w=400&h=300&fit=crop" alt="Complexe Iba Mar Diop" class="w-full h-48 object-cover"/>
        <div class="p-6">
          <h3 class="text-xl font-bold mb-2">Complexe Iba mar diop</h3>
          <p class="text-brand-orange text-sm mb-4">Adresse : Dakar</p>
          <button class="w-full border border-gray-300 hover:border-brand-orange hover:text-brand-orange px-4 py-2 rounded-lg transition">Voir plus détail</button>
        </div>
      </div>

      <div class="border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition">
        <img src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop" alt="Dakar Arena" class="w-full h-48 object-cover"/>
        <div class="p-6">
          <h3 class="text-xl font-bold mb-2">Dakar arena</h3>
          <p class="text-brand-orange text-sm mb-4">Adresse : Diamniadio, zone sportive</p>
          <button class="w-full border border-gray-300 hover:border-brand-orange hover:text-brand-orange px-4 py-2 rounded-lg transition">Voir plus détail</button>
        </div>
      </div>

      <div class="border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition">
        <img src="https://images.unsplash.com/photo-1596423985652-91e942e5d4c4?w=400&h=300&fit=crop" alt="Site de Saly Ouest" class="w-full h-48 object-cover"/>
        <div class="p-6">
          <h3 class="text-xl font-bold mb-2">Site de saly ouest</h3>
          <p class="text-brand-orange text-sm mb-4">Adresse : Saly Portudal, secteur événements</p>
          <button class="w-full border border-gray-300 hover:border-brand-orange hover:text-brand-orange px-4 py-2 rounded-lg transition">Voir plus détail</button>
        </div>
      </div>
    </div>

    <div class="flex justify-center items-center space-x-2 mt-12">
      <button class="p-2 hover:bg-gray-100 rounded-full"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button>
      <button class="bg-brand-orange text-white w-10 h-10 rounded-full">1</button>
      <button class="w-10 h-10 rounded-full hover:bg-gray-100">2</button>
      <button class="w-10 h-10 rounded-full hover:bg-gray-100">3</button>
      <button class="w-10 h-10 rounded-full hover:bg-gray-100">8</button>
      <button class="p-2 hover:bg-gray-100 rounded-full"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>
    </div>
  </main>
  </>
  )
}
