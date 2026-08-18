import { Footer } from "./components/layout/Footer"
import { Header } from "./components/layout/Header"
import { Sidebar } from "./components/layout/Sidebar"
import { AjoutCategorie } from "./pages/admin/ajoutCategorie"
import CreerActualite from "./pages/admin/actualites"
function App() {
  

  return (
    <>
     <Header /> 
    <AjoutCategorie />
    {/* <CreerActualite/> */}
     <Footer />
      {/* <Header />  */}
     {/* <Sidebar/> */}
     
    </>
  )
}

export default App
