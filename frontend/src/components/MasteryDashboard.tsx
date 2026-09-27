import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../AppContext';
import { ConceptNode, MasteryState } from '../mockData';

// ─── Mastery config ───────────────────────────────────────────────────────────
const MASTERY_CONFIG: Record<
  MasteryState,
  { color: string; ring: string; label: string; glow: string }
> = {
  mastered: {
    color: '#2dd4bf',
    ring: '#2dd4bf',
    label: 'Mastered',
    glow: 'rgba(45,212,191,0.5)',
  },
  developing: {
    color: '#a78bfa',
    ring: '#a78bfa',
    label: 'Developing',
    glow: 'rgba(167,139,250,0.5)',
  },
  'needs-attention': {
    color: '#fbbf24',
    ring: '#fbbf24',
    label: 'Needs Attention',
    glow: 'rgba(251,191,36,0.6)',
  },
  locked: {
    color: '#334155',
    ring: '#1e293b',
    label: 'Locked',
    glow: 'rgba(51,65,85,0.3)',
  },
};

// ─── D3 Knowledge Graph ───────────────────────────────────────────────────────
function KnowledgeGraphD3({
  nodes,
  flippingNodeId,
  onNodeClick,
}: {
  nodes: ConceptNode[];
  flippingNodeId: string | null;
  onNodeClick: (n: ConceptNode) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const simRef = useRef<d3.Simulation<any, any> | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth || 560;
    const height = svgRef.current.clientHeight || 420;

    svg.selectAll('*').remove();

    // Defs — glow filters
    const defs = svg.append('defs');
    Object.entries(MASTERY_CONFIG).forEach(([key, cfg]) => {
      const filter = defs
        .append('filter')
        .attr('id', `glow-${key}`)
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');
      filter
        .append('feGaussianBlur')
        .attr('stdDeviation', key === 'needs-attention' ? 5 : 3)
        .attr('result', 'coloredBlur');
      const feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode').attr('in', 'coloredBlur');
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    });

    // Arrow marker
    defs
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -4 8 8')
      .attr('refX', 22)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-4L8,0L0,4')
      .attr('fill', 'rgba(45,212,191,0.3)');

    // Build links from dependencies
    const links: { source: string; target: string }[] = [];
    nodes.forEach((n) => {
      n.dependencies.forEach((dep) => {
        links.push({ source: dep, target: n.id });
      });
    });

    const nodeData = nodes.map((n) => ({ ...n }));

    // Simulation
    const sim = d3
      .forceSimulation(nodeData as any)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(100)
          .strength(0.6)
      )
      .force('charge', d3.forceManyBody().strength(-280))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide(46));

    simRef.current = sim;

    // Container group
    const g = svg.append('g');

    // Zoom
    svg.call(
      d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.5, 2])
        .on('zoom', (e) => g.attr('transform', e.transform))
    );

    // Links
    const link = g
      .append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', 'rgba(45,212,191,0.15)')
      .attr('stroke-width', 1.5)
      .attr('marker-end', 'url(#arrow)');

    // Node groups
    const node = g
      .append('g')
      .selectAll('g')
      .data(nodeData)
      .join('g')
      .attr('cursor', 'pointer')
      .call(
        d3
          .drag<any, any>()
          .on('start', (e, d: any) => {
            if (!e.active) sim.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (e, d: any) => {
            d.fx = e.x;
            d.fy = e.y;
          })
          .on('end', (e, d: any) => {
            if (!e.active) sim.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      )
      .on('click', (e, d: any) => onNodeClick(d));

    // Outer glow ring
    node
      .append('circle')
      .attr('r', 26)
      .attr('fill', (d: any) => `${MASTERY_CONFIG[d.mastery as MasteryState].glow}`)
      .attr('filter', (d: any) => `url(#glow-${d.mastery})`);

    // Main circle
    node
      .append('circle')
      .attr('r', 20)
      .attr('fill', (d: any) => {
        const cfg = MASTERY_CONFIG[d.mastery as MasteryState];
        return `${cfg.color}22`;
      })
      .attr('stroke', (d: any) => MASTERY_CONFIG[d.mastery as MasteryState].ring)
      .attr('stroke-width', 2);

    // Labels
    node
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 34)
      .attr('font-size', 10)
      .attr('font-family', 'Plus Jakarta Sans')
      .attr('font-weight', 700)
      .attr('fill', (d: any) => MASTERY_CONFIG[d.mastery as MasteryState].color)
      .text((d: any) => d.label);

    // Tick
    sim.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);
      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      sim.stop();
    };
  }, [nodes]);

  // Flash effect for flipping node
  useEffect(() => {
    if (!flippingNodeId || !svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg
      .selectAll('g > g > circle:nth-child(2)')
      .filter((d: any) => d?.id === flippingNodeId)
      .transition()
      .duration(200)
      .attr('r', 30)
      .transition()
      .duration(400)
      .attr('r', 20);
  }, [flippingNodeId]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      style={{ display: 'block' }}
    />
  );
}

