
import { Trash2, GripVertical } from 'lucide-react';
import type { ChecklistItem as ChecklistItemType } from '../../types';

interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onTextChange: (id: string, text: string) => void;
}

export function ChecklistItemComponent({ item, onToggle, onDelete, onTextChange }: ChecklistItemProps) {
  return (
    <div className={`checklist-item group ${item.completed ? 'completed' : ''}`}>
      <GripVertical size={14} className="cursor-grab opacity-0 group-hover:opacity-40 mt-1 flex-shrink-0" style={{ color: 'var(--color-text-secondary)' }} />
      <input
        type="checkbox"
        checked={item.completed}
        onChange={() => onToggle(item.id)}
      />
      <input
        type="text"
        value={item.text}
        onChange={(e) => onTextChange(item.id, e.target.value)}
        className="flex-1 bg-transparent outline-none text-sm"
        style={{
          color: 'var(--color-text)',
          textDecoration: item.completed ? 'line-through' : 'none',
          opacity: item.completed ? 0.5 : 1,
        }}
        placeholder="Add item..."
      />
      <button
        onClick={() => onDelete(item.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-red-50"
      >
        <Trash2 size={12} className="text-red-400" />
      </button>
    </div>
  );
}
