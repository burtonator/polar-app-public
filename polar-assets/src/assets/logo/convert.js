const sharp = require('sharp');

async function doAsync() {

    const sizes = [16, 32, 64, 128, 256];

    // for (const size of sizes) {
    //
    //     // FIXME: svg looks fine but png is broke and looks blurry.
    //     await sharp('icon.svg', {density: 1000})
    //         .flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } })
    //         .resize(size)
    //         .toFile(`icon-${size}.jpg`);
    //
    // }
    //
    // // FIXME: svg looks fine but png is broke and looks blurry.
    // await sharp('icon.svg', {density: 1000})
    //     .flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } })
    //     .resize(258, 209)
    //     .toFile(`icon-256-manual.png`);

    await sharp('icon.svg', {density: 1000})
        // .flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } })

        // .resize(258, 209)
        .png()
        .resize(32)
        .toFile(`icon-test-32.png`);

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
