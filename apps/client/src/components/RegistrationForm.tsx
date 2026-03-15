import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BookOpen, User, Phone, MapPin, Calendar } from "lucide-react";
import { z } from "zod";
import axios from "axios"

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  number: z.string().trim().min(7, "Enter a valid phone number").max(15),
  address: z.string().trim().min(1, "Address is required").max(300),
  age: z.string().trim().min(1, "Age is required"),
});

const RegistrationForm = () => {
  const [form, setForm] = useState({ name: "", number: "", address: "", age: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    console.log("1")
    try{
      const res = await axios.post("http://localhost:3000/post", form);
        console.log(res); 
    toast.success("Registration successful! Welcome to the library.");

         setForm({ name: "", number: "", address: "", age: "" });
    }catch(error){  
      console.log(error); 
    }
    console.log("2")


    const result = formSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
   
    setErrors({});
  };

  const fields = [
    { key: "name", label: "Full Name", icon: User, type: "text", placeholder: "John Doe" },
    { key: "number", label: "Phone Number", icon: Phone, type: "tel", placeholder: "+1 234 567 890" },
    // { key: "address", label: "Address", icon: MapPin, type: "text", placeholder: "123 Book Street" },
    // { key: "age", label: "Age", icon: Calendar, type: "number", placeholder: "25" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="bg-card rounded-lg border border-border p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-display font-semibold text-foreground">Member Registration</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map(({ key, label, icon: Icon, type, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <Label htmlFor={key} className="text-sm font-medium text-foreground flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                {label}
              </Label>
              <Input
                id={key}
                type={type}
                placeholder={placeholder}
                value={form[key as keyof typeof form]}
                onChange={(e) => handleChange(key, e.target.value)}
                className="bg-background border-border focus:ring-primary"
              />
              {errors[key] && <p className="text-sm text-destructive">{errors[key]}</p>}
            </div>
          ))}
          <Button type="submit" className="w-full mt-2 bg-primary text-primary-foreground hover:opacity-90 font-body font-semibold text-base py-5">
            Register Now
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default RegistrationForm;
