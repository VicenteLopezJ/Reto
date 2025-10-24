import React from 'react';
import { Edit2, Trash2, RotateCcw, FileText } from 'lucide-react';

const ApplicantTable = ({ applicants, onEdit, onDelete, onRestore, onViewDoc }) => {
  const tableHeaderStyle = {
    backgroundColor: '#1e40af',
    color: '#ffffff',
    padding: '0.75rem 1rem',
    textAlign: 'left',
    fontSize: '0.875rem',
    fontWeight: '600',
    letterSpacing: '0.05em'
  };

  const tableCellStyle = {
    padding: '0.75rem 1rem',
    fontSize: '0.875rem',
    borderBottom: '1px solid #e2e8f0'
  };

  const buttonStyle = {
    padding: '0.5rem',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  };

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff' }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>CÓDIGO</th>
            <th style={tableHeaderStyle}>Solicitante</th>
            <th style={tableHeaderStyle}>DNI</th>
            <th style={tableHeaderStyle}>EMPRESA</th>
            <th style={tableHeaderStyle}>AREA</th>
            <th style={tableHeaderStyle}>ESTADO</th>
            <th style={tableHeaderStyle}>FECHA INGRESO</th>
            <th style={tableHeaderStyle}>ESTADO ACCESO</th>
            <th style={{...tableHeaderStyle, textAlign: 'center'}}>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((applicant, index) => (
            <tr 
              key={applicant.ID_APPLICANT}
              style={{
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              <td style={tableCellStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: '0.875rem'
                  }}>
                    {index + 1}
                  </div>
                  <span style={{ fontWeight: '600' }}>{applicant.ID_APPLICANT}</span>
                </div>
              </td>
              <td style={tableCellStyle}>
                <div>
                  <div style={{ fontWeight: '600', color: '#0f172a' }}>
                    {applicant.FIRST_NAME} {applicant.LAST_NAME}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    {applicant.EMAIL}
                  </div>
                </div>
              </td>
              <td style={tableCellStyle}>
                <span style={{
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  {applicant.IDENTIFICATION_NUMBER}
                </span>
              </td>
              <td style={{...tableCellStyle, color: '#475569'}}>
                {applicant.COMPANY}
              </td>
              <td style={{...tableCellStyle, color: '#475569'}}>
                Área {applicant.AREA_ID}
              </td>
              <td style={tableCellStyle}>
                <span style={{
                  backgroundColor: applicant.STATUS === 'A' ? '#d1fae5' : '#fee2e2',
                  color: applicant.STATUS === 'A' ? '#065f46' : '#991b1b',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  {applicant.STATUS === 'A' ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td style={{...tableCellStyle, color: '#64748b'}}>
                {new Date().toLocaleDateString()}
              </td>
              <td style={{...tableCellStyle, color: '#64748b'}}>
                PENDIENTE
              </td>
              <td style={tableCellStyle}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.5rem' 
                }}>
                  {/* Ver Documento */}
                  <button
                    onClick={() => onViewDoc(applicant)}
                    style={{
                      ...buttonStyle,
                      color: '#1e40af'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#dbeafe';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    title="Ver documento"
                  >
                    <FileText size={18} />
                  </button>

                  {/* Editar */}
                  <button
                    onClick={() => onEdit(applicant)}
                    style={{
                      ...buttonStyle,
                      color: '#3b82f6'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#dbeafe';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>

                  {/* Eliminar o Restaurar */}
                  {applicant.STATUS === 'A' ? (
                    <button
                      onClick={() => onDelete(applicant.ID_APPLICANT)}
                      style={{
                        ...buttonStyle,
                        color: '#dc2626'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fee2e2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={() => onRestore(applicant.ID_APPLICANT)}
                      style={{
                        ...buttonStyle,
                        color: '#16a34a'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#dcfce7';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      title="Restaurar"
                    >
                      <RotateCcw size={18} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {applicants.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem 0', 
          color: '#64748b',
          fontSize: '1rem',
          fontWeight: '600'
        }}>
          No hay estudiantes registrados
        </div>
      )}
    </div>
  );
};

export default ApplicantTable;