'use client';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/Toast';
import { useToast } from '@/hooks/use-toast';

/**
 * Toaster 컴포넌트
 * 
 * 앱 전역에서 Toast 알림을 표시하기 위한 Provider 컴포넌트입니다.
 * app/layout.tsx에서 한 번만 선언하면 됩니다.
 * 
 * @example
 * ```tsx
 * // app/layout.tsx
 * import { Toaster } from '@/components/providers/toast-provider';
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <Toaster />
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

