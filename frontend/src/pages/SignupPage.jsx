import { useState } from "react";
import { useDispatch } from "react-redux";
import { signup } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(signup(form));
    if (res.meta.requestStatus === "fulfilled") {
      navigate("/");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h1 className="text-xl font-bold mb-4">Signup</h1>
      <input
        type="text"
        placeholder="Name"
        className="border p-2 block mb-2"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        className="border p-2 block mb-2"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 block mb-2"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Signup
      </button>
    </form>
  );
}
