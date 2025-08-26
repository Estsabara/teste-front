import { Role, useRole } from "@/contexts/RoleContext";

const RoleSelector = () => {
  const { role, setRole } = useRole();
  return (
    <select
      className="border p-2"
      value={role}
      onChange={(e) => setRole(e.target.value as Role)}
    >
      <option value="consultor">Consultor</option>
      <option value="gestor">Gestor</option>
      <option value="cliente">Cliente</option>
    </select>
  );
};

export default RoleSelector;

