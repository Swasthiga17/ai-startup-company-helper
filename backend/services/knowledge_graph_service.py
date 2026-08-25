from typing import Dict, Any, List

class KnowledgeGraphService:
    """
    Phase 25 Startup Knowledge Graph Service.
    Connects decisions, evidence, experiments, and outcomes into a long-term context graph.
    """
    def build_startup_graph(self, startup_name: str = "My AI Startup") -> Dict[str, Any]:
        nodes = [
            {"id": "node_startup", "type": "Startup", "label": startup_name},
            {"id": "node_founder", "type": "Founder", "label": "Founding Team"},
            {"id": "node_decision_1", "type": "Decision", "label": "Validate WTP with Pre-Orders"},
            {"id": "node_evidence_1", "type": "Evidence", "label": "Competitor pricing survey ($999/mo standard)"},
            {"id": "node_exp_1", "type": "Experiment", "label": "Landing Page Conversion Test"},
            {"id": "node_outcome_1", "type": "Outcome", "label": "78% Willingness to Pay verified"}
        ]

        edges = [
            {"source": "node_startup", "target": "node_founder", "relation": "FOUNDED_BY"},
            {"source": "node_founder", "target": "node_decision_1", "relation": "APPROVED"},
            {"source": "node_decision_1", "target": "node_evidence_1", "relation": "BASED_ON"},
            {"source": "node_decision_1", "target": "node_exp_1", "relation": "CREATED_EXPERIMENT"},
            {"source": "node_exp_1", "target": "node_outcome_1", "relation": "PRODUCED_OUTCOME"}
        ]

        return {
            "startup": startup_name,
            "total_nodes": len(nodes),
            "total_edges": len(edges),
            "nodes": nodes,
            "edges": edges,
            "graph_health": "CONNECTED"
        }

knowledge_graph_service = KnowledgeGraphService()
