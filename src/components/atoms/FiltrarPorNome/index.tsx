import React from 'react';

interface FiltrarPorNomeProps {
    search: string;
    setSearch: (value: string) => void;
}

const FiltrarPorNome: React.FC<FiltrarPorNomeProps> = ({ search, setSearch }) => {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
            .normalize("NFD") // Decompõe os caracteres acentuados
            .replace(/[\u0300-\u036f]/g, "") // Remove os acentos
            .toLowerCase(); // Converte para minúsculas
        setSearch(value);
    };

    return (
        <input
            type="text"
            placeholder="Buscar pelo nome..."
            value={search}
            onChange={handleSearchChange}
            className="w-full max-w-lg p-3 border border-red-400 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-300"
        />
    );
};

export default FiltrarPorNome;
