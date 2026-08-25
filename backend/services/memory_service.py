import json
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from models.auth_models import Analysis, ActionItem, HealthHistory
from utils.logger import logger

class MemoryService:
    def get_startup_context(self, db: Session, user_id: int, idea_hint: Optional[str] = None) -> Dict[str, Any]:
        """
        Compiles persistent long-term startup memory context for the user's workspace.
        """
        try:
            # 1. Fetch latest startup analysis for the user
            query = db.query(Analysis).filter(Analysis.user_id == user_id).order_by(Analysis.created_at.desc())
            latest_analysis = query.first()

            if not latest_analysis:
                return {
                    "has_context": False,
                    "idea": idea_hint or "Startup concept",
                    "formatted_context": f"Startup Idea: '{idea_hint or 'Unspecified startup concept'}' (Initial exploration stage)."
                }

            payload = {}
            if latest_analysis.payload:
                try:
                    payload = json.loads(latest_analysis.payload)
                except Exception as p_err:
                    logger.warning(f"Failed to parse analysis payload JSON: {p_err}")

            idea_text = latest_analysis.idea or idea_hint or "Startup concept"

            # 2. Extract key elements
            market_data = payload.get("market_analysis", {})
            biz_data = payload.get("business_analysis", {})
            prod_data = payload.get("product_analysis", {})
            idea_data = payload.get("idea_analysis", {})

            problem = idea_data.get("problem", "Core customer problem statement")
            target_customers = ", ".join(idea_data.get("target_customers", ["Target Customers"]))
            value_prop = idea_data.get("value_proposition", "Core value proposition")
            tam = market_data.get("tam", "$50B")
            biz_model = biz_data.get("business_model", "SaaS / Subscription")
            roadmap = prod_data.get("roadmap", [])
            current_mvp_phase = roadmap[0].get("phase", "Phase 1 MVP") if isinstance(roadmap, list) and roadmap else "Phase 1 MVP"

            # 3. Action Items Status
            action_items = db.query(ActionItem).filter(ActionItem.user_id == user_id).all()
            completed_count = sum(1 for a in action_items if str(a.status).upper() in ["COMPLETED", "DONE"])
            total_actions = len(action_items)

            # 4. Health History Trend
            health_history = db.query(HealthHistory).filter(HealthHistory.user_id == user_id).order_by(HealthHistory.created_at.desc()).limit(2).all()
            if len(health_history) >= 2:
                recent_score = health_history[0].overall_score
                prev_score = health_history[1].overall_score
                score_delta = recent_score - prev_score
                delta_str = f" (Progress: {score_delta:+} pts)" if score_delta != 0 else ""
                health_str = f"{recent_score}/100{delta_str}"
            elif health_history:
                health_str = f"{health_history[0].overall_score}/100"
            else:
                health_str = "78/100"

            formatted = f"""
PERSISTENT STARTUP CONTEXT:
- Startup Idea: "{idea_text}"
- Target Customer Segment: {target_customers}
- Core Problem Solved: {problem}
- Value Proposition: {value_prop}
- Addressable Market (TAM): {tam}
- Business Model: {biz_model}
- Current MVP Stage: {current_mvp_phase}
- Startup Health Score: {health_str}
- Execution Progress: {completed_count}/{total_actions} action items completed
""".strip()

            return {
                "has_context": True,
                "idea": idea_text,
                "problem": problem,
                "target_customers": target_customers,
                "value_proposition": value_prop,
                "tam": tam,
                "business_model": biz_model,
                "mvp_stage": current_mvp_phase,
                "health_score_str": health_str,
                "action_progress": f"{completed_count}/{total_actions}",
                "formatted_context": formatted
            }

        except Exception as e:
            logger.error(f"Error compiling persistent startup context: {e}")
            return {
                "has_context": False,
                "idea": idea_hint or "Startup concept",
                "formatted_context": f"Startup Idea: '{idea_hint or 'Startup concept'}'"
            }

memory_service = MemoryService()
