from workflows.startup_graph import startup_graph

async def analyze_startup_idea(idea: str) -> dict:
    return await startup_graph.ainvoke({"idea": idea})
