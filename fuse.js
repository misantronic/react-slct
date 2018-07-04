const {
    FuseBox
} = require("fuse-box");

const fuse = FuseBox.init({
    homeDir: "src",
    target: 'browser@es2015',
    sourceMaps: true,
    output: "dist/$name.js",
})

fuse.bundle("react-slct").instructions(" > [index.tsx]")
fuse.run();