// ─── Node Flip Animation Overlay ──────────────────────────────────────────────
function NodeFlipCelebration({ nodeId, nodeLabel }: { nodeId: string; nodeLabel: string }) {
  return (
    <AnimatePresence>
      {nodeId && (
        <motion.div
          key={nodeId}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.5, y: -30 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            zIndex: 10,
            pointerEvents: 'none',
            textAlign: 'center',
          }}
        >
          {/* Ripple rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 80,
                height: 80,
                borderRadius: '50%',
                border: '2px solid rgba(167,139,250,0.6)',
                transform: 'translate(-50%,-50%)',
              }}
              animate={{ scale: [1, 3], opacity: [0.8, 0] }}
              transition={{ delay: i * 0.2, duration: 0.9, ease: 'easeOut' }}
            />
          ))}

          {/* Center card */}
          <motion.div
            style={{
              padding: '14px 20px',
              borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(26,31,82,0.98), rgba(37,43,110,0.95))',
              border: '1px solid rgba(167,139,250,0.5)',
              boxShadow: '0 0 40px rgba(167,139,250,0.4)',
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 4 }}>✨</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#a78bfa' }}>
              Concept Updated!
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#e2e8f0', marginTop: 2 }}>
              {nodeLabel}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginTop: 8,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: '#fbbf24',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 20,
                  background: 'rgba(251,191,36,0.1)',
                  border: '1px solid rgba(251,191,36,0.3)',
                }}
              >
                Needs Attention
              </span>
              <span style={{ fontSize: 12, color: '#475569' }}>→</span>
              <span
                style={{
                  fontSize: 11,
                  color: '#a78bfa',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 20,
                  background: 'rgba(167,139,250,0.12)',
                  border: '1px solid rgba(167,139,250,0.35)',
                }}
              >
                Developing
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────
function MasteryLegend() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        padding: '8px 14px',
        flexWrap: 'wrap',
      }}
    >
      {(Object.entries(MASTERY_CONFIG) as [MasteryState, any][]).map(
        ([key, cfg]) => (
          <div
            key={key}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: cfg.color,
                boxShadow: `0 0 6px ${cfg.color}`,
              }}
            />
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
              {cfg.label}
            </span>
          </div>
        )
      )}
    </div>
  );
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────
function NodeTooltip({
  node,
  onClose,
}: {
  node: ConceptNode | null;
  onClose: () => void;
}) {
  if (!node) return null;
  const cfg = MASTERY_CONFIG[node.mastery];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'absolute',
          bottom: 60,
          left: 16,
          right: 16,
          padding: '12px 14px',
          borderRadius: 12,
          background: 'rgba(13,15,30,0.97)',
          border: `1px solid ${cfg.color}44`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.4)`,
          zIndex: 20,
          cursor: 'pointer',
        }}
        onClick={onClose}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: cfg.color,
              boxShadow: `0 0 8px ${cfg.color}`,
              flexShrink: 0,
              marginTop: 4,
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 800, color: '#e2e8f0' }}>
                {node.label}
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: cfg.color,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 20,
                  background: `${cfg.color}15`,
                  border: `1px solid ${cfg.color}33`,
                }}
              >
                {cfg.label}
              </span>
            </div>
            <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
              {node.description}
            </div>
            {node.dependencies.length > 0 && (
              <div style={{ marginTop: 6, fontSize: 10, color: '#334155' }}>
                Depends on:{' '}
                {node.dependencies.join(', ')}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function MasteryDashboard() {
  const { nodes, flippingNodeId, demoPhase, activeScenario } = useApp();
  const [selectedNode, setSelectedNode] = useState<ConceptNode | null>(null);

  const flippingNode = nodes.find((n) => n.id === flippingNodeId);

  return (
    <div
      className="glass"
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid rgba(45,212,191,0.12)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid rgba(45,212,191,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#e2e8f0' }}>
            Mastery Knowledge Graph
          </div>
          <div style={{ fontSize: 10, color: '#475569' }}>
            Click any node • Drag to explore • Scroll to zoom
          </div>
        </div>
        {demoPhase === 'resolved' && (
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              background: 'rgba(167,139,250,0.12)',
              border: '1px solid rgba(167,139,250,0.3)',
              fontSize: 11,
              color: '#a78bfa',
              fontWeight: 700,
            }}
          >
            ✨ Graph Updated
          </motion.div>
        )}
      </div>

      <MasteryLegend />

      {/* Graph canvas */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <KnowledgeGraphD3
          nodes={nodes}
          flippingNodeId={flippingNodeId}
          onNodeClick={setSelectedNode}
        />

        {/* Node flip celebration */}
        {flippingNodeId && flippingNode && (
          <NodeFlipCelebration
            nodeId={flippingNodeId}
            nodeLabel={flippingNode.label}
          />
        )}

        {/* Tooltip */}
        {selectedNode && (
          <NodeTooltip node={selectedNode} onClose={() => setSelectedNode(null)} />
        )}
      </div>

      {/* Needs-attention callout */}
      {demoPhase !== 'resolved' && (
        <div
          style={{
            padding: '10px 16px',
            borderTop: '1px solid rgba(251,191,36,0.1)',
            background: 'rgba(251,191,36,0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#fbbf24',
              boxShadow: '0 0 8px #fbbf24',
            }}
            className="pulse-amber"
          />
          <span style={{ fontSize: 11, color: '#94a3b8' }}>
            Active bottleneck:{' '}
            <span style={{ color: '#fbbf24', fontWeight: 700 }}>
              {activeScenario.misconceptionLabel}
            </span>{' '}
            — currently{' '}
            <span style={{ color: '#fbbf24' }}>Needs Attention</span>
          </span>
        </div>
      )}
    </div>
  );
}
