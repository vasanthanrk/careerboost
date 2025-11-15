import sys, os
from dotenv import load_dotenv
from logging.config import fileConfig
from alembic import context
from sqlalchemy import engine_from_config, pool

# Add app/ to python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Load env variables
load_dotenv()

# Load Alembic config
config = context.config

# Set DB URL
db_url = os.getenv("DATABASE_URL")
config.set_main_option("sqlalchemy.url", db_url)

# Logging
if config.config_file_name:
    fileConfig(config.config_file_name)

# Import Base AFTER sys.path update
from app.core.database import Base
from app.models import *  # import all models WITHOUT circular import

target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    configuration = config.get_section(config.config_ini_section)
    configuration["sqlalchemy.url"] = db_url

    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,              # 🔥 REQUIRED
            compare_server_default=True,    # 🔥 REQUIRED
            render_as_batch=True            # 🔥 Avoid MySQL batch issues
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
