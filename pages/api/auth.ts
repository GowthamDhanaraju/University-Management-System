import { NextApiRequest, NextApiResponse } from "next";
import { users } from "../../data/users"; // Import hardcoded users
import jwt from "jsonwebtoken";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, "secret", { expiresIn: "1h" });

  res.status(200).json({ token, role: user.role });
}
