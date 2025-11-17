import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          {...props}
          className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

// import React from 'react';

// export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
//   label?: string;
//   error?: string; // ✅ add this line
// }

// export const Input = React.forwardRef<HTMLInputElement, InputProps>(
//   ({ label, error, className = '', ...props }, ref) => {
//     return (
//       <div className="w-full">
//         {label && (
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             {label}
//           </label>
//         )}
//         <input
//           ref={ref}
//           {...props}
//           className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//             error ? 'border-red-500' : 'border-gray-300'
//           } ${className}`}
//         />
//         {error && (
//           <p className="text-sm text-red-500 mt-1">{error}</p>
//         )}
//       </div>
//     );
//   }
// );

// Input.displayName = 'Input';
