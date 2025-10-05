import * as React from 'react';
export function Button({ className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={"px-4 py-2 rounded-2xl bg-gray-900 text-white hover:opacity-90 transition " + className} {...props} />
  );
}