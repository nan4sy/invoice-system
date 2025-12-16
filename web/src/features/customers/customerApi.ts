import { apiFetch } from "../../lib/api";

export type Customer = {
  id: number;
  name: string;
  email?: string | null;
  tel?: string | null;
  postal_code?: string | null;
  address?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type CustomerInput = {
  name: string;
  email?: string;
  tel?: string;
  postal_code?: string;
  address?: string;
};

export function listCustomers(): Promise<Customer[]> {
  return apiFetch<Customer[]>("/api/customers");
}

export function createCustomer(input: CustomerInput): Promise<Customer> {
  return apiFetch<Customer>("/api/customers", {
    method: "POST",
    body: JSON.stringify({ customer: input }),
  });
}

export function updateCustomer(
  id: number,
  input: CustomerInput
): Promise<Customer> {
  return apiFetch<Customer>(`/api/customers/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ customer: input }),
  });
}

export async function deleteCustomer(id: number): Promise<void> {
  await apiFetch<void>(`/api/customers/${id}`, { method: "DELETE" });
}
