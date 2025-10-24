import React, { useState, useEffect } from 'react';
import { areaService } from "../../../services/VentaProvisional/Applicant/api";

const ApplicantForm = ({ initialData, onSubmit, onCancel }) => {
  const [areas, setAreas] = useState([]);
  const [formData, setFormData] = useState({
    FIRST_NAME: '',
    LAST_NAME: '',
    IDENTIFICATION_TYPE: 'DNI',
    IDENTIFICATION_NUMBER: '',
    EMAIL: '',
    PHONE: '',
    COMPANY: '',
    AREA_ID: '',
    STATUS: 'A',
    ...initialData
  });

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      const response = await areaService.getAll();
      if (response.data.status === 'success') {
        setAreas(response.data.data);
      }
    } catch (error) {
      console.error('Error loading areas:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '0.9375rem',
    border: '2px solid #cbd5e1',
    borderRadius: '0.625rem',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    transition: 'all 0.2s ease',
    outline: 'none',
    fontWeight: '500',
    fontFamily: 'inherit'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '0.5rem',
    letterSpacing: '0.01em'
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      {/* Grid de campos - 2 columnas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Nombres */}
        <div>
          <label style={labelStyle}>Nombres *</label>
          <input
            type="text"
            name="FIRST_NAME"
            value={formData.FIRST_NAME}
            onChange={handleChange}
            placeholder="Ingrese nombres"
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
              e.target.style.backgroundColor = '#fafbfc';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#cbd5e1';
              e.target.style.boxShadow = 'none';
              e.target.style.backgroundColor = '#ffffff';
            }}
            required
          />
        </div>

        {/* Apellidos */}
        <div>
          <label style={labelStyle}>Apellidos *</label>
          <input
            type="text"
            name="LAST_NAME"
            value={formData.LAST_NAME}
            onChange={handleChange}
            placeholder="Ingrese apellidos"
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
              e.target.style.backgroundColor = '#fafbfc';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#cbd5e1';
              e.target.style.boxShadow = 'none';
              e.target.style.backgroundColor = '#ffffff';
            }}
            required
          />
        </div>

        {/* Tipo de Documento */}
        <div>
          <label style={labelStyle}>Tipo de Documento *</label>
          <select
            name="IDENTIFICATION_TYPE"
            value={formData.IDENTIFICATION_TYPE}
            onChange={handleChange}
            style={{...inputStyle, cursor: 'pointer'}}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
              e.target.style.backgroundColor = '#fafbfc';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#cbd5e1';
              e.target.style.boxShadow = 'none';
              e.target.style.backgroundColor = '#ffffff';
            }}
            required
          >
            <option value="DNI">DNI</option>
            <option value="PASAPORTE">Pasaporte</option>
            <option value="CARNET">Carnet de Extranjería</option>
          </select>
        </div>

        {/* Número de Documento */}
        <div>
          <label style={labelStyle}>Número de Documento *</label>
          <input
            type="text"
            name="IDENTIFICATION_NUMBER"
            value={formData.IDENTIFICATION_NUMBER}
            onChange={handleChange}
            placeholder="Ej: 12345678"
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
              e.target.style.backgroundColor = '#fafbfc';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#cbd5e1';
              e.target.style.boxShadow = 'none';
              e.target.style.backgroundColor = '#ffffff';
            }}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label style={labelStyle}>Email *</label>
          <input
            type="email"
            name="EMAIL"
            value={formData.EMAIL}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
              e.target.style.backgroundColor = '#fafbfc';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#cbd5e1';
              e.target.style.boxShadow = 'none';
              e.target.style.backgroundColor = '#ffffff';
            }}
            required
          />
        </div>

        {/* Teléfono */}
        <div>
          <label style={labelStyle}>Teléfono *</label>
          <input
            type="tel"
            name="PHONE"
            value={formData.PHONE}
            onChange={handleChange}
            placeholder="987654321"
            style={inputStyle}
            maxLength="9"
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
              e.target.style.backgroundColor = '#fafbfc';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#cbd5e1';
              e.target.style.boxShadow = 'none';
              e.target.style.backgroundColor = '#ffffff';
            }}
            required
          />
        </div>

        {/* Empresa */}
        <div>
          <label style={labelStyle}>Empresa *</label>
          <input
            type="text"
            name="COMPANY"
            value={formData.COMPANY}
            onChange={handleChange}
            placeholder="Nombre de la empresa"
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
              e.target.style.backgroundColor = '#fafbfc';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#cbd5e1';
              e.target.style.boxShadow = 'none';
              e.target.style.backgroundColor = '#ffffff';
            }}
            required
          />
        </div>

        {/* Área */}
        <div>
          <label style={labelStyle}>Área *</label>
          <select
            name="AREA_ID"
            value={formData.AREA_ID}
            onChange={handleChange}
            style={{...inputStyle, cursor: 'pointer'}}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
              e.target.style.backgroundColor = '#fafbfc';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#cbd5e1';
              e.target.style.boxShadow = 'none';
              e.target.style.backgroundColor = '#ffffff';
            }}
            required
          >
            <option value="">Seleccionar área</option>
            {areas.map(area => (
              <option key={area.ID_AREA} value={area.ID_AREA}>
                {area.AREA_NAME}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Botones */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '1rem',
        paddingTop: '1.75rem',
        borderTop: '2px solid #e2e8f0'
      }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '0.875rem 2rem',
            fontSize: '0.9375rem',
            fontWeight: '600',
            borderRadius: '0.625rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backgroundColor: '#ffffff',
            color: '#475569',
            border: '2px solid #cbd5e1',
            minWidth: '120px',
            letterSpacing: '0.01em'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f8fafc';
            e.currentTarget.style.borderColor = '#94a3b8';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          style={{
            padding: '0.875rem 2rem',
            fontSize: '0.9375rem',
            fontWeight: '600',
            borderRadius: '0.625rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)',
            minWidth: '120px',
            letterSpacing: '0.01em'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(59, 130, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3b82f6';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(59, 130, 246, 0.3)';
          }}
        >
          {initialData?.ID_APPLICANT ? 'Actualizar' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};

export default ApplicantForm;