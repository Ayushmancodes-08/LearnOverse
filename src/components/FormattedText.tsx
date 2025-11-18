import { parseFormattedText } from '@/lib/text-formatter';

interface FormattedTextProps {
  text: string;
  className?: string;
}

export const FormattedText = ({ text, className = '' }: FormattedTextProps) => {
  const segments = parseFormattedText(text);

  return (
    <div className={className}>
      {segments.map((segment, idx) => {
        switch (segment.type) {
          case 'bold':
            return <strong key={idx}>{segment.content}</strong>;
          case 'italic':
            return <em key={idx}>{segment.content}</em>;
          case 'text':
          default:
            return <span key={idx}>{segment.content}</span>;
        }
      })}
    </div>
  );
};
