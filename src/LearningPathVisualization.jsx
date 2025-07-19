import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './LearningPathVisualization.css';

const LearningPathVisualization = () => {
  const svgRef = useRef();
  const containerRef = useRef();
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });

  // Function to get responsive node positions
  const getResponsivePositions = (width, height) => {
    const isMobile = width < 768;
    const nodeRadius = isMobile ? 20 : 25;
    
    if (isMobile) {
      // Mobile layout - more vertical, less horizontal spread
      return {
        nodes: [
          { id: 'basics', title: 'Math Basics', status: 'Completed', score: 95, x: width * 0.5, y: height * 0.15 },
          { id: 'algebra', title: 'Algebra Fundamentals', status: 'Completed', score: 88, x: width * 0.5, y: height * 0.3 },
          { id: 'equations', title: 'Linear Equations', status: 'In Progress', score: 65, x: width * 0.25, y: height * 0.45 },
          { id: 'functions', title: 'Functions', status: 'Not Started', score: 0, x: width * 0.75, y: height * 0.45 },
          { id: 'graphing', title: 'Graphing Functions', status: 'Not Started', score: 0, x: width * 0.75, y: height * 0.6 },
          { id: 'quadratic', title: 'Quadratic Equations', status: 'Not Started', score: 0, x: width * 0.25, y: height * 0.6 },
          { id: 'calculus-intro', title: 'Calculus Introduction', status: 'Not Started', score: 0, x: width * 0.5, y: height * 0.75 },
          { id: 'derivatives', title: 'Derivatives', status: 'Not Started', score: 0, x: width * 0.5, y: height * 0.9 }
        ],
        nodeRadius
      };
    } else {
      // Desktop layout - more horizontal spread
      return {
        nodes: [
          { id: 'basics', title: 'Math Basics', status: 'Completed', score: 95, x: width * 0.1, y: height * 0.2 },
          { id: 'algebra', title: 'Algebra Fundamentals', status: 'Completed', score: 88, x: width * 0.3, y: height * 0.2 },
          { id: 'equations', title: 'Linear Equations', status: 'In Progress', score: 65, x: width * 0.5, y: height * 0.2 },
          { id: 'functions', title: 'Functions', status: 'Not Started', score: 0, x: width * 0.3, y: height * 0.5 },
          { id: 'graphing', title: 'Graphing Functions', status: 'Not Started', score: 0, x: width * 0.5, y: height * 0.5 },
          { id: 'quadratic', title: 'Quadratic Equations', status: 'Not Started', score: 0, x: width * 0.7, y: height * 0.35 },
          { id: 'calculus-intro', title: 'Calculus Introduction', status: 'Not Started', score: 0, x: width * 0.7, y: height * 0.65 },
          { id: 'derivatives', title: 'Derivatives', status: 'Not Started', score: 0, x: width * 0.9, y: height * 0.5 }
        ],
        nodeRadius
      };
    }
  };

  const getNodeColor = (status) => {
    switch (status) {
      case 'Completed':
        return '#22c55e'; // Green
      case 'In Progress':
        return '#eab308'; // Yellow
      case 'Not Started':
        return '#9ca3af'; // Gray
      default:
        return '#9ca3af';
    }
  };

  const getNodeStroke = (status) => {
    switch (status) {
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
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const newWidth = Math.max(320, containerWidth - 40); // Min width with padding
        const aspectRatio = window.innerWidth < 768 ? 0.8 : 0.6; // Taller on mobile
        const newHeight = Math.max(400, newWidth * aspectRatio);
        
        setDimensions({ width: newWidth, height: newHeight });
      }
    };

    handleResize(); // Initial calculation
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const { width, height } = dimensions;
    const { nodes, nodeRadius } = getResponsivePositions(width, height);
    
    // Links data - unchanged
    const linksData = [
      { source: 'basics', target: 'algebra' },
      { source: 'algebra', target: 'equations' },
      { source: 'algebra', target: 'functions' },
      { source: 'functions', target: 'graphing' },
      { source: 'equations', target: 'quadratic' },
      { source: 'functions', target: 'quadratic' },
      { source: 'graphing', target: 'calculus-intro' },
      { source: 'quadratic', target: 'calculus-intro' },
      { source: 'calculus-intro', target: 'derivatives' }
    ];
    
    svg.attr('width', width).attr('height', height);
    
    // Responsive font sizes
    const isMobile = width < 768;
    const titleFontSize = isMobile ? '10px' : '12px';
    const scoreFontSize = isMobile ? '10px' : '12px';
    const strokeWidth = isMobile ? 2 : 3;

    // Create links (edges)
    const links = svg.selectAll('.link')
      .data(linksData)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('x1', d => {
        const sourceNode = nodes.find(n => n.id === d.source);
        return sourceNode ? sourceNode.x : 0;
      })
      .attr('y1', d => {
        const sourceNode = nodes.find(n => n.id === d.source);
        return sourceNode ? sourceNode.y : 0;
      })
      .attr('x2', d => {
        const targetNode = nodes.find(n => n.id === d.target);
        return targetNode ? targetNode.x : 0;
      })
      .attr('y2', d => {
        const targetNode = nodes.find(n => n.id === d.target);
        return targetNode ? targetNode.y : 0;
      })
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', strokeWidth)
      .attr('marker-end', 'url(#arrowhead)');

    // Add arrowhead marker
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 13)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 13)
      .attr('markerHeight', 13)
      .attr('xoverflow', 'visible')
      .append('path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#9ca3af')
      .style('stroke', 'none');

    // Create node groups
    const nodeGroups = svg.selectAll('.node-group')
      .data(nodes)
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
          .attr('r', nodeRadius + 5);

        // Show tooltip
        setTooltipData(d);
        const rect = svgRef.current.getBoundingClientRect();
        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);
        
        setTooltipPosition({
          x: Math.min(clientX - rect.left + 10, width - 200), // Keep tooltip in bounds
          y: Math.max(clientY - rect.top - 10, 10)
        });
      })
      .on('mouseleave touchend', function(event) {
        if (event.type === 'touchend') {
          // For touch devices, delay hiding tooltip for better UX
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
    const titleOffset = nodeRadius + 20;
    const wrapWidth = isMobile ? 100 : 120;
    
    nodeGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', `${titleOffset}px`)
      .attr('fill', '#374151')
      .attr('font-size', titleFontSize)
      .attr('font-weight', '600')
      .text(d => d.title)
      .call(wrap, wrapWidth); // Wrap text if too long

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

  }, [dimensions]);

  return (
    <div className="learning-path-container" ref={containerRef}>
      <div className="header">
        <h2>Learning Path Progress</h2>
        <div className="legend">
          <div className="legend-item">
            <div className="legend-color completed"></div>
            <span>Completed</span>
          </div>
          <div className="legend-item">
            <div className="legend-color in-progress"></div>
            <span>In Progress</span>
          </div>
          <div className="legend-item">
            <div className="legend-color not-started"></div>
            <span>Not Started</span>
          </div>
        </div>
      </div>
      
      <div className="visualization-wrapper">
        <svg ref={svgRef}></svg>
        
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
  );
};

export default LearningPathVisualization;
