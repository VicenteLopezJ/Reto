import React, { useState, useEffect } from 'react';
import { Search, Plus, UserCheck } from 'lucide-react';
import { applicantService } from '../../../services/VentaProvisional/Applicant/api';
import StatsCard from "../../../components/VentaProvisional/Applicant/StatsCard";
import Modal from '../../../components/VentaProvisional/Applicant/Modal';
import ApplicantForm from '../../../components/VentaProvisional/Applicant/ApplicantForm';
import ApplicantTable from '../../../components/VentaProvisional/Applicant/ApplicantTable';
import '../../../styles/VentaProvisional/Applicant/StyleApplicant.css'; 

const ApplicantPage = () => {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('A');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApplicant, setEditingApplicant] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    graduated: 0,
    inactive: 0
  });

  useEffect(() => {
    loadApplicants();
  }, [statusFilter]);

  useEffect(() => {
    filterApplicants();
  }, [searchTerm, applicants]);

  const loadApplicants = async () => {
    setLoading(true);
    try {
      const response = await applicantService.getByStatus(statusFilter);
      if (response.data.status === 'success') {
        setApplicants(response.data.data);
        calculateStats(response.data.data);
      }
    } catch (error) {
      console.error('Error loading applicants:', error);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    setStats({
      total: data.length,
      active: data.filter(a => a.STATUS === 'A').length,
      pending: 2,
      graduated: 0,
      inactive: data.filter(a => a.STATUS === 'I').length
    });
  };

  const filterApplicants = () => {
    if (!searchTerm) {
      setFilteredApplicants(applicants);
      return;
    }

    const filtered = applicants.filter(applicant =>
      applicant.FIRST_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.LAST_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.IDENTIFICATION_NUMBER?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.EMAIL?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredApplicants(filtered);
  };

  const handleCreate = () => {
    setEditingApplicant(null);
    setIsModalOpen(true);
  };

  const handleEdit = (applicant) => {
    setEditingApplicant(applicant);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingApplicant) {
        const updateData = {
          ID_APPLICANT: editingApplicant.ID_APPLICANT,
          ...formData
        };
        await applicantService.update(updateData);
        alert('Estudiante actualizado exitosamente');
      } else {
        await applicantService.create(formData);
        alert('Estudiante creado exitosamente');
      }
      setIsModalOpen(false);
      loadApplicants();
    } catch (error) {
      console.error('Error saving applicant:', error);
      alert('Error al guardar el estudiante');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de eliminar este estudiante?')) return;
    
    try {
      await applicantService.delete(id);
      alert('Estudiante eliminado exitosamente');
      loadApplicants();
    } catch (error) {
      console.error('Error deleting applicant:', error);
      alert('Error al eliminar el estudiante');
    }
  };

  const handleRestore = async (id) => {
    if (!confirm('¿Está seguro de restaurar este estudiante?')) return;
    
    try {
      await applicantService.restore(id);
      alert('Estudiante restaurado exitosamente');
      loadApplicants();
    } catch (error) {
      console.error('Error restoring applicant:', error);
      alert('Error al restaurar el estudiante');
    }
  };

  const handleViewDoc = (applicant) => {
    alert(`Ver documento de ${applicant.FIRST_NAME} ${applicant.LAST_NAME}`);
  };

  const buttonPrimaryStyle = {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '800',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    letterSpacing: '0.01em'
  };

  const buttonSecondaryStyle = {
    backgroundColor: '#ffffff',
    color: '#334155',
    border: '2px solid #94a3b8',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '800',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    letterSpacing: '0.01em'
  };

  const buttonSuccessStyle = {
    backgroundColor: '#16a34a',
    color: '#ffffff',
    border: '2px solid #15803d',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '800',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    letterSpacing: '0.01em'
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '2.5rem', 
      backgroundColor: '#1f2937' 
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: '#cbd5e1', 
        borderRadius: '0.75rem', 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
        padding: '2rem', 
        marginBottom: '2.5rem' 
      }}>
        <h1 style={{ 
          fontSize: '2.25rem', 
          fontWeight: '800', 
          color: '#0f172a', 
          marginBottom: '0.5rem', 
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
          letterSpacing: '-0.02em' 
        }}>
          Gestión de Solicitante
        </h1>
        <p style={{ 
          fontSize: '1.125rem', 
          color: '#1e293b', 
          fontWeight: '600' 
        }}>
          Administra solicitantes, decentes y personal de almacén
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '2rem', 
        marginBottom: '2.5rem' 
      }}>
        <StatsCard title="Total Solicitante" value={stats.total} />
        <StatsCard title="Activos" value={stats.active} />
        <StatsCard title="Inactivos" value={stats.inactive} />
      </div>

      {/* Filters and Actions */}
      <div style={{ 
        backgroundColor: '#cbd5e1', 
        borderRadius: '0.75rem', 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
        padding: '2rem', 
        marginBottom: '2.5rem' 
      }}>
        <h2 style={{ 
          fontSize: '1.375rem', 
          fontWeight: '800', 
          color: '#0f172a', 
          marginBottom: '1.5rem',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
          letterSpacing: '-0.01em'
        }}>
          Filtros y Búsqueda
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '1.5rem' 
        }}>
          <button 
            style={buttonPrimaryStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            }}
          >
            <UserCheck size={18} />
            Nombre, Apellido o DNI
          </button>
          <button 
            style={buttonSecondaryStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
              e.currentTarget.style.borderColor = '#64748b';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#94a3b8';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Apellido de Referencia
          </button>
          <button 
            style={buttonSecondaryStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
              e.currentTarget.style.borderColor = '#64748b';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#94a3b8';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Todos los semestres
          </button>
          <button 
            style={buttonSecondaryStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
              e.currentTarget.style.borderColor = '#64748b';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#94a3b8';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Todos los estados
          </button>
        </div>

        <button 
          onClick={handleCreate}
          style={buttonSuccessStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#15803d';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#16a34a';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
          }}
        >
          <Plus size={20} />
          Crear Nuevo Estudiante
        </button>
      </div>

      {/* Search and Status Filter */}
      <div style={{ 
        backgroundColor: '#cbd5e1', 
        borderRadius: '0.75rem', 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
        padding: '2rem', 
        marginBottom: '2.5rem' 
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <h2 style={{ 
            fontSize: '1.375rem', 
            fontWeight: '800', 
            color: '#0f172a',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
            letterSpacing: '-0.01em'
          }}>
            Lista de Solicitante
          </h2>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search 
                style={{ 
                  position: 'absolute', 
                  left: '0.75rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: '#94a3b8' 
                }} 
                size={20} 
              />
              <input
                type="text"
                placeholder="Buscar Solicitante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  paddingLeft: '2.5rem',
                  paddingRight: '1rem',
                  paddingTop: '0.625rem',
                  paddingBottom: '0.625rem',
                  border: '2px solid #94a3b8',
                  borderRadius: '0.5rem',
                  width: '18rem',
                  backgroundColor: '#ffffff',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#94a3b8';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '0.625rem 1rem',
                border: '2px solid #94a3b8',
                borderRadius: '0.5rem',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                fontSize: '0.875rem',
                cursor: 'pointer',
                fontWeight: '600',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#94a3b8';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="A">Activos</option>
              <option value="I">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ 
        backgroundColor: '#cbd5e1', 
        borderRadius: '0.75rem', 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
        padding: '2rem' 
      }}>
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 0' 
          }}>
            <div style={{
              display: 'inline-block',
              width: '3rem',
              height: '3rem',
              border: '4px solid #e2e8f0',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }}></div>
            <p style={{ 
              marginTop: '1rem', 
              color: '#475569',
              fontWeight: '600'
            }}>Cargando...</p>
          </div>
        ) : (
          <ApplicantTable
            applicants={filteredApplicants}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRestore={handleRestore}
            onViewDoc={handleViewDoc}
          />
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingApplicant ? 'Editar Estudiante' : 'Nuevo Estudiante'}
      >
        <ApplicantForm
          initialData={editingApplicant}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ApplicantPage;