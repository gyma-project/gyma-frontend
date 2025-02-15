import { useState } from 'react';
import FiltrarPorNome from '../FiltrarPorNome';  // Verifique se o caminho está correto

const trainers = [
    {
        id: 1,
        name: 'Carlos Pereira',
        email: 'carlos.pereira@email.com',
        birthDate: '1985-03-12',
        cpf: '111.222.333-44',
        userType: 'Treinador',
    },
    {
        id: 2,
        name: 'Ana Costa',
        email: 'ana.costa@email.com',
        birthDate: '1990-09-29',
        cpf: '555.666.777-88',
        userType: 'Treinador',
    },
];

export default function Treinador() {
    const [search, setSearch] = useState('');

    const filteredTrainers = trainers.filter(trainer =>
        trainer.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <FiltrarPorNome search={search} setSearch={setSearch} />

            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                {filteredTrainers.map((trainer) => (
                    
                    <div key={trainer.id} className=" group relative p-6 border border-gray-200 bg-red-100 rounded-lg shadow-lg bg-gray-50 flex justify-between items-center">
                        <div>
                            <div
                                style={{
                                    width: "40px", height: "40px", borderRadius: "50%", background: "#e74c3c",
                                    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                                    fontWeight: "bold", marginRight: "10px"
                                }}
                            >
                                {trainer.name.charAt(0)}
                            </div>
                        </div>

                        <div className="max-w-[240px]">
                            <h3 className="text-lg font-semibold text-gray-900">{trainer.name}</h3>
                            <p className="text-sm text-gray-600">Email: {trainer.email}</p>
                            <p className="text-sm text-gray-600">Nascimento: {trainer.birthDate}</p>
                            <p className="text-sm text-gray-600">CPF: {trainer.cpf}</p>
                            <p className="text-sm text-gray-600">Tipo de usuário:
                                <p style={{
                                    backgroundColor: 'green', color: 'white', margin: "0 6px", padding: '5px 10px',
                                    display: 'inline-block', borderRadius: '5px'
                                }}>
                                    {trainer.userType}
                                </p>
                            </p>
                        </div>

                        <div className="mt-4 flex flex-col space-y-5" style={{ marginLeft: "3px" }}>
                            <img src="/icons/lapis.png" alt="Editar" style={{ width: 18, height: 18 }} />
                            <img src="/icons/lixeira.png" alt="Excluir" style={{ width: 18, height: 18 }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
