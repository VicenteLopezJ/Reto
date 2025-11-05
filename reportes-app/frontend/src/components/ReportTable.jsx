import { useEffect, useState } from 'react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function ReportTable() {
  const [reportes, setReportes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5000/api/reportes')
      .then(res => res.json())
      .then(data => {
        setReportes(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error:', err)
        setLoading(false)
      })
  }, [])

  const generarPDF = () => {
    try {
      console.log('Generando PDF...') 
      
      const doc = new jsPDF()
      
      // Título del documento
      doc.setFontSize(20)
      doc.setTextColor(59, 130, 246) 
      doc.text('Reportes de Proyectos', 14, 20)
      
      // Fecha
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 14, 28)
      
      // Estadísticas
      const aprobados = reportes.filter(r => r.resultado === 'Aprobado').length
      const observados = reportes.filter(r => r.resultado === 'Observado').length
      const rechazados = reportes.filter(r => r.resultado === 'Rechazado').length
      
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      doc.text(`Total de reportes: ${reportes.length}`, 14, 36)
      doc.text(`Aprobados: ${aprobados} | Observados: ${observados} | Rechazados: ${rechazados}`, 14, 42)
      
      // Preparar datos para la tabla
      const tableData = reportes.map(r => [
        r.id,
        r.nombre,
        r.resultado
      ])
      
      // Generar tabla
      doc.autoTable({
        startY: 50,
        head: [['ID', 'Nombre del Proyecto', 'Estado']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [59, 130, 246], 
          textColor: 255,
          fontSize: 11,
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: {
          fontSize: 10
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 20 },
          1: { halign: 'left', cellWidth: 90 },
          2: { halign: 'center', cellWidth: 40 }
        },
        didParseCell: function(data) {
          
          if (data.column.index === 2 && data.section === 'body') {
            const estado = data.cell.raw
            if (estado === 'Aprobado') {
              data.cell.styles.textColor = [22, 163, 74] 
              data.cell.styles.fontStyle = 'bold'
            } else if (estado === 'Observado') {
              data.cell.styles.textColor = [202, 138, 4] 
              data.cell.styles.fontStyle = 'bold'
            } else if (estado === 'Rechazado') {
              data.cell.styles.textColor = [220, 38, 38] 
              data.cell.styles.fontStyle = 'bold'
            }
          }
        }
      })
      
      // Guardar el PDF
      doc.save(`reportes_proyectos_${new Date().toISOString().split('T')[0]}.pdf`)
      console.log('PDF generado exitosamente') // Para debug
      
    } catch (error) {
      console.error('Error al generar PDF:', error)
      alert('Error al generar el PDF. Revisa la consola para más detalles.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <div className="text-xl text-gray-700 font-semibold animate-pulse">Cargando reportes...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 animate-gradient">
      <div className="max-w-6xl mx-auto">
        {/* Card principal con animación de entrada */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-3xl animate-fade-in">
          
          {/* Header con gradiente animado y botón PDF */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-3 drop-shadow-lg">
                  <span className="text-4xl animate-bounce">📊</span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                    Reportes de Proyectos
                  </span>
                </h2>
                <p className="text-blue-100 mt-2 text-sm font-medium">
                  Gestión y seguimiento de proyectos en tiempo real
                </p>
              </div>
              
              {/* Botón para generar PDF */}
              <button
                onClick={generarPDF}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar PDF
              </button>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-r from-gray-50 to-blue-50/30">
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-green-600 text-2xl font-bold">{reportes.filter(r => r.resultado === 'Aprobado').length}</div>
              <div className="text-gray-600 text-sm font-medium">Aprobados</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-yellow-600 text-2xl font-bold">{reportes.filter(r => r.resultado === 'Observado').length}</div>
              <div className="text-gray-600 text-sm font-medium">Observados</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-red-600 text-2xl font-bold">{reportes.filter(r => r.resultado === 'Rechazado').length}</div>
              <div className="text-gray-600 text-sm font-medium">Rechazados</div>
            </div>
          </div>

          {/* Table con animaciones */}
          <div className="overflow-x-auto p-6">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-100 to-blue-50 border-b-2 border-blue-200">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                      ID
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
                      Nombre del Proyecto
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></span>
                      Estado
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportes.map((r, index) => (
                  <tr 
                    key={r.id} 
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg cursor-pointer animate-slide-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                          {r.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                        {r.nombre}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-5 py-2 inline-flex items-center gap-2 text-xs leading-5 font-bold rounded-full shadow-md transform transition-all duration-300 hover:scale-110 hover:shadow-xl
                        ${r.resultado === 'Aprobado' 
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-300 hover:from-green-200 hover:to-emerald-200' 
                          : r.resultado === 'Observado' 
                          ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-2 border-yellow-300 hover:from-yellow-200 hover:to-amber-200' 
                          : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-2 border-red-300 hover:from-red-200 hover:to-rose-200'}`}>
                        <span className={`w-2 h-2 rounded-full animate-pulse
                          ${r.resultado === 'Aprobado' ? 'bg-green-600' : r.resultado === 'Observado' ? 'bg-yellow-600' : 'bg-red-600'}`}>
                        </span>
                        {r.resultado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer mejorado */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 px-8 py-5 border-t-2 border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                Total de reportes: 
                <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  {reportes.length}
                </span>
              </p>
              <div className="text-xs text-gray-500 font-medium">
                Última actualización: {new Date().toLocaleDateString('es-ES')}
              </div>
            </div>
          </div>
        </div>

        {/* Nota informativa */}
        <div className="mt-6 text-center text-sm text-gray-600 animate-fade-in" style={{ animationDelay: '500ms' }}>
          <p className="bg-white/60 backdrop-blur-sm rounded-lg px-4 py-3 inline-block shadow-md">
            Haz clic en "Descargar PDF" para exportar este reporte
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}