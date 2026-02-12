import React from 'react';
import { Toaster as Sonner } from 'sonner';

function Toaster(props) {
  return (
    <Sonner
      theme="light"
      position="bottom-center"
      closeButton
      richColors={false}
      toastOptions={{
        style: {
          background: '#4d52bf',
          color: '#ffffff',
          border: '1px solid #4247a6',
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
