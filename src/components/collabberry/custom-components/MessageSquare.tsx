import React from 'react';

interface MessageSquareProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}
const MessageSquare: React.FC<MessageSquareProps> = ({
  size = 24,
  className = "w-6 h-6",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`stroke-current ${className}`}
    {...props}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default MessageSquare;