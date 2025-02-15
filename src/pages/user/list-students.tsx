import Aluno from "@/components/atoms/Aluno"

export default function ListStudents() {
    return (
        <div className="min-h-screen">
            <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900" style={{marginBottom: "10px"}}>Lista de Alunos</h2>
                <Aluno />
            </div>
        </div>
    )
}