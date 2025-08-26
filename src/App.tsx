import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RoleProvider } from "./contexts/RoleContext";
import MainLayout from "./layouts/MainLayout";
import Clientes from "./pages/Clientes";
import Projetos from "./pages/Projetos";
import FluxoAtendimentos from "./pages/FluxoAtendimentos";
import Agenda from "./pages/Agenda";
import Relatorios from "./pages/Relatorios";
import Propostas from "./pages/Propostas";
import BibliotecaMelhorias from "./pages/BibliotecaMelhorias";
import Indicadores from "./pages/Indicadores";
import PortalCliente from "./pages/PortalCliente";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RoleProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="clientes" />} />
              <Route path="clientes" element={<Clientes />} />
              <Route path="projetos" element={<Projetos />} />
              <Route
                path="fluxo-atendimentos"
                element={<FluxoAtendimentos />}
              />
              <Route path="agenda" element={<Agenda />} />
              <Route path="relatorios" element={<Relatorios />} />
              <Route path="propostas" element={<Propostas />} />
              <Route
                path="biblioteca-melhorias"
                element={<BibliotecaMelhorias />}
              />
              <Route path="indicadores" element={<Indicadores />} />
              <Route path="portal" element={<PortalCliente />} />
              <Route path="configuracoes" element={<Configuracoes />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
