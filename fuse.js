const {
    FuseBox,
    WebIndexPlugin
} = require("fuse-box");
const fuse = FuseBox.init({
    cache: false,
    homeDir: "src",
    sourceMaps: true,
    target: 'browser@es6',
    output: "dist/$name.js",
})
fuse.bundle("react-slct").instructions("> [index.tsx]");
fuse.run();
