import React from 'react';

interface ButtonProps {
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className = '', type = 'button' }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`bg-green-500 text-white font-bold py-2 px-4 rounded shadow-lg transition-transform transform hover:scale-105 hover:bg-green-600 ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;