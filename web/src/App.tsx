import { useEffect, useMemo, useState } from "react";
import type { ApiError } from "./lib/api";
import {
  createCustomer,
  deleteCustomer,
  listCustomers,
  type Customer,
  type CustomerInput,
  updateCustomer,
} from "./features/customers/customerApi";

function isApiError(e: unknown): e is ApiError {
  return !!(e && typeof e === "object" && "error" in e);
}

const emptyForm: CustomerInput = {
  name: "",
  email: "",
  tel: "",
  postal_code: "",
  address: "",
};

export default function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState<CustomerInput>(emptyForm);

  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const isEditMode = useMemo(() => editing !== null, [editing]);

  async function reload() {
    setLoading(true);
    setGlobalError(null);
    try {
      const data = await listCustomers();
      setCustomers(data);
    } catch (e) {
      setGlobalError(isApiError(e) ? e.error.message : "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
  }, []);

  function startCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFieldErrors({});
    setGlobalError(null);
  }

  function startEdit(c: Customer) {
    setEditing(c);
    setForm({
      name: c.name ?? "",
      email: c.email ?? "",
      tel: c.tel ?? "",
      postal_code: c.postal_code ?? "",
      address: c.address ?? "",
    });
    setFieldErrors({});
    setGlobalError(null);
  }

  function onChange<K extends keyof CustomerInput>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError(null);
    setFieldErrors({});

    try {
      if (isEditMode && editing) {
        const updated = await updateCustomer(editing.id, form);
        setCustomers((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      } else {
        const created = await createCustomer(form);
        setCustomers((prev) => [created, ...prev]);
      }
      startCreate();
    } catch (err) {
      if (isApiError(err)) {
        setGlobalError(err.error.message);
        setFieldErrors(err.error.fields ?? {});
      } else {
        setGlobalError("Unexpected error");
      }
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Delete this customer?")) return;
    setGlobalError(null);

    try {
      await deleteCustomer(id);
      setCustomers((prev) => prev.filter((x) => x.id !== id));
      if (editing?.id === id) startCreate();
    } catch (err) {
      setGlobalError(isApiError(err) ? err.error.message : "Failed to delete");
    }
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 16, fontFamily: "system-ui" }}>
      <h1>Customers</h1>

      {globalError && (
        <div style={{ padding: 12, border: "1px solid", marginBottom: 12 }}>
          {globalError}
        </div>
      )}

      <section style={{ padding: 12, border: "1px solid", marginBottom: 16 }}>
        <h2 style={{ marginTop: 0 }}>{isEditMode ? "Edit customer" : "Create customer"}</h2>

        <form onSubmit={onSubmit}>
          <div style={{ display: "grid", gap: 8 }}>
            <label>
              Name *<br />
              <input
                value={form.name}
                onChange={(e) => onChange("name", e.target.value)}
                style={{ width: "100%" }}
              />
              {fieldErrors["name"]?.length ? (
                <div style={{ marginTop: 4 }}>
                  {fieldErrors["name"].map((m, i) => (
                    <div key={i}>{m}</div>
                  ))}
                </div>
              ) : null}
            </label>

            <label>
              Email<br />
              <input
                value={form.email ?? ""}
                onChange={(e) => onChange("email", e.target.value)}
                style={{ width: "100%" }}
              />
              {fieldErrors["email"]?.length ? (
                <div style={{ marginTop: 4 }}>
                  {fieldErrors["email"].map((m, i) => (
                    <div key={i}>{m}</div>
                  ))}
                </div>
              ) : null}
            </label>

            <label>
              Tel<br />
              <input
                value={form.tel ?? ""}
                onChange={(e) => onChange("tel", e.target.value)}
                style={{ width: "100%" }}
              />
            </label>

            <label>
              Postal code<br />
              <input
                value={form.postal_code ?? ""}
                onChange={(e) => onChange("postal_code", e.target.value)}
                style={{ width: "100%" }}
              />
            </label>

            <label>
              Address<br />
              <input
                value={form.address ?? ""}
                onChange={(e) => onChange("address", e.target.value)}
                style={{ width: "100%" }}
              />
            </label>

            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit">{isEditMode ? "Update" : "Create"}</button>
              {isEditMode ? <button type="button" onClick={startCreate}>Cancel</button> : null}
            </div>
          </div>
        </form>
      </section>

      <section style={{ padding: 12, border: "1px solid" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>List</h2>
          <button onClick={reload} disabled={loading}>
            Reload
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
            <thead>
              <tr>
                <th align="left">ID</th>
                <th align="left">Name</th>
                <th align="left">Email</th>
                <th align="left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} style={{ borderTop: "1px solid #ddd" }}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.email ?? ""}</td>
                  <td>
                    <button onClick={() => startEdit(c)}>Edit</button>{" "}
                    <button onClick={() => onDelete(c.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: 8 }}>
                    No customers
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
