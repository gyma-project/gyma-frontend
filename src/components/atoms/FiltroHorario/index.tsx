interface FiltroHorarioProps {
    filtroHorario: string;
    setFiltroHorario: (horario: string) => void;
    horariosDisponiveis: string[];
}

const FiltroHorario = ({ filtroHorario, setFiltroHorario, horariosDisponiveis }: FiltroHorarioProps) => (
    <select
        className="border border-black rounded-md p-2 h-9 text-sm mt-2 md:mt-0"
        value={filtroHorario}
        onChange={(e) => setFiltroHorario(e.target.value)}
    >
        <option value="">Horários disponíveis</option>
        {horariosDisponiveis.map((horario) => (
            <option key={horario} value={horario}>
                {horario}
            </option>
        ))}
    </select>
);

export default FiltroHorario;
