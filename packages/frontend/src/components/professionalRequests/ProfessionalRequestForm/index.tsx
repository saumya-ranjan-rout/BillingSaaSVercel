import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useApi } from "../../../hooks/useApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";

// ✅ Validation schema
const requestSchema = z.object({
  professionalId: z.string().min(1, "Please select a professional"),
});

type RequestFormData = z.infer<typeof requestSchema>;

const ProfessionalRequestForm: React.FC = () => {
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const { get, post } = useApi<any>();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      professionalId: "",
    },
  });

  // Fetch professionals
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const res = await get("/api/professional-requests/professionals");
        const data = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : [];
        setProfessionals(data);
      } catch (err: any) {
        console.error("Error fetching professionals:", err);
        toast.error(err?.message || "Failed to load professionals");
      } finally {
        setLoading(false);
      }
    };
    fetchProfessionals();
  }, [get]);

  const onSubmit = async (data: RequestFormData) => {
    try {
      await post("/api/professional-requests", {
        requestedId: data.professionalId,
      });
      toast.success("Request sent successfully!");
      setValue("professionalId", "");
      setSearchTerm("");
      setTimeout(() => {
      window.location.reload(); // This will reload the page after 1 second
    }, 1000);
    } catch (err: any) {
      console.error("Failed to send request:", err);
      toast.error(err?.message || "Failed to send request");
    }
  };

  if (loading) return <div>Loading...</div>;

  // Filter based on search term
  const filtered = professionals.filter((pro) => {
    const name = `${pro.firstName} ${pro.lastName}`.toLowerCase();
    const email = pro.email?.toLowerCase() || "";
    return (
      name.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 bg-white p-4 rounded-lg shadow-sm"
    >
      {/* ✅ Searchable Select (No Controller) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Professional *
        </label>
        <Select
          onValueChange={(value: string) => setValue("professionalId", value)}
          value={watch("professionalId")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Search or select a professional..." />
          </SelectTrigger>
          <SelectContent className="max-h-64 overflow-y-auto">
            {/* 🔍 Search box inside dropdown */}
            <div className="p-2 sticky top-0 bg-white z-10 border-b">
              <Input
                placeholder="Type to search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-sm"
              />
            </div>

            {/* Filtered options */}
            {filtered.length > 0 ? (
              filtered.map((pro) => (
                <SelectItem key={pro.id} value={pro.id}>
                  {pro.firstName} {pro.lastName} ({pro.email})
                </SelectItem>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                No professionals found
              </div>
            )}
          </SelectContent>
        </Select>
        {errors.professionalId && (
          <p className="text-red-500 text-sm mt-1">
            {errors.professionalId.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="submit" isLoading={isSubmitting}>
          Send Request
        </Button>
      </div>
    </form>
  );
};

export default ProfessionalRequestForm;





















// import React, { useEffect, useState } from "react";
// import { useApi } from "../../../hooks/useApi";

// const ProfessionalRequestForm = () => {
//   const [professionals, setProfessionals] = useState<any[]>([]);
//   const [selectedProfessional, setSelectedProfessional] = useState("");
//   const { get, post } = useApi<any>();

//   useEffect(() => {
//     const fetchProfessionals = async () => {
//       try {
//         const res = await get("/api/professional-requests/professionals");
//         console.log("Professionals API Response:", res);

//         // ✅ Flexible handling whether backend sends `res.data` or `res.data.data`
//      //   const data = res?.data?.data || res?.data || [];
//         setProfessionals(Array.isArray(res) ? res : []);
//       } catch (err) {
//         console.error("Error fetching professionals:", err);
//         setProfessionals([]);
//       }
//     };

//     fetchProfessionals();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedProfessional) return alert("Please select a professional");
//     await post("/api/professional-requests", {
//       requestedId: selectedProfessional,
//     });
//     alert("Request sent successfully!");
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex gap-4 items-end">
//       <div className="flex-1">
//         <label className="block text-sm font-medium mb-1">
//           Select Professional
//         </label>
//         <select
//           value={selectedProfessional}
//           onChange={(e) => setSelectedProfessional(e.target.value)}
//           className="w-full border p-2 rounded-md"
//         >
//           <option value="">-- Choose Professional --</option>
//           {professionals.map((pro) => (
//             <option key={pro.id} value={pro.id}>
//               {pro.firstName} {pro.lastName} ({pro.email})
//             </option>
//           ))}
//         </select>
//       </div>
//       <button
//         type="submit"
//         className="bg-blue-600 text-white px-4 py-2 rounded-md"
//       >
//         Send Request
//       </button>
//     </form>
//   );
// };

// export default ProfessionalRequestForm;
