'use client'
import React, { useState } from 'react';
import { User, Package, ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';

// Details Page Generator Component
const DetailsGenerator = ({ config, data }) => {
  const [expandedSections, setExpandedSections] = useState(
    config.sections.reduce((acc, section, idx) => {
      acc[idx] = section.defaultExpanded !== false;
      return acc;
    }, {})
  );

  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const renderValue = (field, data) => {
    // Handle custom value functions
    if (field.customValue && typeof field.customValue === 'function') {
      return field.customValue(data);
    }

    // Handle nested data paths (e.g., "address.city")
    const value = field.key.split('.').reduce((obj, key) => obj?.[key], data);

    // Handle formatting
    if (field.format) {
      return field.format(value, data);
    }

    // Default rendering
    if (value === null || value === undefined) {
      return <span className="text-gray-400 italic">Not provided</span>;
    }

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    if (Array.isArray(value)) {
      return value.join(', ');
    }

    return String(value);
  };

  const getSectionIcon = (iconName) => {
    const icons = {
      user: User,
      package: Package,
      cart: ShoppingCart,
    };
    const Icon = icons[iconName];
    return Icon ? <Icon className="w-5 h-5" /> : null;
  };

  // Determine grid columns based on section width
  const getGridClass = (section) => {
    const width = section.width || 'full';
    const widthClasses = {
      full: 'col-span-1 sm:col-span-2 lg:col-span-3',
      half: 'col-span-1 sm:col-span-1 lg:col-span-1',
      'two-thirds': 'col-span-1 sm:col-span-2 lg:col-span-2',
      'one-third': 'col-span-1 sm:col-span-1 lg:col-span-1',
    };
    return widthClasses[width] || widthClasses.full;
  };

  // Determine field grid columns
  const getFieldGridClass = (columns) => {
    if (columns === 1) return 'grid-cols-1';
    if (columns === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    return 'grid-cols-1 sm:grid-cols-2'; // default to 2 columns
  };

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      {config.title && (
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            {config.title}
          </h1>
          {config.subtitle && (
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              {config.subtitle}
            </p>
          )}
        </div>
      )}

      {/* Sections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 items-start">
        {config.sections.map((section, sectionIdx) => (
          <div
            key={sectionIdx}
            className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col ${expandedSections[sectionIdx] ? 'h-full' : 'h-auto'} ${getGridClass(section)}`}
          >
            {/* Section Header */}
            <button
              onClick={() => toggleSection(sectionIdx)}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                {section.icon && (
                  <div className="text-blue-600 flex-shrink-0">
                    {getSectionIcon(section.icon)}
                  </div>
                )}
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 text-left">
                  {section.title}
                </h2>
              </div>
              {expandedSections[sectionIdx] ? (
                <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
              )}
            </button>

            {/* Section Content */}
            {expandedSections[sectionIdx] && (
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex-grow">
                {section.description && (
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    {section.description}
                  </p>
                )}
                <div className={`grid gap-3 sm:gap-4 ${getFieldGridClass(section.columns || 2)}`}>
                  {section.fields.map((field, fieldIdx) => (
                    <div key={fieldIdx} className="flex flex-col min-w-0">
                      <span className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                        {field.label}
                      </span>
                      <span className="text-sm sm:text-base text-gray-900 break-words">
                        {renderValue(field, data)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};


export default DetailsGenerator