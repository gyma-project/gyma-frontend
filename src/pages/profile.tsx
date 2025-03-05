import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  lastname: string;
  email: string;
  bio: string;
  avatar: string;
};

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data: User) => {
        setUser(data);
        setFormData(data);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => (prev ? { ...prev, [e.target.name]: e.target.value } : null));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => (prev ? { ...prev, avatar: imageUrl } : null));
    }
  };

  const handleSave = () => {
    alert("Alterações salvas!");
    setUser(formData);
  };

  if (!user || !formData) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col items-center">
        <label htmlFor="avatar" className="cursor-pointer relative">
          <img className="w-24 h-24 rounded-full border" src={formData.avatar} alt="Avatar" />
          <span className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            Editar
          </span>
          <input type="file" id="avatar" className="hidden" accept="image/*" onChange={handleImageUpload} />
        </label>
        <input
          className="mt-4 p-2 border rounded w-full text-center"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          className="mt-4 p-2 border rounded w-full text-center"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
        />
        <input
          className="mt-2 p-2 border rounded w-full text-center"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={handleSave}>
          Salvar Alterações
        </button>
      </div>
    </div>
  );
}


