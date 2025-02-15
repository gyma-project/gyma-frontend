// FiltrarPorNome.tsx
import React from 'react';

interface FiltrarPorNomeProps {
    search: string;
    setSearch: (value: string) => void;
}

const FiltrarPorNome: React.FC<FiltrarPorNomeProps> = ({ search, setSearch }) => {
    return (
        <input
            type="text"
            placeholder="Buscar aluno pelo nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-lg p-3 border border-red-400 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-300"
            />
    );
};

export default FiltrarPorNome;
