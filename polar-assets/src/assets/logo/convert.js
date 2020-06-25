const sharp = require('sharp');

async function doAsync() {

    // 192 is the apple touch icon...
    const sizes = [16, 32, 64, 128, 192, 256, 512, 1024];

    for (const size of sizes) {

        const dest = `icon-${size}.png`;
        console.log(dest);

        // fit options:
        //         contain: "contain";
        //         cover: "cover";
        //         fill: "fill";
        //         inside: "inside";
        //         outside: "outside";
        // kernel options (default: lanczos3)
        //         nearest: "nearest";
        //         cubic: "cubic";              // looks decent
        //         mitchell: "mitchell";
        //         lanczos2: "lanczos2";
        //         lanczos3: "lanczos3";

        await sharp('icon.svg', {density: 1000})
            .resize(size, size, {
                fit: sharp.fit.contain,
                kernel: sharp.kernel.lanczos3,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            // .flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } })
            .toFile(dest);

    }
    //
    // // FIXME: svg looks fine but png is broke and looks blurry.
    // await sharp('icon.svg', {density: 1000})
    //     .flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } })
    //     .resize(258, 209)
    //     .toFile(`icon-256-manual.png`);

    // await sharp('icon.svg', {density: 1000})
    //     // .flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } })
    //
    //     // .resize(258, 209)
    //     .png()
    //     .resize(32)
    //     .toFile(`icon-test-32.png`);
    //

    await sharp('icon.svg', {density: 1000})
        // .flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } })

        // .resize(258, 209)
        .png()

        //         contain: "contain";
        //         cover: "cover";
        //         fill: "fill";
        //         inside: "inside";
        //         outside: "outside";
        .resize(128, 128, {fit: sharp.fit.contain})
        .toFile(`icon-test-128.png`);

    //
    // const semiTransparentRedPng = await sharp({
    //     create: {
    //         width: 48,
    //         height: 48,
    //         channels: 4,
    //         background: { r: 255, g: 0, b: 0, alpha: 0.5 }
    //     }
    // })
    //     .png()
    //     .toBuffer();

}

doAsync()
    .catch(err => console.error(err));
