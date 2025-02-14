import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import PageTitle from "@/components/atoms/PageTitle";
import Textbox from "@/components/atoms/Textbox";

export default function TransactionsCreate() {
  return (
    <div>
      <PageTitle>Cadastrar transação</PageTitle>
      <div className="flex flex-col gap-5">
        <Input
          label="Valor"
          otherInputProps={{ placeholder: "Digite o valor da transação" }}
        />
        <Input
          label="Tipo"
          otherInputProps={{ placeholder: "Digite o tipo da transação" }}
        />
        <Textbox
          height="60px"
          label="Descrição"
          otherTextboxProps={{ placeholder: "Digite uma descrição..." }}
        />
        <Button />
      </div>
    </div>
  );
}
