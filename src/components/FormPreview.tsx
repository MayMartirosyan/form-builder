import React, { useState, useEffect } from 'react';
import { FormField } from '../types/form';
import { useAppSelector } from '../store/hooks';
import { selectForm } from '../store/formSlice';
import { toast } from 'react-toastify';

const FormPreview: React.FC = () => {
  const { schema } = useAppSelector(selectForm);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const initialData: Record<string, any> = {};

    schema.fields.forEach((field) => {
      const initialValue =
        field.defaultValue ?? (field.type === 'checkbox' ? false : '');
      initialData[field.id] = initialValue;
    });

    setFormData(initialData);
  }, [schema]);

  const handleChange = (field: FormField, value: any) => {
    setFormData({ ...formData, [field.id]: value });
    if (field.required && !value) {
      setErrors({ ...errors, [field.id]: 'This field is required' });
    } else {
      setErrors({ ...errors, [field.id]: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    schema.fields.forEach((field) => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = 'This field is required';
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      toast.success('Form is ready for submission!');
    }
  };

  const renderInput = (field: FormField) => {
    const value =
      formData[field.id] ??
      field.defaultValue ??
      (field.type === 'checkbox' ? false : '');

    const commonProps = {
      id: field.id,
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      ) => {
        const val =
          field.type === 'checkbox'
            ? (e.target as HTMLInputElement).checked
            : e.target.value;
        handleChange(field, val);
      },
    };

    switch (field.type) {
      case 'text':
        return <input type="text" value={value} {...commonProps} />;
      case 'number':
        return <input type="number" value={value} {...commonProps} />;
      case 'checkbox':
        return <input type="checkbox" checked={!!value} {...commonProps} />;
      case 'select':
        return (
          <select value={value} {...commonProps}>
            <option value="">Select an option</option>
            {field.options
              ?.trim()
              ?.split(',')
              .map((opt) => (
                <option key={opt.trim()} value={opt.trim()}>
                  {opt.trim()}
                </option>
              ))}
          </select>
        );
      // TODO: can add there other types if will necessary
      default:
        return null;
    }
  };

  return (
    <div className='form-preview-wrapper'>
  <div className="form-preview">
      <h2>{schema.name || 'Form Preview'}</h2>
      <form onSubmit={handleSubmit}>
        {schema.fields.map((field) => (
          <div
            key={field.id}
            className={`preview-field ${
              field.type === 'checkbox' ? 'checkbox-field' : ''
            }`}
          >
            <div
              className={`label-input ${
                field.type === 'checkbox' ? 'checkbox' : ''
              }`}
            >
              <label htmlFor={field.id}>
                {field.label} {field.required && <span>*</span>}
              </label>
              {renderInput(field)}
            </div>

            {errors[field.id] && (
              <span className="error">{errors[field.id]}</span>
            )}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
    </div>
  
  );
};

export default FormPreview;
