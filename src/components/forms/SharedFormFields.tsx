type HoneypotFieldProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
};

export function HoneypotField({ id, value, onChange }: HoneypotFieldProps) {
  return (
    <div aria-hidden="true" className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
      <label htmlFor={id}>Não preencha este campo</label>
      <input
        id={id}
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export function FormFieldError({ id, message }: { id?: string; message?: string }) {
  return message ? <p id={id} className="mt-1 text-xs text-red-400">{message}</p> : null;
}
