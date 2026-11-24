# Aegis of Orbia — The Last Shield

## Operational design
One armored protagonist, Orin. Original visual foundation: `templates/meteor-original.html` (exact createSlayer model, dark volcanic palette, metallic armor, gold and cyan accents, luminous hemispherical shield). This is a separate game, not a modification of the original.

Story: the sky core has cracked. Orin restores three shield towers in order. Each pair of challenges restores one tower. The final scene activates the large shield.

| Act | Scene | Objective |
|---|---|---|
| I | Fallen Garden | Survive in a disk, then activate two exact circle nodes |
| II | Twin Towers | Find both circle intersections, then survive in an annulus |
| III | Core Tower | Survive the intersection of disks, then activate the final disk |

Controls: WASD/arrows, E for crystal activation, Space jump, Shift dash, mouse drag and scroll camera. Touch joystick plus three action buttons. PASS / P for demonstration; skips current challenge without saving demo progression. Normal checkpoints are saved per completed stage; three hearts, retry current stage on failure.

Visual assets: source-derived articulated Slayer model; beveled fortress plates, textured tiles, golden axes, emissive tower cores, garden trees, perimeter lamps, layered arch, floating rocks, embers, meteor meshes, transparent hemisphere with wire and arcs, impact shards. No other humanoid or enemy character. Meteor hazard is environmental.

Testing requirements: exact constraints, solvability, stage transition, presentation skip, source preservation, browser WebGL visual review and keyboard/touch playtest. The last two require actual device/browser validation; do not claim them from syntax tests.
