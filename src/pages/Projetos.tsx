import { useState } from "react";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

const statusEtapas = [
  "Preparação",
  "Entrevista Inicial",
  "Mapeamento Rápido",
  "Relatório de Achados",
  "Proposta de Continuidade",
  "Execução/Acompanhamento",
  "Concluída/Arquivada",
] as const;

type StatusOS = (typeof statusEtapas)[number];

const prioridades = ["Baixa", "Média", "Alta"] as const;

const clientesDisponiveis = ["Cliente A", "Cliente B", "Cliente C"];

const osSchema = z.object({
  cliente: z.string().min(1, "Cliente obrigatório"),
  nomeProjeto: z.string().min(1, "Nome do projeto obrigatório"),
  objetivoInicial: z.string().min(1, "Objetivo obrigatório"),
  prioridade: z.enum(prioridades),
  dataAbertura: z.string().min(1, "Data obrigatória"),
  responsavel: z.string().min(1, "Responsável obrigatório"),
  status: z.enum(statusEtapas),
});

type OSForm = z.infer<typeof osSchema>;

interface OS extends OSForm {
  id: number;
  timeline: { etapa: StatusOS; data: string; descricao: string }[];
}

const etapaSchema = z.object({
  descricao: z.string().optional(),
  concluir: z.boolean().default(false),
});

type EtapaForm = z.infer<typeof etapaSchema>;

const proximaEtapa = (etapa: StatusOS): StatusOS => {
  const idx = statusEtapas.indexOf(etapa);
  return statusEtapas[idx + 1] ?? etapa;
};

const Projetos = () => {
  const [ordens, setOrdens] = useState<OS[]>([]);
  const [open, setOpen] = useState(false);
  const [selecionada, setSelecionada] = useState<OS | null>(null);

  const form = useForm<OSForm>({
    resolver: zodResolver(osSchema),
    defaultValues: {
      cliente: "",
      nomeProjeto: "",
      objetivoInicial: "",
      prioridade: "Média",
      dataAbertura: new Date().toISOString().substring(0, 10),
      responsavel: "",
      status: "Preparação",
    },
  });

  const etapaForm = useForm<EtapaForm>({
    resolver: zodResolver(etapaSchema),
    defaultValues: { descricao: "", concluir: false },
  });

  const onSubmit = (data: OSForm) => {
    const nova: OS = {
      ...data,
      id: Date.now(),
      timeline: [
        {
          etapa: data.status,
          data: new Date().toISOString(),
          descricao: "OS criada",
        },
      ],
    };
    setOrdens((prev) => [...prev, nova]);
    setOpen(false);
    form.reset();
  };

  const onSubmitEtapa = (data: EtapaForm) => {
    if (!selecionada) return;
    const atual = selecionada.status;
    const novaEtapa = data.concluir ? proximaEtapa(atual) : atual;
    const atualizada: OS = {
      ...selecionada,
      status: novaEtapa,
      timeline: [
        ...selecionada.timeline,
        { etapa: atual, data: new Date().toISOString(), descricao: data.descricao || "" },
      ],
    };
    setOrdens((prev) => prev.map((o) => (o.id === selecionada.id ? atualizada : o)));
    setSelecionada(atualizada);
    etapaForm.reset();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projetos/OS</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Novo OS</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Ordem de Serviço</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="cliente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um cliente" />
                          </SelectTrigger>
                          <SelectContent>
                            {clientesDisponiveis.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nomeProjeto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Projeto</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="objetivoInicial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objetivo Inicial</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prioridade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prioridade</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {prioridades.map((p) => (
                              <SelectItem key={p} value={p}>
                                {p}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dataAbertura"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Abertura</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="responsavel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsável</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {statusEtapas.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Criar</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      {ordens.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Projeto</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordens.map((os) => (
              <TableRow key={os.id}>
                <TableCell>{os.cliente}</TableCell>
                <TableCell>{os.nomeProjeto}</TableCell>
                <TableCell>{os.prioridade}</TableCell>
                <TableCell>{os.status}</TableCell>
                <TableCell>
                  <Button variant="outline" onClick={() => setSelecionada(os)}>
                    Acompanhar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>Nenhuma OS cadastrada.</p>
      )}

      {selecionada && (
        <div className="space-y-4 border rounded-md p-4">
          <h2 className="text-xl font-semibold">
            Acompanhamento: {selecionada.nomeProjeto}
          </h2>
          <p>Status atual: {selecionada.status}</p>
          <Form {...etapaForm}>
            <form
              onSubmit={etapaForm.handleSubmit(onSubmitEtapa)}
              className="space-y-4"
            >
              <FormField
                control={etapaForm.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações da etapa</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={etapaForm.control}
                name="concluir"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mb-0">Concluir etapa</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Salvar</Button>
            </form>
          </Form>
          <div>
            <h3 className="font-medium">Timeline de atividades</h3>
            <ul className="list-disc pl-5 space-y-1">
              {selecionada.timeline.map((t, i) => (
                <li key={i}>
                  {format(new Date(t.data), "dd/MM/yyyy HH:mm")} - {t.etapa}
                  {t.descricao ? `: ${t.descricao}` : ""}
                </li>
              ))}
            </ul>
          </div>
          <Button variant="ghost" onClick={() => setSelecionada(null)}>
            Fechar
          </Button>
        </div>
      )}
    </div>
  );
};

export default Projetos;
