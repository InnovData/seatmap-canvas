/*
 * index.ts
 * https://github.com/alisaitteke/seatmap-canvas Copyright 2023 Ali Sait TEKE
 */

import Blocks from "./blocks/blocks.index";
import Svg from "../svg.index";
import SvgBase from "../svg.base";
import {dom} from "../../decorators/dom";
import BlocksSearchCircle from "./blocks.search-circle";
import Stage from './stage.index';



@dom({
    tag: "image",
    class: "image-bg",
    autoGenerate: false
})
export default class ImageBg extends SvgBase {


    constructor(public parent: Stage) {
        super(parent);
    }


    update(): this {

        // Set the image attributes
        this.parent.img.node
            .attr('xlink:href', this.global.config.imageBg.url)
            .attr('x', this.global.config.imageBg.x)
            .attr('y', this.global.config.imageBg.y)
            .attr('width', this.global.config.imageBg.width)
            .attr('height', this.global.config.imageBg.height);

        // Return the current instance for chaining
        return this;
    }

}