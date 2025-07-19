import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './LearningPathVisualization.css';

const LearningPathVisualization = () => {
  const svgRef = useRef();
  const containerRef = useRef();
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null); // null means show all

  // Function to calculate overall progress
  const calculateProgress = () => {
    // Get data from the getResponsivePositions function
    const { nodes } = getResponsivePositions(dimensions.width, dimensions.height);
    const completedCount = nodes.filter(node => node.status === 'Completed').length;
    const inProgressCount = nodes.filter(node => node.status === 'In Progress').length;
    const totalNodes = nodes.length;
    
    // Calculate weighted progress (completed = 1, in progress = 0.5, not started = 0)
    const weightedProgress = (completedCount + inProgressCount * 0.5) / totalNodes * 100;
    
    return {
      completed: completedCount,
      inProgress: inProgressCount,
      total: totalNodes,
      percentage: Math.round(weightedProgress)
    };
  };

  // Function to get responsive node positions
  const getResponsivePositions = (width, height) => {
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const nodeRadius = isMobile ? 20 : isTablet ? 24 : 28;
    
    // Add padding to prevent nodes from being too close to edges
    const paddingX = isMobile ? width * 0.1 : width * 0.08;
    const paddingY = isMobile ? height * 0.1 : height * 0.08;
    const usableWidth = width - (paddingX * 2);
    const usableHeight = height - (paddingY * 2);
    
    if (isMobile) {
      // Mobile layout - Natural horizontal flow with slight variations
      return {
        nodes: [
          { id: 'basics', title: 'Math Basics', status: 'Completed', score: 95, x: paddingX + usableWidth * 0.08, y: paddingY + usableHeight * 0.4 },
          { id: 'arithmetic', title: 'Basic Arithmetic', status: 'Completed', score: 92, x: paddingX + usableWidth * 0.22, y: paddingY + usableHeight * 0.25 },
          { id: 'fractions', title: 'Fractions & Decimals', status: 'Completed', score: 89, x: paddingX + usableWidth * 0.2, y: paddingY + usableHeight * 0.6 },
          { id: 'algebra', title: 'Algebra Fundamentals', status: 'Completed', score: 88, x: paddingX + usableWidth * 0.35, y: paddingY + usableHeight * 0.42 },
          { id: 'equations', title: 'Linear Equations', status: 'In Progress', score: 65, x: paddingX + usableWidth * 0.48, y: paddingY + usableHeight * 0.2 },
          { id: 'inequalities', title: 'Inequalities', status: 'In Progress', score: 58, x: paddingX + usableWidth * 0.52, y: paddingY + usableHeight * 0.65 },
          { id: 'functions', title: 'Functions', status: 'In Progress', score: 42, x: paddingX + usableWidth * 0.62, y: paddingY + usableHeight * 0.4 },
          { id: 'systems', title: 'Systems of Equations', status: 'Not Started', score: 0, x: paddingX + usableWidth * 0.72, y: paddingY + usableHeight * 0.15 },
          { id: 'graphing', title: 'Graphing Functions', status: 'Not Started', score: 0, x: paddingX + usableWidth * 0.75, y: paddingY + usableHeight * 0.55 },
          { id: 'quadratic', title: 'Quadratic Equations', status: 'Not Started', score: 0, x: paddingX + usableWidth * 0.85, y: paddingY + usableHeight * 0.35 },
          { id: 'polynomials', title: 'Polynomials', status: 'Not Started', score: 0, x: paddingX + usableWidth * 0.92, y: paddingY + usableHeight * 0.2 },
          { id: 'trigonometry', title: 'Trigonometry', status: 'Not Started', score: 0, x: paddingX + usableWidth * 0.9, y: paddingY + usableHeight * 0.6 }
        ],
        nodeRadius
      };
    } else if (isTablet) {
      // Tablet layout - Natural horizontal progression with organic positioning
      return {
        nodes: [
          { id: 'basics', title: 'Math Basics', status: 'Completed', score: 95, x: paddingX + usableWidth * 0.12, y: paddingY + usableHeight * 0.45 },
          { id: 'arithmetic', title: 'Basic Arithmetic', status: 'Completed', score: 92, x: paddingX + usableWidth * 0.25, y: paddingY + usableHeight * 0.3 },
          { id: 'fractions', title: 'Fractions & Decimals', status: 'Completed', score: 89, x: paddingX + usableWidth * 0.22, y: paddingY + usableHeight * 0.65 },
          { id: 'algebra', title: 'Algebra Fundamentals', status: 'Completed', score: 88, x: paddingX + usableWidth * 0.38, y: paddingY + usableHeight * 0.48 },
          { id: 'equations', title: 'Linear Equations', status: 'In Progress', score: 65, x: paddingX + usableWidth * 0.5, y: paddingY + usableHeight * 0.25 },
          { id: 'inequalities', title: 'Inequalities', status: 'In Progress', score: 58, x: paddingX + usableWidth * 0.52, y: paddingY + usableHeight * 0.7 },
          { id: 'functions', title: 'Functions', status: 'In Progress', score: 42, x: paddingX + usableWidth * 0.62, y: paddingY + usableHeight * 0.45 },
          { id: 'systems', title: 'Systems of Equations', status: 'Not Started', score: 0, x: paddingX + usableWidth * 0.72, y: paddingY + usableHeight * 0.2 },
          { id: 'graphing', title: 'Graphing Functions', status: 'Not Started', score: 0, x: paddingX + usableWidth * 0.75, y: paddingY + usableHeight * 0.65 },
          { id: 'quadratic', title: 'Quadratic Equations', status: 'Not Started', score: 0, x: paddingX + usableWidth * 0.82, y: paddingY + usableHeight * 0.4 },
          { id: 'polynomials', title: 'Polynomials', status: 'Not Started', score: 0, x: paddingX + usableWidth * 0.88, y: paddingY + usableHeight * 0.25 },
          { id: 'trigonometry', title: 'Trigonometry', status: 'Not Started', score: 0, x: paddingX + usableWidth * 0.9, y: paddingY + usableHeight * 0.6 }
        ],
        nodeRadius
      };
    } else {
      // Desktop layout - Natural horizontal flow with organic variation
      return {
        nodes: [
          { id: 'basics', title: 'Math Basics', status: 'Completed', score: 95, x: paddingX + usableWidth * 0.1, y: paddingY + usableHeight * 0.5 },
          { id: 'arithmetic', title: 'Basic Arithmetic', status: 'Completed', score: 92, x: paddingX + usableWidth * 0.22, y: paddingY + usableHeight * 0.35 },
          { id: 'fractions', title: 'Fractions & Decimals', status: 'Completed', score: 89, x: paddingX + usableWidth * 0.2, y: paddingY + usableHeight * 0.68 },
          { id: 'algebra', title: 'Algebra Fundamentals', status: 'Completed', score: 88, x: paddingX + usableWidth * 0.32, y: paddingY + usableHeight * 0.52 },
          { id: 'equations', title: 'Linear Equations', status: 'In Progress', score: 65, x: paddingX + usableWidth * 0.45, y: paddingY + usableHeight * 0.3 },
          { id: 'inequalities', title: 'Inequalities', status: 'In Progress', score: 58, x: paddingX + usableWidth * 0.42, y: paddingY + usableHeight * 0.72 },
          { id: 'functions', title: 'Functions', status: 'In Progress', score: 42, x: paddingX + usableWidth * 0.55, y: paddingY + usableHeight * 0.48 },
          { id: 'systems', title: 'Systems of Equations', status: 'Not Started', score: 0, x: paddingX + usableWidth * 0.68, y: paddingY + usableHeight * 0.25 },
          { id: 'graphing', title: 'Graphing Functions', status: 'Not Started', score: 0, x: paddingX + usableWidth * 0.65, y: paddingY + usableHeight * 0.7 },
          { id: 'quadratic', title: 'Quadratic Equations', status: 'Not Started', score: 0, x: paddingX + usableWidth * 0.75, y: paddingY + usableHeight * 0.45 },
          { id: 'polynomials', title: 'Polynomials', status: 'Not Started', score: 0, x: paddingX + usableWidth * 0.85, y: paddingY + usableHeight * 0.35 },
          { id: 'trigonometry', title: 'Trigonometry', status: 'Not Started', score: 0, x: paddingX + usableWidth * 0.88, y: paddingY + usableHeight * 0.65 }
        ],
        nodeRadius
      };
    }
  };

  // Handle legend clicks for filtering
  const handleLegendClick = (status) => {
    setActiveFilter(activeFilter === status ? null : status);
  };

  // Get node color based on status
  const getNodeColor = (status) => {
    switch(status) {
      case 'Completed':
        return '#22c55e';
      case 'In Progress':
        return '#eab308';
      case 'Not Started':
        return '#9ca3af';
      default:
        return '#9ca3af';
    }
  };

  // Get node stroke color for better visibility
  const getNodeStroke = (status) => {
    switch(status) {
      case 'Completed':
        return '#16a34a';
      case 'In Progress':
        return '#ca8a04';
      case 'Not Started':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  // Handle resize
  useEffect(() => {
    let resizeTimeout;
    
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const newWidth = Math.max(280, containerWidth - 20);
        
        // Better aspect ratios for different screen sizes
        let aspectRatio;
        if (newWidth < 480) {
          aspectRatio = 1.4; // Taller on small phones
        } else if (newWidth < 768) {
          aspectRatio = 1.2; // Mobile
        } else if (newWidth < 1024) {
          aspectRatio = 0.8; // Tablet
        } else {
          aspectRatio = 0.4; // Desktop - much flatter to utilize available space
        }
        
        const newHeight = Math.max(200, newWidth * aspectRatio);
        
        setDimensions({ width: newWidth, height: newHeight });
        if (!isInitialized) {
          setIsInitialized(true);
        }
      }
    };
    
    const handleResize = () => {
      // Debounce resize to avoid too many re-renders
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateDimensions, 100);
    };

    // Initial calculation - run immediately and ensure it happens
    const initializeWithTimeout = () => {
      // Add a small delay to ensure container is properly mounted
      setTimeout(() => {
        updateDimensions();
        // Fallback in case container isn't ready
        if (!isInitialized) {
          setTimeout(updateDimensions, 200);
        }
      }, 50);
    };
    
    initializeWithTimeout();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [isInitialized]);

  useEffect(() => {
    // Don't render until dimensions are properly initialized
    if (!isInitialized || dimensions.width === 0 || dimensions.height === 0) {
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const { width, height } = dimensions;
    const { nodes, nodeRadius } = getResponsivePositions(width, height);
    
    // Generate links for the 12-node system - Simplified connections
    const allLinks = [
      // Basic foundation flow
      { source: 'basics', target: 'arithmetic' },
      { source: 'basics', target: 'fractions' },
      { source: 'arithmetic', target: 'algebra' },
      { source: 'fractions', target: 'algebra' },
      
      // From algebra to current topics
      { source: 'algebra', target: 'equations' },
      { source: 'algebra', target: 'inequalities' },
      { source: 'equations', target: 'functions' },
      { source: 'inequalities', target: 'functions' },
      
      // From functions to advanced topics
      { source: 'functions', target: 'graphing' },
      { source: 'functions', target: 'systems' },
      { source: 'systems', target: 'quadratic' },
      { source: 'graphing', target: 'quadratic' },
      { source: 'quadratic', target: 'polynomials' },
      { source: 'quadratic', target: 'trigonometry' }
    ];
    
    // Filter nodes and links based on active filter
    const filteredNodes = activeFilter ? nodes.filter(node => node.status === activeFilter) : nodes;
    const visibleNodeIds = new Set(filteredNodes.map(node => node.id));
    const filteredLinks = activeFilter ? 
      allLinks.filter(link => 
        visibleNodeIds.has(link.source) && visibleNodeIds.has(link.target)
      ) : 
      allLinks;
    
    svg.attr('width', width).attr('height', height);
    
    // Responsive font sizes
    const isMobile = width < 768;
    const titleFontSize = isMobile ? '10px' : '12px';
    const scoreFontSize = isMobile ? '10px' : '12px';
    const strokeWidth = isMobile ? 2 : 3;

    // Create links (edges) with better arrow visibility
    const linkElements = svg.selectAll('.link')
      .data(filteredLinks)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('x1', d => {
        const sourceNode = filteredNodes.find(n => n.id === d.source);
        const targetNode = filteredNodes.find(n => n.id === d.target);
        if (!sourceNode || !targetNode) return 0;
        
        // Calculate position at edge of source node
        const dx = targetNode.x - sourceNode.x;
        const dy = targetNode.y - sourceNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const unitX = dx / distance;
        
        return sourceNode.x + unitX * nodeRadius;
      })
      .attr('y1', d => {
        const sourceNode = filteredNodes.find(n => n.id === d.source);
        const targetNode = filteredNodes.find(n => n.id === d.target);
        if (!sourceNode || !targetNode) return 0;
        
        // Calculate position at edge of source node
        const dx = targetNode.x - sourceNode.x;
        const dy = targetNode.y - sourceNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const unitY = dy / distance;
        
        return sourceNode.y + unitY * nodeRadius;
      })
      .attr('x2', d => {
        const sourceNode = filteredNodes.find(n => n.id === d.source);
        const targetNode = filteredNodes.find(n => n.id === d.target);
        if (!sourceNode || !targetNode) return 0;
        
        // Calculate position at edge of target node
        const dx = targetNode.x - sourceNode.x;
        const dy = targetNode.y - sourceNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const unitX = dx / distance;
        
        return targetNode.x - unitX * (nodeRadius + 2);
      })
      .attr('y2', d => {
        const sourceNode = filteredNodes.find(n => n.id === d.source);
        const targetNode = filteredNodes.find(n => n.id === d.target);
        if (!sourceNode || !targetNode) return 0;
        
        // Calculate position at edge of target node
        const dx = targetNode.x - sourceNode.x;
        const dy = targetNode.y - sourceNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const unitY = dy / distance;
        
        return targetNode.y - unitY * (nodeRadius + 2);
      })
      .attr('stroke', '#000000')
      .attr('stroke-width', isMobile ? 2 : 2.5)
      .attr('opacity', 0.8)
      .attr('marker-end', 'url(#arrowhead)')
      .on('mouseover', function(event, d) {
        // Highlight the link and arrow on hover
        d3.select(this)
          .attr('stroke', '#333333')
          .attr('stroke-width', isMobile ? 3 : 4)
          .attr('opacity', 1)
          .attr('marker-end', 'url(#arrowhead-highlight)');
      })
      .on('mouseout', function(event, d) {
        // Reset link styling
        d3.select(this)
          .attr('stroke', '#000000')
          .attr('stroke-width', isMobile ? 2 : 2.5)
          .attr('opacity', 0.8)
          .attr('marker-end', 'url(#arrowhead)');
      });

    // Add arrowhead marker definitions
    const defs = svg.append('defs');
    
    // Main arrowhead marker
    const arrowSize = isMobile ? 8 : 10;
    const arrowWidth = isMobile ? 10 : 12;
    const arrowHeight = isMobile ? 10 : 12;
    
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', `0 -${arrowSize/2} ${arrowSize} ${arrowSize}`)
      .attr('refX', arrowSize + nodeRadius - 2) // Position arrow at edge of target node
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', arrowWidth)
      .attr('markerHeight', arrowHeight)
      .attr('markerUnits', 'userSpaceOnUse')
      .append('path')
      .attr('d', `M 0,-${arrowSize/2} L ${arrowSize},0 L 0,${arrowSize/2} Z`)
      .attr('fill', '#000000')
      .attr('stroke', '#000000')
      .attr('stroke-width', 0.5);
      
    // Highlight arrowhead for hover effects
    defs.append('marker')
      .attr('id', 'arrowhead-highlight')
      .attr('viewBox', `0 -${arrowSize/2} ${arrowSize} ${arrowSize}`)
      .attr('refX', arrowSize + nodeRadius - 2)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', arrowWidth + 2)
      .attr('markerHeight', arrowHeight + 2)
      .attr('markerUnits', 'userSpaceOnUse')
      .append('path')
      .attr('d', `M 0,-${arrowSize/2} L ${arrowSize},0 L 0,${arrowSize/2} Z`)
      .attr('fill', '#333333')
      .attr('stroke', '#333333')
      .attr('stroke-width', 1);

    // Create node groups
    const nodeGroups = svg.selectAll('.node-group')
      .data(filteredNodes)
      .enter()
      .append('g')
      .attr('class', 'node-group')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    // Add circles for nodes
    nodeGroups.append('circle')
      .attr('class', 'node')
      .attr('r', nodeRadius)
      .attr('fill', d => getNodeColor(d.status))
      .attr('stroke', d => getNodeStroke(d.status))
      .attr('stroke-width', strokeWidth)
      .style('cursor', 'pointer')
      .on('mouseenter touchstart', function(event, d) {
        event.preventDefault();
        
        // Highlight node on hover/touch
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', nodeRadius + 4);

        // Show tooltip
        setTooltipData(d);
        const rect = svgRef.current.getBoundingClientRect();
        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);
        
        setTooltipPosition({
          x: Math.min(clientX - rect.left + 10, width - 200),
          y: Math.max(clientY - rect.top - 10, 10)
        });
      })
      .on('mouseleave touchend', function(event) {
        if (event.type === 'touchend') {
          setTimeout(() => {
            setTooltipData(null);
          }, 2000);
        } else {
          setTooltipData(null);
        }
        
        // Reset node size
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', nodeRadius);
      });

    // Add score text in the center of completed/in-progress nodes
    nodeGroups
      .filter(d => d.status !== 'Not Started')
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', 'white')
      .attr('font-size', scoreFontSize)
      .attr('font-weight', 'bold')
      .text(d => d.score);

    // Add topic titles below nodes
    const titleOffset = nodeRadius + 15;
    const wrapWidth = isMobile ? 90 : 110;
    
    nodeGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', `${titleOffset}px`)
      .attr('fill', '#374151')
      .attr('font-size', titleFontSize)
      .attr('font-weight', '600')
      .text(d => d.title)
      .call(wrap, wrapWidth);

    // Text wrapping function
    function wrap(text, width) {
      text.each(function() {
        const text = d3.select(this);
        const words = text.text().split(/\s+/).reverse();
        let word;
        let line = [];
        let lineNumber = 0;
        const lineHeight = 1.1;
        const y = text.attr('y');
        const dy = parseFloat(text.attr('dy'));
        let tspan = text.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', dy + 'px');
        
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(' '));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(' '));
            line = [word];
            tspan = text.append('tspan').attr('x', 0).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'px').text(word);
          }
        }
      });
    }

  }, [dimensions, activeFilter, isInitialized]);

  const progressStats = calculateProgress();

  return (
    <div className="learning-path-container" ref={containerRef}>
      <div className="content-wrapper">
        <div className="header">
          <h2>Learning Path Visualization</h2>
          <div className="subtitle">Track your progress through mathematics topics</div>
          
          <div className="legend">
            <div 
              className={`legend-item ${activeFilter === 'Completed' ? 'active' : ''}`}
              onClick={() => handleLegendClick('Completed')}
            >
              <div className="legend-color completed"></div>
              <span>Completed</span>
            </div>
            <div 
              className={`legend-item ${activeFilter === 'In Progress' ? 'active' : ''}`}
              onClick={() => handleLegendClick('In Progress')}
            >
              <div className="legend-color in-progress"></div>
              <span>In Progress</span>
            </div>
            <div 
              className={`legend-item ${activeFilter === 'Not Started' ? 'active' : ''}`}
              onClick={() => handleLegendClick('Not Started')}
            >
              <div className="legend-color not-started"></div>
              <span>Not Started</span>
            </div>
            <div 
              className={`legend-item show-all ${activeFilter === null ? 'active' : ''}`}
              onClick={() => setActiveFilter(null)}
            >
              <div className="legend-reset-icon">⟲</div>
              <span>Show All</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div className="progress-bar-header">
            <span className="progress-label">Overall Progress</span>
            <span className="progress-percentage">{progressStats.percentage}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressStats.percentage}%` }}
            ></div>
          </div>
          <div className="progress-stats">
            <span className="progress-stat">
              <span className="stat-number">{progressStats.completed}</span> Completed
            </span>
            <span className="progress-stat">
              <span className="stat-number">{progressStats.inProgress}</span> In Progress
            </span>
            <span className="progress-stat">
              <span className="stat-number">{progressStats.total - progressStats.completed - progressStats.inProgress}</span> Not Started
            </span>
          </div>
        </div>
        
        <div className="visualization-wrapper">
          {!isInitialized ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '400px',
              color: '#6b7280',
              fontSize: '16px'
            }}>
              Loading visualization...
            </div>
          ) : (
            <svg ref={svgRef}></svg>
          )}
          
          {tooltipData && (
            <div 
              className="tooltip" 
              style={{
                left: tooltipPosition.x,
                top: tooltipPosition.y
              }}
            >
              <div className="tooltip-title">{tooltipData.title}</div>
              <div className="tooltip-status">Status: {tooltipData.status}</div>
              <div className="tooltip-score">Score: {tooltipData.score}%</div>
              {tooltipData.status === 'In Progress' && (
                <div className="tooltip-progress">Keep going! You're doing great!</div>
              )}
              {tooltipData.status === 'Completed' && (
                <div className="tooltip-completed">Excellent work! ✓</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningPathVisualization;