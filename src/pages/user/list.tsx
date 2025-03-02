import Usuarios from "@/components/atoms/Usuarios"

export default function List() {
    return (
        <div className="min-h-screen">
            <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900" style={{marginBottom: "10px"}}>Lista de Usuários</h2>
                <Usuarios />
            </div>
        </div>
    )
}