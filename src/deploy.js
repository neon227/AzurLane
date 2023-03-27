import { write } from "./utils.js";
import { REPOSITORY_LINK, UNKNOWN_IMAGE } from "./constant.js";
import { skins } from "./dist.js";

skins.map(ship =>
{
  ship.skins.forEach(skin =>
  {
    for (const type of ["banner", "chibi", "icon", "shipyard"])
      if (skin[type])
        skin[type] = REPOSITORY_LINK + skin[type];
      else
        skin[type] = REPOSITORY_LINK + UNKNOWN_IMAGE[type];
  });
});

write("root", "skins.json", skins);
