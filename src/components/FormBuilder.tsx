import React, { useState, useEffect } from 'react';
import {
  setFormName,
  addField,
  removeField,
  reorderFields,
  setSchema,
  selectForm,
} from '../store/formSlice';
import { v4 as uuidv4 } from 'uuid';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FormField } from '../types/form';
import FormPreview from './FormPreview';
import FormFieldConfig from './FormFieldConfig';
import { useGetFormQuery, useSaveFormMutation } from '../store/formApi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toast } from 'react-toastify';

const FormBuilder: React.FC = () => {
  const dispatch = useAppDispatch();
  const { schema } = useAppSelector(selectForm);
  const [showPreview, setShowPreview] = useState(false);
  const [saveForm, { isLoading: isSaving }] = useSaveFormMutation();
  const { data: fetchedSchema, isLoading: isFetching } = useGetFormQuery('1');

  useEffect(() => {
    if (fetchedSchema && !isFetching) {
      dispatch(setSchema(fetchedSchema));
    }
  }, [fetchedSchema, isFetching, dispatch]);

  const handleAddField = () => {
    const newField: FormField = {
      id: uuidv4(),
      label: '',
      type: 'text',
      required: false,
      defaultValue: '',
    };
    dispatch(addField(newField));
  };

  const handleSave = async () => {
    try {
      const result = await saveForm(schema).unwrap();

      if (result.message === 'success') {
        toast.success('Form saved successfully!');
      } else {
        toast.error('Something went wrong! Try again later');
      }
    } catch (error) {
      toast.error('Something went wrong! Try again later');
    }
  };

  const moveField = (dragIndex: number, hoverIndex: number) => {
    const draggedField = schema.fields[dragIndex];
    const newFields = [...schema.fields];
    newFields.splice(dragIndex, 1);
    newFields.splice(hoverIndex, 0, draggedField);
    dispatch(reorderFields(newFields));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="form-builder">
        <h1>Form {showPreview ? 'Preview' : 'Builder'}</h1>
        {showPreview ? (
          <FormPreview />
        ) : (
          <>
            <input
              type="text"
              placeholder="Form Name"
              className="form-name-input"
              value={schema.name}
              onChange={(e) => dispatch(setFormName(e.target.value))}
            />

            <div className="fields-container">
              {schema.fields.map((field, index) => (
                <FormFieldConfig
                  key={field.id}
                  field={field}
                  index={index}
                  moveField={moveField}
                  onRemove={() => dispatch(removeField(field.id))}
                />
              ))}
            </div>
          </>
        )}
        <div className="builder-controls">
          <div className="builder-controls-left">
            {schema.fields.length > 0 && (
              <button
                className="secondary"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            )}
            {!showPreview && (
              <button className="primary" onClick={handleAddField}>
                Add Field
              </button>
            )}
          </div>
          {!showPreview && (
            <button className="green" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Form'}
            </button>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default FormBuilder;
