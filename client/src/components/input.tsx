interface InputProps {
  placeholder?: string;
  ref?: any;
  type?:"text"|"password"
}

export function Input({ placeholder, ref,type}: InputProps) {
  return (
    <div>
      <input
        ref={ref}
        placeholder={placeholder}
        type={type}
        className="px-4 py-2 rounded border bg-black-400 border-gray-300 mt-2 w-full"
        required
      />
    </div>
  );
}
