export function convertToPixels(ratios: any, pixelSize: number) {

    return ratios.map(ratio => {

        ratio.top *= pixelSize;
        ratio.left *= pixelSize;

        return ratio;
    });
}

export function findCoordinates(value: number) {

    if (value <= 100) {

        return 0;
    } else if (value <= 200) {

        return 1;
    } else if (value <= 300) {

        return 2;
    } else if (value <= 400) {

        return 3;
    } else if (value <= 500) {

        return 4;
    } else if (value <= 600) {

        return 5;
    } else if (value <= 700) {

        return 6;
    } else if (value <= 800) {

        return 7;
    }

    return value;
}