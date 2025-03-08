import React, { useState } from 'react';
import TreeNode from './TreeNode';

const JSONViewer = ({ data }) => {
  const [attributesToShow, setAttributesToShow] = useState({});
  // Create a ref for the root TreeNode
  const rootTreeNodeRef = React.useRef(null);

  const updateAttributesToShow = (path, attribute) => {
    setAttributesToShow(prev => {
      const newAttributes = { ...prev };
      if (!newAttributes[path]) {
        newAttributes[path] = [];
      }
      if (!newAttributes[path].includes(attribute)) {
        newAttributes[path] = [...newAttributes[path], attribute];
      }
      
      // Collapse nodes under the specific path
      setTimeout(() => {
        const nodeRef = findNodeByPath(rootTreeNodeRef.current, path);
        if (nodeRef && typeof nodeRef.collapseAllNodes === 'function') {
          nodeRef.collapseAllNodes();
        }
      }, 0);
      
      return newAttributes;
    });
  };

  // Function to find a node by path
  const findNodeByPath = (rootNode, path) => {
    let currentNode = rootNode;
    if (!path || path === '') {
      return currentNode;
    }
    for (const key of path.split(' > ')) {
      if (currentNode && currentNode.nodeItemRefs) {
        const newNode = currentNode.nodeItemRefs.current.find(ref => ref.current.nodeKey === key);
        if (newNode) {
          currentNode = newNode.current;
          // If this is a NodeItem with a childTreeNodeRef, we need to use it to get the nested TreeNode
          if (currentNode.childTreeNodeRef && currentNode.childTreeNodeRef.current) {
            currentNode = currentNode.childTreeNodeRef.current;
          }
        } else {
          console.log('newNode is null or undefined');
        }
      }
    }
    return currentNode;
  };

  if (!data) return null;
  
  return (
    <div className="json-viewer">
      <div>
        {/* <div className="json-viewer-controls">
          <button 
            onClick={() => {
              if (rootTreeNodeRef.current && typeof rootTreeNodeRef.current.collapseAllNodes === 'function') {
                rootTreeNodeRef.current.collapseAllNodes();
              }
            }}
            className="collapse-all-button"
          >
            Collapse All
          </button>
        </div> */}
        <ul>
          <TreeNode 
            ref={rootTreeNodeRef}
            className="root-tree-node"
            data={data} 
            path={[]} 
            attributesToShow={attributesToShow}
            updateAttributesToShow={updateAttributesToShow}
            ancestorArrayPath={Array.isArray(data) ? [] : null}
          />
        </ul>
      </div>
    </div>
  );
};

export default JSONViewer;