import { ship_data_group, ship_group } from "./data.js";
import { write } from "./utils.js";
import {
  resolve_ship_property_hexagon,
  resolve_ship_nationality,
  resolve_ship_hull_type
} from "./resolver.js";

import skins from "./ship/skins.js";

// ships
const SHIPS = {};

for (const idx of ship_data_group.all)
{
  const {
    group_type,
    property_hexagon,
    nationality,
    share_group_id,
    type
  } = ship_data_group[idx];

  const SHIP = {
    id: idx,
    gid: group_type,
    name: ship_group[group_type],
    property_hexagon: resolve_ship_property_hexagon(property_hexagon),
    nationality: resolve_ship_nationality(nationality),
    type: resolve_ship_hull_type(type),
    skins: await skins(group_type)
  };

  if (share_group_id.length > 0)
    SHIP.share_group_id = share_group_id;

  SHIPS[group_type] = SHIP;
};

// this make the ships sorted by id
// and prevent missing skin sharing
const BUILD = [];

for (const ship in SHIPS)
{
  const DATA = { ...SHIPS[ship] };
  const SKIN = [ ...DATA.skins ];

  if (!DATA.share_group_id)
  {
    BUILD.push(DATA);
    continue;
  };

  for (const shared_id of DATA.share_group_id)
  {
    if (!SHIPS[shared_id]) continue;

    for (const shared_skin of SHIPS[shared_id].skins)
      if (!["Default", "Retrofit", "Oath"].includes(shared_skin.type))
        SKIN.push({ ...shared_skin, shared: shared_id });
  };

  DATA.skins = SKIN;
  delete DATA.share_group_id;
  BUILD.push(DATA);
};

write("dist", "ships.json", BUILD);
write("dist", "skins.json",
  BUILD.map(ship =>
  {
    return {
      id: ship.id,
      gid: ship.gid,
      name: ship.name,
      skins: ship.skins
    };
  })
);
