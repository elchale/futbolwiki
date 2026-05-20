import { BookOpen, ShieldCheck, Database, Globe, MessageCircle } from "lucide-react";
import { PageShell } from "@/components/common/page-shell";
import { PageHeader } from "@/components/common/page-header";

export const metadata = { title: "Sobre el proyecto" };

export default function SobrePage() {
  return (
    <PageShell width="content" className="space-y-10">
      <PageHeader
        eyebrow="Acerca de"
        title="Sobre el proyecto"
        subtitle="Una enciclopedia del fútbol, en español, con fuentes verificadas."
      />

      <div className="space-y-6 text-base leading-relaxed">
        <p>
          <strong>Fútbol Wiki</strong> es un proyecto que reúne historia, datos
          y contexto del fútbol — desde la Liga 1 del Perú hasta los torneos
          internacionales más grandes — todo en español y con fuentes citadas.
        </p>

        <Card icon={ShieldCheck} title="Fuentes verificadas">
          Cada dato relevante en el wiki tiene al menos una fuente asociada
          —Wikipedia, sitios oficiales, federaciones, prensa especializada—
          y un indicador visual de su nivel de verificación. Hacé click en el
          ícono de fuente que ves junto a cada hecho para ver el enlace original.
        </Card>

        <Card icon={Database} title="Contenido estático, actualizable">
          El sitio se sirve como contenido estático para garantizar velocidad.
          Cuando hay nueva información, ejecutamos las tareas de carga y el
          wiki se reconstruye automáticamente.
        </Card>

        <Card icon={Globe} title="Idioma">
          Todo el contenido del sitio está en español. En el futuro podríamos
          sumar inglés y portugués, pero la prioridad siempre es la calidad
          del español rioplatense / sudamericano para el contenido local.
        </Card>

        <Card icon={BookOpen} title="Cobertura inicial">
          La versión 1 cubre en detalle la Liga 1 del Perú, la Selección Peruana
          y los principales clubes europeos. En las siguientes iteraciones
          ampliaremos el corpus a Liga 2, Liga 3, Copa Perú, más torneos
          internacionales y la historia completa de cada institución.
        </Card>

        <Card icon={MessageCircle} title="Errores y sugerencias">
          Si encontrás un dato impreciso o una fuente caída, podés reportarlo y
          lo vamos corrigiendo en futuras actualizaciones.
        </Card>
      </div>
    </PageShell>
  );
}

function Card({ icon: Icon, title, children }: { icon: typeof BookOpen; title: string; children: React.ReactNode }) {
  return (
    <section className="flex gap-4 rounded-xl border border-border bg-card p-5">
      <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" aria-hidden />
      </span>
      <div>
        <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{children}</p>
      </div>
    </section>
  );
}
