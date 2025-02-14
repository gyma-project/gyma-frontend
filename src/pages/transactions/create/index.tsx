import Input from "@/components/atoms/Input";
import PageTitle from "@/components/atoms/PageTitle";
import Textbox from "@/components/atoms/Textbox";

export default function TransactionsCreate() {
    return (
        <div>
            <PageTitle>Cadastrar transação</PageTitle>
            <div className="flex flex-col gap-5">
                <Input label="Valor" />
                <Input label="Tipo" />
                <Textbox height="60px" label="Descrição" />
                
            </div>
        </div>
    )
}