import { NextApiRequest, NextApiResponse } from "next";

type User = {
  id: number;
  name: string;
  lastname: string;
  email: string;
  avatar: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<User>) {
  res.status(200).json({
    id: 1,
    name: "João Paulo",
    lastname: "Silva",
    email: "joao@email.com",
    avatar: "https://i.pravatar.cc/150?img=3",
  });
}
