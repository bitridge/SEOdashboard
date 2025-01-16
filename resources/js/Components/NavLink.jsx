import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center px-1 pt-1 border-b-2 ' +
                (active
                    ? 'border-blue-500 text-white font-semibold'
                    : 'border-transparent ' + className)
            }
        >
            {children}
        </Link>
    );
}
