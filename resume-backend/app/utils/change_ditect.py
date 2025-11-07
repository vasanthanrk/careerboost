from sqlalchemy import inspect

def get_changed_fields(instance):
    """
    Returns a list of field names that were modified on a SQLAlchemy model instance.
    """
    state = inspect(instance)
    changed_fields = [
        attr.key
        for attr in state.attrs
        if attr.history.has_changes()
    ]
    return changed_fields
