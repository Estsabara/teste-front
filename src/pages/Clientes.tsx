import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

const contactSchema = z.object({
  nome: z.string().min(1, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().optional(),
});

const clientSchema = z.object({
  razaoNome: z.string().min(1, "Razão/Nome obrigatório"),
  documento: z.string().min(1, "CNPJ/CPF obrigatório"),
  segmento: z.string().min(1, "Segmento obrigatório"),
  tamanho: z.string().min(1, "Tamanho obrigatório"),
  numeroFuncionarios: z.coerce.number().min(0),
  contatos: z.array(contactSchema).min(1),
  cidade: z.string().min(1, "Cidade obrigatória"),
  uf: z.string().min(1, "UF obrigatória"),
  observacoes: z.string().optional(),
  documentos: z.array(z.string()).optional(),
  projetos: z.array(z.string()).optional(),
});

type ClienteForm = z.infer<typeof clientSchema>;

interface Cliente extends ClienteForm {
  id: number;
}

const availableProjects = [
  "Projeto Alpha",
  "Projeto Beta",
  "Projeto Gamma",
];

const Clientes = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<ClienteForm>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      razaoNome: "",
      documento: "",
      segmento: "",
      tamanho: "",
      numeroFuncionarios: 0,
      contatos: [{ nome: "", email: "", telefone: "" }],
      cidade: "",
      uf: "",
      observacoes: "",
      documentos: [],
      projetos: [],
    },
  });

  const { control, handleSubmit, reset } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "contatos",
  });

  const onSubmit = (data: ClienteForm) => {
    if (editingId !== null) {
      setClientes((prev) =>
        prev.map((c) => (c.id === editingId ? { ...data, id: editingId } : c)),
      );
    } else {
      setClientes((prev) => [...prev, { ...data, id: Date.now() }]);
    }
    setOpen(false);
    setEditingId(null);
    reset();
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingId(cliente.id);
    reset(cliente);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    setClientes((prev) => prev.filter((c) => c.id !== id));
  };

  const handleNovoProjeto = (id: number) => {
    navigate(`/projetos?cliente=${id}`);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                reset();
                setEditingId(null);
              }}
            >
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-screen overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Cliente" : "Novo Cliente"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={control}
                  name="razaoNome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Razão/Nome</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="documento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNPJ/CPF</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="segmento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Segmento</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="tamanho"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tamanho (porte)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="numeroFuncionarios"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nº de funcionários</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <FormLabel>Contatos</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        append({ nome: "", email: "", telefone: "" })
                      }
                    >
                      Adicionar contato
                    </Button>
                  </div>
                  {fields.map((contact, index) => (
                    <div
                      key={contact.id}
                      className="mb-2 grid grid-cols-3 gap-2"
                    >
                      <FormField
                        control={control}
                        name={`contatos.${index}.nome`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Nome" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`contatos.${index}.email`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="E-mail" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`contatos.${index}.telefone`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Telefone/WhatsApp"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="col-span-3 flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => remove(index)}
                        >
                          Remover
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="cidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="uf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UF</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={control}
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="documentos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Documentos</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(
                              e.target.files || [],
                            ).map((f) => f.name);
                            field.onChange(files);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="projetos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vincular Projetos/OS</FormLabel>
                      <div className="space-y-2">
                        {availableProjects.map((project) => (
                          <div
                            key={project}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              checked={field.value?.includes(project)}
                              onCheckedChange={(checked) => {
                                const isChecked = checked === true;
                                if (isChecked) {
                                  field.onChange([
                                    ...(field.value || []),
                                    project,
                                  ]);
                                } else {
                                  field.onChange(
                                    (field.value || []).filter(
                                      (v: string) => v !== project,
                                    ),
                                  );
                                }
                              }}
                            />
                            <span>{project}</span>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">
                    {editingId ? "Salvar" : "Criar"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      {clientes.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Razão/Nome</TableHead>
              <TableHead>CNPJ/CPF</TableHead>
              <TableHead>Segmento</TableHead>
              <TableHead>Tamanho</TableHead>
              <TableHead>Nº Funcionários</TableHead>
              <TableHead>Contatos</TableHead>
              <TableHead>Projetos</TableHead>
              <TableHead>Docs</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>{cliente.razaoNome}</TableCell>
                <TableCell>{cliente.documento}</TableCell>
                <TableCell>{cliente.segmento}</TableCell>
                <TableCell>{cliente.tamanho}</TableCell>
                <TableCell>{cliente.numeroFuncionarios}</TableCell>
                <TableCell>{cliente.contatos.length}</TableCell>
                <TableCell>{cliente.projetos?.join(", ")}</TableCell>
                <TableCell>{cliente.documentos?.length ?? 0}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="ghost" onClick={() => handleEdit(cliente)}>
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleDelete(cliente.id)}
                  >
                    Excluir
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleNovoProjeto(cliente.id)}
                  >
                    Novo Projeto/OS
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>Nenhum cliente cadastrado.</p>
      )}
    </div>
  );
};

export default Clientes;

