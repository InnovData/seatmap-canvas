/*
 * $project.fileName
 * https://github.com/alisaitteke/seatmap-canvas Copyright 2023 Ali Sait TEKE
 */


interface DomInterface {
    tag?: string,
    class?: string,
    event_code?: string,
    autoGenerate?: boolean
}

export function dom(values: DomInterface) {
    return function (target: any) {
        target.prototype['dom_params'] = {};
        if (values.tag) {
            target.prototype['dom_params']['tag'] = values.tag
        }
        if (values.class) {
            target.prototype['dom_params']['class'] = values.class
        }

        if (values.event_code) {
            target.prototype['dom_params']['event_code'] = values.event_code
        }else{
            if (values.class) {
                target.prototype['dom_params']['event_code'] = values.class
            }

        }

        if (typeof values.autoGenerate !== "undefined") {
            target.prototype['dom_params']['autoGenerate'] = values.autoGenerate;
        } else {
            target.prototype['dom_params']['autoGenerate'] = true;
        }

    }
}

export function boundingBox(polygon: any) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    polygon.forEach((point: any) => {
        if (point[0] < minX) minX = point[0];
        if (point[1] < minY) minY = point[1];
        if (point[0] > maxX) maxX = point[0];
        if (point[1] > maxY) maxY = point[1];
    });
    
    return [[minX, minY], [maxX, maxY]];
}

export function boundingBoxToPolygon (bbox: any) {
    return [
        bbox[0],
        [bbox[1][0], bbox[0][1]],
        bbox[1],
        [bbox[0][0], bbox[1][1]]
    ];
};