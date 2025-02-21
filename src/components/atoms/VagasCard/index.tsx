interface VagasCard {
    horario: string;
    alunosAtuais: number;
    capacidadeTotal: number;
}

export default function VagasCard({ horario, alunosAtuais, capacidadeTotal }: VagasCard) {
    return (
        <div className="flex justify-between items-center p-6 bg-red-50 rounded-2xl shadow-md w-full max-w-md border border-red-200">
            <div>
                <h2 className="text-xl font-semibold text-red-500">{horario}</h2>
                <p className="text-md font-bold text-red-500 mt-2">
                    Quantidade de Alunos: <span className="text-black">{alunosAtuais}/{capacidadeTotal}</span>
                </p>
            </div>

            <div className="flex flex-col space-y-3 text-red-500">
                <div className="mt-4 flex flex-col space-y-10">
                           <img src="/images/icon-olho.png" alt="Abrir" style={{ width: 18, height: 18 }} />
                           <img src="/images/icon-lixeira.png" alt="Excluir" style={{ width: 18, height: 18 }} />
                </div>
            </div>
        </div>
    );
}
