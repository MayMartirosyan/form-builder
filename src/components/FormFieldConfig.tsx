import React, { useRef } from 'react';
import { updateField } from '../store/formSlice';
import { useDrag, useDrop } from 'react-dnd';
import { FormField } from '../types/form';
import { useAppDispatch } from '../store/hooks';

interface FormFieldConfigProps {
  field: FormField;
  index: number;
  moveField: (dragIndex: number, hoverIndex: number) => void;
  onRemove: () => void;
}

const FormFieldConfig: React.FC<FormFieldConfigProps> = ({
  field,
  index,
  moveField,
  onRemove,
}) => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: 'field',
    hover(item: { index: number }) {
      if (item.index !== index) {
        moveField(item.index, index);
        item.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'field',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const handleChange = (updates: Partial<FormField>) => {
    dispatch(updateField({ ...field, ...updates }));
  };

  return (
    <div ref={ref} className={`field-config ${isDragging ? 'dragging' : ''}`}>
      <input
        type="text"
        placeholder="Field Label"
        value={field.label}
        onChange={(e) => handleChange({ label: e.target.value })}
      />
      <select
        value={field.type}
        onChange={(e) =>
          handleChange({
            type: e.target.value as FormField['type'],
            defaultValue: e.target.value === 'checkbox' ? false : '',
          })
        }
      >
        <option value="text">Text</option>
        <option value="number">Number</option>
        <option value="checkbox">Checkbox</option>
        <option value="select">Select</option>
      </select>

      {field.type !== 'checkbox' && (
        <input
          type={field.type === 'number' ? 'number' : 'text'}
          placeholder="Default Value"
          value={field.defaultValue as string | number}
          onChange={(e) => handleChange({ defaultValue: e.target.value })}
        />
      )}

      {field.type === 'select' && (
        <textarea
          placeholder="Options (comma-separated)"
          value={field.options}
          onChange={(e) =>
            handleChange({
              options: e.target.value,
            })
          }
        />
      )}

      <div className='field-actions'>
        <label>
          Required
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) => handleChange({ required: e.target.checked })}
          />
        </label>

        <button onClick={onRemove} className="button-remove">
          X
        </button>
      </div>
    </div>
  );
};

export default FormFieldConfig;
