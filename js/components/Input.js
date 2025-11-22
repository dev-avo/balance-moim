/**
 * Input 컴포넌트
 */

/**
 * Input 생성
 */
export function createInput({
    id,
    type = 'text',
    placeholder = '',
    value = '',
    className = '',
    disabled = false,
    required = false,
    onChange = null,
    onKeyDown = null
}) {
    const input = document.createElement('input');
    input.id = id;
    input.type = type;
    input.placeholder = placeholder;
    input.value = value;
    input.disabled = disabled;
    input.required = required;
    
    const baseClasses = 'block w-full rounded-xl border-2 border-border glass px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 smooth-transition shadow-apple disabled:opacity-50 disabled:cursor-not-allowed';
    input.className = `${baseClasses} ${className}`;
    
    if(onChange) {
        input.addEventListener('input', (e) => {
            onChange(e.target.value);
        });
    }
    
    if(onKeyDown) {
        input.addEventListener('keydown', onKeyDown);
    }
    
    return input;
}

/**
 * Textarea 생성
 */
export function createTextarea({
    id,
    placeholder = '',
    value = '',
    rows = 4,
    className = '',
    disabled = false,
    required = false,
    onChange = null
}) {
    const textarea = document.createElement('textarea');
    textarea.id = id;
    textarea.placeholder = placeholder;
    textarea.value = value;
    textarea.rows = rows;
    textarea.disabled = disabled;
    textarea.required = required;
    
    const baseClasses = 'block w-full rounded-xl border-2 border-border glass px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 smooth-transition shadow-apple disabled:opacity-50 disabled:cursor-not-allowed resize-y';
    textarea.className = `${baseClasses} ${className}`;
    
    if(onChange) {
        textarea.addEventListener('input', (e) => {
            onChange(e.target.value);
        });
    }
    
    return textarea;
}
