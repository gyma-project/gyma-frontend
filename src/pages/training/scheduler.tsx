import ListaVagas from "@/components/atoms/VagasCard";

export default function Scheduler() {
    return (
        <div className="min-h-screen">
            <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Agendamento</h2>
                <ListaVagas /> {/* Substitui VagasCard por ListaVagas, que renderiza corretamente os cards */}
            </div>
        </div>
    );
}
