import React, { useState, useRef, useImperativeHandle } from 'react';

const NodeItem = React.forwardRef(({
  nodeKey,
  value,
  displayKey,
  pathString,
  isObject,
  isArray,
  attributesToShow,
  currentPath,
  ancestorArrayPath,
  updateAttributesToShow,
  relativePathFromAncestorString
}, ref) => {
  const [expanded, setExpanded] = useState(false);
  const childTreeNodeRef = useRef(null);
  
  const expandAll = () => {
    setExpanded(true);
    
    if (childTreeNodeRef.current && typeof childTreeNodeRef.current.expandAllNodes === 'function') {
      setTimeout(() => {
        childTreeNodeRef.current.expandAllNodes();
      }, 0);
    }
  };
  
  const collapseAll = () => {
    setExpanded(false);
    
    if (childTreeNodeRef.current && typeof childTreeNodeRef.current.collapseAllNodes === 'function') {
      setTimeout(() => {
        childTreeNodeRef.current.collapseAllNodes();
      }, 0);
    }
  };
  
  useImperativeHandle(ref, () => ({
    nodeKey,
    expandAll,
    collapseAll,
    childTreeNodeRef
  }));
  
  return (
    <li key={`${pathString}-${nodeKey}`}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span 
          className={`${isObject ? 'collapsible' : 'non-collapsible'} ${isObject && !expanded ? 'collapsed' : ''} ${isObject && expanded ? 'expanded' : ''}`}
          onClick={(e) => {
            if (isObject) {
              if (e.shiftKey) {
                expandAll();
              } else {
                setExpanded(!expanded);
              }
            }
          }}
          title={isObject ? "Shift+Click to expand all children." : ""}
        >
          {displayKey}
          {isArray && attributesToShow[pathString] && 
            attributesToShow[pathString].map((attr, i) => {
              if (value && typeof value === 'object') {
                const attrPath = attr.split('.');
                let current = value;
                for (const part of attrPath) {
                  if (current === undefined || current === null) break;
                  current = current[part];
                }
                
                if (current !== undefined) {
                  const attrName = attrPath[attrPath.length - 1];
                  return ` - ${attrName}: ${typeof current === 'object' ? 'Object' : String(current)}`;
                }
              }
              return '';
            }).join('')
          }
        </span>
        
        {isObject ? (
          <></>
        ) : (
          <>
            <span>: {String(value)}</span>
            {ancestorArrayPath && relativePathFromAncestorString && (() => {
              const ancestorPathString = ancestorArrayPath.join(' > ');
              const notAlreadyAdded = !attributesToShow[ancestorPathString] || 
                !attributesToShow[ancestorPathString].includes(relativePathFromAncestorString);
              
              return notAlreadyAdded ? (
                <a 
                  href="#" 
                  className="add-to-list"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateAttributesToShow(ancestorPathString, relativePathFromAncestorString);
                  }}
                >
                  [^]
                </a>
              ) : null;
            })()}
          </>
        )}
      </div>
      
      {isObject && (
        <ul className={expanded ? '' : 'hidden'}>
          <TreeNode 
            ref={childTreeNodeRef}
            data={value} 
            path={currentPath}
            parentKey={nodeKey}
            attributesToShow={attributesToShow}
            updateAttributesToShow={updateAttributesToShow}
            ancestorArrayPath={isArray ? currentPath : ancestorArrayPath}
          />
        </ul>
      )}
    </li>
  );
});

const TreeNode = React.forwardRef(({ 
  data, 
  path = [], 
  parentKey = null, 
  attributesToShow = {}, 
  updateAttributesToShow,
  ancestorArrayPath = null,
  className = ''
}, ref) => {
  const nodeItemRefs = useRef([]);
  
  // Method to expand all nodes recursively
  const expandAllNodes = () => {
    nodeItemRefs.current.forEach(nodeRef => {
      if (nodeRef && nodeRef.current && typeof nodeRef.current.expandAll === 'function') {
        nodeRef.current.expandAll();
      }
    });
  };
  
  // Method to collapse all nodes recursively
  const collapseAllNodes = () => {
    nodeItemRefs.current.forEach(nodeRef => {
      if (nodeRef && nodeRef.current && typeof nodeRef.current.collapseAll === 'function') {
        nodeRef.current.collapseAll();
      }
    });
  };
  
  // Expose methods and nodeItemRefs via ref
  React.useImperativeHandle(ref, () => ({
    nodeItemRefs,
    expandAllNodes,
    collapseAllNodes,
    nodeKey: parentKey
  }));
  
  // For primitive values or null
  if (data === null || typeof data !== 'object') {
    return (
      <li>
        {data !== undefined ? String(data) : 'null'}
      </li>
    );
  }

  const isArray = Array.isArray(data);
  const entries = Object.entries(data);
  const currentPath = parentKey !== null ? [...path, parentKey] : path;
  const pathString = currentPath.join(' > ');
  
  // Initialize or resize the refs array to match the entries length
  if (nodeItemRefs.current.length !== entries.length) {
    nodeItemRefs.current = Array(entries.length).fill(null).map((_, i) => 
      nodeItemRefs.current[i] || React.createRef()
    );
  }
  
  return (
    <div className={className}>
      {entries.map(([key, value], index) => {
        const isObject = value !== null && typeof value === 'object';
        const displayKey = isArray ? index.toString() : key;
        const newPath = [...currentPath, key];
        
        // Pre-calculate relativePathFromAncestor
        // Calculate relativePathFromAncestor only if ancestorArrayPath exists
        let relativePathFromAncestorString = null;
        if (ancestorArrayPath) {
          let relativePathFromAncestor = newPath.slice(ancestorArrayPath.length);
          // Remove the array index from the path if it exists
          if (relativePathFromAncestor.length > 0 && !isNaN(relativePathFromAncestor[0])) {
            relativePathFromAncestor = relativePathFromAncestor.slice(1);
          }
          relativePathFromAncestorString = relativePathFromAncestor.join('.');
        }
        
        return (
          <NodeItem
            ref={nodeItemRefs.current[index]}
            key={`${pathString}-${key}`}
            nodeKey={key}
            value={value}
            displayKey={displayKey}
            pathString={pathString}
            isObject={isObject}
            isArray={isArray}
            attributesToShow={attributesToShow}
            currentPath={currentPath}
            ancestorArrayPath={ancestorArrayPath}
            updateAttributesToShow={updateAttributesToShow}
            relativePathFromAncestorString={relativePathFromAncestorString}
          />
        );
      })}
    </div>
  );
});

export default TreeNode;