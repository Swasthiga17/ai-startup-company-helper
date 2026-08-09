import os
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import DATABASE_URL

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def migrate_action_items_table():
    """Safely adds missing columns to action_items table without data loss."""
    try:
        with engine.connect() as conn:
            columns_to_add = [
                ("description", "TEXT"),
                ("category", "VARCHAR(64) DEFAULT 'VALIDATION'"),
                ("source_agent", "VARCHAR(64) DEFAULT 'IdeaAgent'"),
                ("confidence_score", "FLOAT DEFAULT 85.0"),
                ("verification_status", "VARCHAR(64) DEFAULT 'SUPPORTED'"),
                ("source_references", "TEXT"),
                ("updated_at", "DATETIME"),
                ("completed_at", "DATETIME")
            ]
            for col_name, col_type in columns_to_add:
                try:
                    conn.execute(text(f"ALTER TABLE action_items ADD COLUMN {col_name} {col_type};"))
                    conn.commit()
                except Exception:
                    pass
    except Exception:
        pass


def init_db():
    # Ensure all models are imported so their tables register with Base.metadata
    import models.auth_models  # noqa: F401 — registers User, Analysis, Document, ActionItem, PasswordResetToken
    Base.metadata.create_all(bind=engine)
    migrate_action_items_table()


if __name__ == "__main__":
    init_db()
    print("Database tables initialized and migrated.")