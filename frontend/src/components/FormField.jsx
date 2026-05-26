const FormField = ({ label, id, error, children }) => (
  <div>
    <label htmlFor={id} className="label">{label}</label>
    {children}
    {error && <p className="error-text animate-fade-in">{error}</p>}
  </div>
);
export default FormField;
