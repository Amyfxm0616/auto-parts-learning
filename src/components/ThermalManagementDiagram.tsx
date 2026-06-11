import React from 'react';
import type { ThermalAssembly, ThermalCategory } from '../data/thermalManagementAssembly';

interface Props {
  assemblies: ThermalAssembly[];
  selectedAssemblyId: string;
  onAssemblyClick: (id: string) => void;
}

const CATEGORY_CONFIG: Record<ThermalCategory, { label: string; color: string; bg: string; border: string; headerBg: string }> = {
  refrigeration_heat: { label: '制冷/热系统',       color: '#1d4ed8', bg: '#eff6ff', border: '#93c5fd', headerBg: '#dbeafe' },
  cooling_heat:       { label: '冷却/散热系统',     color: '#15803d', bg: '#f0fdf4', border: '#86efac', headerBg: '#dcfce7' },
  air:                { label: '空气调节/输送系统', color: '#7e22ce', bg: '#faf5ff', border: '#c4b5fd', headerBg: '#ede9fe' },
};

const CATEGORY_ORDER: ThermalCategory[] = ['refrigeration_heat', 'cooling_heat', 'air'];

const ThermalManagementDiagram: React.FC<Props> = ({ assemblies, selectedAssemblyId, onAssemblyClick }) => {
  const grouped = CATEGORY_ORDER.reduce<Record<ThermalCategory, ThermalAssembly[]>>(
    (acc, cat) => {
      acc[cat] = assemblies.filter(a => a.category === cat);
      return acc;
    },
    { refrigeration_heat: [], cooling_heat: [], air: [] }
  );

  return (
    <div style={{ fontFamily: 'inherit' }}>
      {/* 3列布局 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '12px',
        padding: '16px',
        background: '#f8fafc',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
      }}>
        {CATEGORY_ORDER.map(cat => {
          const cfg = CATEGORY_CONFIG[cat];
          const items = grouped[cat];
          return (
            <div key={cat} style={{
              background: cfg.bg,
              border: `1.5px solid ${cfg.border}`,
              borderRadius: '8px',
              overflow: 'hidden',
            }}>
              {/* Quadrant header */}
              <div style={{
                background: cfg.headerBg,
                borderBottom: `1px solid ${cfg.border}`,
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
                <span style={{
                  background: cfg.color,
                  color: '#fff',
                  fontSize: '11px',
                  borderRadius: '10px',
                  padding: '1px 7px',
                  fontWeight: 600,
                }}>{items.length}</span>
              </div>
              {/* Assembly boxes */}
              <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {items.map(assembly => {
                  const isSelected = assembly.id === selectedAssemblyId;
                  const subCount = assembly.subAssemblies.length;
                  return (
                    <button
                      key={assembly.id}
                      onClick={() => onAssemblyClick(assembly.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: isSelected ? `2px solid ${cfg.color}` : `1px solid ${cfg.border}`,
                        background: isSelected ? cfg.color : '#fff',
                        color: isSelected ? '#fff' : '#1e293b',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                        transition: 'all 0.15s ease',
                        fontFamily: 'inherit',
                        fontSize: '12px',
                        fontWeight: isSelected ? 600 : 400,
                        boxShadow: isSelected ? `0 2px 8px ${cfg.color}44` : 'none',
                      }}
                      onMouseEnter={e => {
                        if (!isSelected) {
                          (e.currentTarget as HTMLButtonElement).style.background = cfg.headerBg;
                          (e.currentTarget as HTMLButtonElement).style.borderColor = cfg.color;
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) {
                          (e.currentTarget as HTMLButtonElement).style.background = '#fff';
                          (e.currentTarget as HTMLButtonElement).style.borderColor = cfg.border;
                        }
                      }}
                    >
                      <span style={{ fontSize: '16px', flexShrink: 0 }}>{assembly.icon}</span>
                      <span style={{ flex: 1, lineHeight: 1.3 }}>{assembly.name}</span>
                      <span style={{
                        background: isSelected ? 'rgba(255,255,255,0.25)' : cfg.headerBg,
                        color: isSelected ? '#fff' : cfg.color,
                        fontSize: '11px',
                        borderRadius: '10px',
                        padding: '1px 6px',
                        flexShrink: 0,
                        fontWeight: 600,
                        border: isSelected ? '1px solid rgba(255,255,255,0.4)' : `1px solid ${cfg.border}`,
                      }}>
                        {subCount}个子总成
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: '10px',
        padding: '0 8px',
      }}>
        {CATEGORY_ORDER.map(cat => {
          const cfg = CATEGORY_CONFIG[cat];
          return (
            <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{
                width: '12px', height: '12px', borderRadius: '3px',
                background: cfg.color, flexShrink: 0,
              }} />
              <span style={{ fontSize: '12px', color: '#64748b' }}>{cfg.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ThermalManagementDiagram;
