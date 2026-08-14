from dataclasses import dataclass


@dataclass(slots=True)
class ListedTaskShareItem:
    id: str
    permission: str
    created_at: str


@dataclass(slots=True)
class ListedTaskShares:
    is_owner: bool
    owner_email: str
    items: list[ListedTaskShareItem]
