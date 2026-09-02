import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import styles from "./App.module.css";

const BODY_TYPES = ["Electric", "Acoustic", "Bass", "Classical"];
const ROLES = ["Merchant", "Consumer"];

const emptyForm = {
  model: "",
  bodyType: "",
  brand: "",
  stock: "",
  manufacturer: "",
  role: "",
};

function App() {
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!form.model.trim() || form.model.trim().length < 3) {
      nextErrors.model = "Guitar model must be at least 3 characters.";
    }
    if (!BODY_TYPES.includes(form.bodyType)) {
      nextErrors.bodyType = "Please select a body type.";
    }
    if (!form.brand.trim()) {
      nextErrors.brand = "Brand name is required.";
    }

    const stock = Number(form.stock);
    if (form.stock === "" || !Number.isInteger(stock) || stock < 1 || stock > 100) {
      nextErrors.stock = "Stock quantity must be a whole number from 1 to 100.";
    }
    if (!form.manufacturer.trim()) {
      nextErrors.manufacturer = "Manufacturer name is required.";
    }
    if (!ROLES.includes(form.role)) {
      nextErrors.role = "Please select a user role.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    const newItem = {
      id: Date.now(),
      model: form.model.trim(),
      bodyType: form.bodyType,
      brand: form.brand.trim(),
      stock: Number(form.stock),
      manufacturer: form.manufacturer.trim(),
      role: form.role,
    };

    setItems((current) => [...current, newItem]);
    setActiveId(newItem.id);
    setForm(emptyForm);
    setErrors({});
    setSubmitted(true);
  };

  const errorFor = (name) =>
    errors[name] ? <small className={styles.error}>{errors[name]}</small> : null;

  const columns = useMemo(
    () => [
      { accessorKey: "model", header: "Guitar Model" },
      {
        accessorKey: "bodyType",
        header: "Body Type",
        cell: ({ getValue }) => (
          <span className={styles["type-badge"]}>{getValue()}</span>
        ),
      },
      { accessorKey: "brand", header: "Brand" },
      {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ getValue }) => (
          <span className={getValue() <= 5 ? styles["low-stock"] : ""}>
            {getValue()}
          </span>
        ),
      },
      { accessorKey: "manufacturer", header: "Manufacturer" },
      { accessorKey: "role", header: "Role" },
    ],
    []
  );

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 4,
      },
    },
  });

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>SET B • PRACTICAL EXAM • ALMADRONES</p>
        <h1>Guitar Store Inventory Manager</h1>
        <p className={styles.subtitle}>
          Register guitars and validate inventory details before they hit the
          registry.
        </p>
      </header>

      <section className={styles.layout}>
      <div className={`${styles.card} ${styles["form-card"]}`}>
        <div className={styles["card-heading"]}>
          <div>
            <p className={styles["section-label"]}>PHASE 1</p>
            <h2>Register Guitar</h2>
          </div>
          <span className={styles["required-note"]}>* Required</span>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label>
            Guitar Model *
            <input
              name="model"
              value={form.model}
              onChange={handleChange}
              placeholder="e.g. Player Stratocaster"
            />
            {errorFor("model")}
          </label>

          <label>
            Body Type *
            <select name="bodyType" value={form.bodyType} onChange={handleChange}>
              <option value="">Select body type</option>
              {BODY_TYPES.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
            {errorFor("bodyType")}
          </label>

          <label>
            Brand Name *
            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="e.g. Fender"
            />
            {errorFor("brand")}
          </label>

          <label>
            Stock Quantity (1–100) *
            <input
              name="stock"
              type="number"
              min="1"
              max="100"
              value={form.stock}
              onChange={handleChange}
              placeholder="e.g. 20"
            />
            {errorFor("stock")}
          </label>

          <label>
            Manufacturer Name *
            <input
              name="manufacturer"
              value={form.manufacturer}
              onChange={handleChange}
              placeholder="e.g. Fender Musical Instruments"
            />
            {errorFor("manufacturer")}
          </label>

          <fieldset>
            <legend>User Role *</legend>
            <div className={styles["radio-row"]}>
              {ROLES.map((role) => (
                <label className={styles["radio-label"]} key={role}>
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={form.role === role}
                    onChange={handleChange}
                  />
                  <span>{role}</span>
                </label>
              ))}
            </div>
            {errorFor("role")}
          </fieldset>

          <button className={styles["primary-btn"]} type="submit">
            + Add Guitar to Registry
          </button>

          {submitted && (
            <div className={styles.success}>Guitar successfully added to the registry.</div>
          )}
        </form>
      </div>

      <div className={styles.card}>
        <div className={styles["card-heading"]}>
          <div>
            <p className={styles["section-label"]}>PHASE 2</p>
            <h2>Guitar Registry</h2>
          </div>
          <span className={styles.count}>{items.length} records</span>
        </div>

        <div className={styles["table-wrap"]}>
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={row.original.id === activeId ? styles["selected-row"] : ""}
                    onClick={() => setActiveId(row.original.id)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext()) ||
                          cell.getValue()}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className={styles.empty}>
                    No guitars registered yet — add one using the form.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.pagination}>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {Math.max(table.getPageCount(), 1)}
          </span>
          <div>
            <button
              className={styles["secondary-btn"]}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              ← Previous
            </button>
            <button
              className={styles["secondary-btn"]}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
      </section>
    </main>
  );
}

export default App;
