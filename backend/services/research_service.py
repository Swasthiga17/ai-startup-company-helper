from typing import Dict, Any, List

class ResearchService:
    """
    Research Planner Service that structures research inquiries into 10 explicit investigation steps.
    """
    def create_research_plan(self, idea_text: str) -> Dict[str, Any]:
        plan_steps = [
            "1. Identify primary and secondary target market demographics",
            "2. Estimate Total Addressable Market (TAM), SAM, and SOM opportunity",
            "3. Identify key direct market competitors and incumbents",
            "4. Identify indirect competitors and alternative workarounds",
            "5. Compare competitor feature matrices and moats",
            "6. Analyze competitor pricing strategies and revenue models",
            "7. Identify customer pain point severity and validation signals",
            "8. Evaluate startup unique value proposition and differentiation",
            "9. Identify major operational, regulatory, and market risks",
            "10. Determine critical hypothesis validation experiment requirements"
        ]

        research_questions = [
            f"Who are the top 3 direct competitors to '{idea_text}'?",
            f"What is the estimated TAM/SAM for '{idea_text}'?",
            f"What are the primary customer pain points and willingness-to-pay signals?",
            f"What is the key competitive differentiation for '{idea_text}'?"
        ]

        return {
            "idea": idea_text,
            "total_steps": len(plan_steps),
            "plan_steps": plan_steps,
            "research_questions": research_questions,
            "status": "PLANNED"
        }

research_service = ResearchService()
