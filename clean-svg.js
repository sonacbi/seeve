const fs = require("fs");
const path = require("path");

const dir = "./src/icon";

fs.readdirSync(dir).forEach((file) => {
  if (!file.endsWith(".svg")) return;

  let svg = fs.readFileSync(path.join(dir, file), "utf8");

  svg = svg
    // XML 헤더
    .replace(/<\?xml[^>]*\?>/g, "")
    .replace(/<!DOCTYPE[^>]*>/g, "")

    // sodipodi / inkscape / metadata 태그 통째 제거
    .replace(/<sodipodi:[^>]*>[\s\S]*?<\/sodipodi:[^>]*>/g, "")
    .replace(/<inkscape:[^>]*>[\s\S]*?<\/inkscape:[^>]*>/g, "")
    .replace(/<metadata[\s\S]*?<\/metadata>/g, "")
    .replace(/<sodipodi:namedview[\s\S]*?\/>/g, "")

    // namespace attribute 제거
    .replace(/\sxmlns:[a-zA-Z]+="[^"]*"/g, "")
    .replace(/\s(inkscape|sodipodi|xml):[a-zA-Z-]+="[^"]*"/g, "")
    .replace(/\s[a-zA-Z-]+:[a-zA-Z-]+="[^"]*"/g, "");

  fs.writeFileSync(path.join(dir, file), svg);
  console.log("cleaned:", file);
});