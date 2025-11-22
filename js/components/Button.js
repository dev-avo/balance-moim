/**
 * Button 컴포넌트
 */

/**
 * 버튼 생성
 */
export function createButton({
    text,
    onClick,
    variant = 'default',
    size = 'default',
    disabled = false,
    className = '',
    type = 'button'
}) {
    const button = document.createElement('button');
    button.type = type;
    button.textContent = text;
    button.disabled = disabled;
    
    const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold smooth-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95';
    
    const variantClasses = {
        default: 'bg-primary text-primary-foreground shadow-apple hover:shadow-apple-lg hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-apple hover:shadow-apple-lg hover:bg-destructive/90',
        outline: 'border-2 border-border bg-card text-card-foreground shadow-apple hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-apple hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground'
    };
    
    const sizeClasses = {
        default: 'h-11 px-6 py-2.5',
        sm: 'h-9 rounded-lg px-4 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base',
        icon: 'h-10 w-10'
    };
    
    button.className = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
    
    if(onClick) {
        button.addEventListener('click', onClick);
    }
    
    return button;
}
