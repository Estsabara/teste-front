import { Link } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";

const navItems = [
  { to: "/clientes", label: "Clientes", roles: ["consultor", "gestor"] },
  { to: "/projetos", label: "Projetos/OS", roles: ["consultor", "gestor"] },
  {
    to: "/fluxo-atendimentos",
    label: "Fluxo de Atendimentos",
    roles: ["consultor", "gestor"],
  },
  { to: "/agenda", label: "Agenda", roles: ["consultor", "gestor"] },
  { to: "/relatorios", label: "Relatórios", roles: ["consultor", "gestor"] },
  { to: "/propostas", label: "Propostas", roles: ["consultor", "gestor"] },
  {
    to: "/biblioteca-melhorias",
    label: "Biblioteca de Melhorias",
    roles: ["consultor", "gestor"],
  },
  { to: "/indicadores", label: "Indicadores", roles: ["consultor", "gestor"] },
  { to: "/portal", label: "Portal do Cliente", roles: ["cliente", "gestor"] },
  { to: "/configuracoes", label: "Configurações", roles: ["gestor"] },
];

const Sidebar = () => {
  const { role } = useRole();
  return (
    <aside className="w-64 bg-gray-100 p-4">
      <h2 className="mb-4 text-xl font-bold">Consultorias</h2>
      <nav className="space-y-2">
        {navItems
          .filter((item) => item.roles.includes(role))
          .map((item) => (
            <Link key={item.to} to={item.to} className="block hover:underline">
              {item.label}
            </Link>
          ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

