from __future__ import annotations

from pathlib import Path

import yaml


def load_dictionaries(directory: str | Path) -> dict:
    root = Path(directory)
    concepts = yaml.safe_load((root / "concepts.yaml").read_text(encoding="utf-8"))
    species = yaml.safe_load((root / "species.yaml").read_text(encoding="utf-8"))
    units = yaml.safe_load((root / "units.yaml").read_text(encoding="utf-8"))
    return {
        "concepts": concepts["concepts"],
        "species": species["species"],
        "units": units["units"],
    }
