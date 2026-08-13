"""
Health Score calculation service for StartupPilot OS.
Calculates deterministic health scores based on weighted dimension inputs.
Weights:
- Market: 20%
- Product: 20%
- Revenue: 20%
- Competition: 15%
- Execution: 25%
"""

def calculate_startup_health(
    market: int = 80,
    product: int = 80,
    revenue: int = 80,
    competition: int = 80,
    execution: int = 80
) -> int:
    """Calculates weighted overall health score (0-100)."""
    weighted_score = (
        (market * 0.20) +
        (product * 0.20) +
        (revenue * 0.20) +
        (competition * 0.15) +
        (execution * 0.25)
    )
    return max(0, min(100, int(round(weighted_score))))
