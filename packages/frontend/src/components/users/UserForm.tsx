"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApi } from "../../hooks/useApi";
// import Input from "../common/Input";
// import Button from "../common/Button";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

// 🧩 Match backend entity
const userSchema = z
  .object({
     id: z.string().optional(), // ✅ add this line
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters").optional(),
    role: z.enum(
      [
        "super_admin",
        "admin",
        "finance",
        "sales",
        "support",
        "member",
        "user",
        "professional",
      ],
      { required_error: "Role is required" }
    ),
    status: z.enum(["active", "invited", "suspended"]).default("active"),
    biometricEnabled: z.boolean().optional(),
  })
  .refine(
    (data) => !data.id || !!data.password,
    { message: "Password is required for new users" }
  );

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: any; // You can replace `any` with a proper User type if you have it
  onSuccess: () => void;
  onCancel: () => void;
  onRefresh: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSuccess, onCancel, onRefresh }) => {
  const { post, put } = useApi<UserFormData>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      status: "active",
      role: "user",
      biometricEnabled: false,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
        biometricEnabled: user.biometricEnabled ?? false,
      });
    }
  }, [user, reset]);

  const handleApiError = (error: any, fallbackMessage: string) => {
    console.error(fallbackMessage, error);
    if (error?.message?.includes("fails to match") || error?.message?.includes("is required")) {
      error.message.split(",").forEach((msg: string) => toast.error(msg.trim()));
    } else {
      toast.error(error?.message || fallbackMessage);
    }
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
        status: data.status,
        biometricEnabled: data.biometricEnabled || false,
      };

      if (user?.id) {
        await put(`/api/users/${user.id}`, payload);
        toast.success("User updated successfully ✅");
      } else {
        await post(`/api/users`, payload);
        toast.success("User created successfully ✅");
      }

      onRefresh();
      onSuccess();
    } catch (error: any) {
      const err = error?.message || "Failed to save user ❌";
      handleApiError(error, err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          {...register("firstName")}
          error={errors.firstName?.message}
          disabled={isSubmitting}
          required
        />
        <Input
          label="Last Name"
          {...register("lastName")}
          error={errors.lastName?.message}
          disabled={isSubmitting}
          required
        />
      </div>

      <Input
        label="Email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
        disabled={isSubmitting}
        required
      />

      {!user && (
        <Input
          label="Password"
          type="password"
          {...register("password")}
          error={errors.password?.message}
          disabled={isSubmitting}
          required
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            {...register("role")}
            className="w-full border rounded p-2"
            disabled={isSubmitting}
          >
            <option value="">Select Role</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="finance">Finance</option>
            <option value="sales">Sales</option>
            <option value="support">Support</option>
            <option value="member">Member</option>
            <option value="user">User</option>
            {/* <option value="professional">Professional</option> */}
          </select>
          {errors.role && (
            <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            {...register("status")}
            className="w-full border rounded p-2"
            disabled={isSubmitting}
          >
            <option value="active">Active</option>
            <option value="invited">Invited</option>
            <option value="suspended">Suspended</option>
          </select>
          {errors.status && (
            <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Biometric toggle */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="biometricEnabled"
          {...register("biometricEnabled")}
          disabled={isSubmitting}
        />
        <label htmlFor="biometricEnabled" className="text-sm text-gray-700">
          Enable Biometric Authentication
        </label>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {user ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
