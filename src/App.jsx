import { useState } from "react";
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

    // Registry table (Phase 2) will pick this submission up next.
    setForm(emptyForm);
    setErrors({});
    setSubmitted(true);
  };

  const errorFor = (name) =>
    errors[name] ? <small className={styles.error}>{errors[name]}</small> : null;

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
            <div className={styles.success}>Form is valid — registry table lands in the next commit.</div>
          )}
        </form>
      </div>
    </main>
  );
}

export default App;
