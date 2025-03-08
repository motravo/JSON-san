document.getElementById('submitBtn').addEventListener('click', function() {
    const jsonText = document.getElementById('jsonInput').value;
    let jsonData;
    try {
        jsonData = JSON.parse(jsonText);
    } catch (e) {
        alert('Invalid JSON data. Please check your input.');
        return;
    }

    // Hide the input field and button
    document.getElementById('jsonInput').style.display = 'none';
    document.getElementById('submitBtn').style.display = 'none';

    const viewer = document.getElementById('jsonViewer');
    viewer.innerHTML = ''; // Clear previous content if any
    const tree = document.createElement('ul');
    buildTree(jsonData, tree);
    viewer.appendChild(tree);
});

function buildTree(data, parentElement, path = []) {
    if (typeof data === 'object' && data !== null) {
        const isArray = Array.isArray(data);
        let index = 0;
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                const item = data[key];
                const currentPath = path.concat(key);
                const li = document.createElement('li');

                let displayKey = isArray ? index.toString() : key;
                index++;

                const span = document.createElement('span');
                span.classList.add('collapsible', 'collapsed');
                span.textContent = displayKey;

                const childUl = document.createElement('ul');
                childUl.classList.add('hidden');
                buildTree(data[key], childUl, currentPath);

                // Check if the node has grandchild elements
                let hasGrandchildren = false;
                if (childUl.children.length > 0) {
                    for (let i = 0; i < childUl.children.length; i++) {
                        const childLi = childUl.children[i];
                        const grandchildUl = childLi.querySelector('ul');
                        if (grandchildUl && grandchildUl.children.length > 0) {
                            hasGrandchildren = true;
                            break;
                        }
                    }
                }

                // Create the "Expand All" link if there are grandchild elements
                const expandAllLink = document.createElement('a');
                expandAllLink.classList.add('expand-all-link');
                expandAllLink.textContent = '[Expand All]';
                expandAllLink.href = '#'; // Make it look like a link

                if (!hasGrandchildren) {
                    expandAllLink.style.display = 'none';
                }

                // Toggle collapse/expand on span (node label) click
                span.addEventListener('click', function() {
                    if (childUl.classList.contains('hidden')) {
                        childUl.classList.remove('hidden');
                        span.classList.remove('collapsed');
                        span.classList.add('expanded');
                        // Hide the expand all link when node is expanded
                        expandAllLink.style.display = 'none';
                    } else {
                        childUl.classList.add('hidden');
                        span.classList.remove('expanded');
                        span.classList.add('collapsed');
                        // Show the expand all link when node is collapsed and has grandchildren
                        if (hasGrandchildren) {
                            expandAllLink.style.display = 'inline';
                        }
                    }
                });

                // Expand all child nodes on "Expand All" link click
                expandAllLink.addEventListener('click', function(event) {
                    event.preventDefault(); // Prevent default link behavior
                    event.stopPropagation(); // Prevent triggering the span click event
                    expandAll(childUl);
                    // Update the span state
                    span.classList.remove('collapsed');
                    span.classList.add('expanded');
                    // Hide the expand all link after expanding
                    expandAllLink.style.display = 'none';
                });

                li.appendChild(span);
                li.appendChild(expandAllLink); // Append the link after the span

                // Add button for string attributes
                if (typeof item === 'string') {
                    const addLink = document.createElement('a');
                    addLink.textContent = 'Add to list element label';
                    addLink.href = '#'; // Make it look like a link
                    addLink.style.cursor = 'pointer';
                    addLink.style.textDecoration = 'underline';
                    addLink.style.color = 'blue';
                    addLink.addEventListener('click', function(event) {
                        event.preventDefault(); // Prevent default link behavior
                        event.stopPropagation();
                        addToLabel(data, currentPath);
                    });
                    li.appendChild(addLink);
                }

                li.appendChild(childUl);
                parentElement.appendChild(li);
            }
        }
    } else {
        const li = document.createElement('li');
        li.textContent = data;
        parentElement.appendChild(li);
    }
}

function expandAll(element) {
    // Expand the current element
    if (element.classList.contains('hidden')) {
        element.classList.remove('hidden');
    }

    // Find all collapsible spans within this element and set them to expanded
    const spans = element.querySelectorAll('span.collapsible');
    spans.forEach(function(span) {
        span.classList.remove('collapsed');
        span.classList.add('expanded');
    });

    // Hide all expand all buttons within this element
    const expandAllButtons = element.querySelectorAll('.expand-all');
    expandAllButtons.forEach(function(button) {
        button.style.display = 'none';
    });

    // Recursively expand all child uls
    const childUls = element.querySelectorAll('ul.hidden');
    childUls.forEach(function(ul) {
        ul.classList.remove('hidden');
    });
}

function addToLabel(data, path) {
    if (Array.isArray(data)) {
        data.forEach((element, index) => {
            let target = element;
            for (let i = 0; i < path.length; i++) {
                if (target && typeof target === 'object') {
                    target = target[path[i]];
                } else {
                    return;
                }
            }
            if (typeof target === 'string') {
                const listItem = document.querySelector(`li:contains('${index}') > span`);
                if (listItem) {
                    listItem.textContent += ` - ${target}`;
                }
            }
        });
    }
}
