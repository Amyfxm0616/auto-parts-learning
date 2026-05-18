import { useState } from 'react';
import { ChevronRight, ChevronDown, Box, Wrench, Layers, Settings } from 'lucide-react';
import { iconMap, type MindMapNode } from '../data/mindMapData';

interface MindMapDiagramProps {
  data: MindMapNode;
  onNodeClick?: (node: MindMapNode) => void;
  className?: string;
}

export default function MindMapDiagram({ data, onNodeClick, className = '' }: MindMapDiagramProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([data.id]));

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const handleNodeClick = (node: MindMapNode, e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.children && node.children.length > 0) {
      toggleNode(node.id);
    }
    onNodeClick?.(node);
  };

  const renderNode = (node: MindMapNode, depth: number = 0): React.ReactNode => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const levelPadding = depth * 24;

    // Get icon based on level or data icon
    let IconComponent;
    if (node.icon && iconMap[node.icon]) {
      IconComponent = iconMap[node.icon];
    } else {
      switch (node.level) {
        case 1: IconComponent = Box; break;
        case 2: IconComponent = Layers; break;
        case 3: IconComponent = Wrench; break;
        default: IconComponent = Settings;
      }
    }

    const colorClass = node.level === 1 ? 'text-purple-600' :
                      node.level === 2 ? 'text-blue-600' :
                      node.level === 3 ? 'text-green-600' : 'text-orange-600';

    return (
      <div key={node.id} className="relative">
        <div
          className={`
            relative flex items-start gap-2 p-3 rounded-lg cursor-pointer
            transition-all duration-200 ease-in-out
            hover:shadow-md hover:-translate-y-0.5
            ${isExpanded ? 'bg-gray-50' : 'bg-white'}
            border border-gray-200 hover:border-gray-300
          `}
          style={{ marginLeft: `${levelPadding}px` }}
          onClick={(e) => handleNodeClick(node, e)}
        >
          {hasChildren && (
            <button
              className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              )}
            </button>
          )}

          <div className="flex-shrink-0 flex items-center justify-center w-6 h-6">
            <IconComponent className={`w-5 h-5 ${colorClass}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">
                {node.name}
              </h3>
              {node.nameEn && (
                <span className="text-xs text-gray-500 italic">
                  ({node.nameEn})
                </span>
              )}
              {hasChildren && (
                <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                  {node.children!.length}
                </span>
              )}
            </div>

            {node.materials && node.materials.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {node.materials.map((material, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-xs bg-green-50 text-green-700 rounded"
                  >
                    {material}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && node.children && (
          <div className="mt-1 space-y-1">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`mind-map-diagram ${className}`}>
      <div className="space-y-1">
        {renderNode(data)}
      </div>
    </div>
  );
}