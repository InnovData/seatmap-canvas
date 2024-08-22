/*
 * $project.fileName
 * https://github.com/alisaitteke/seatmap-canvas Copyright 2023 Ali Sait TEKE
 */

import Stage from "./stage/stage.index";
import {mouse as d3Mouse,event as d3Event, select as d3Select} from 'd3-selection'
import {point as d3Event, xml} from 'd3'
import "reflect-metadata";

import {SeatMapCanvas} from "../canvas.index";
import SvgBase from "./svg.base";
import {dom} from "../decorators/dom";
import {EventType, ZoomLevel} from "../enums/global";
import ZoomOutBg from "./zoom-out.bg";
import Legend from "./legend";
import Tooltip from "./tooltip";



declare const window: any;

@dom({
    tag: "svg",
    class: "seatmap-svg",
    autoGenerate: false
})
export default class Svg extends SvgBase {
    public stage: Stage;
    public zoomOutBg: ZoomOutBg;
    public legend: Legend;
    public tooltip: Tooltip;
    public selectionBox: any;
    public isSelectingZone: boolean;
    public startPointZone: boolean;


    constructor(public parent: SeatMapCanvas) {
        super(parent);
        this.global.eventManager.addEventListener(EventType.ZOOM_LEVEL_CHANGE, (zoom_level: any) => {
            this.node.classed("zoom-level-" + ZoomLevel.SEAT, false);
            this.node.classed("zoom-level-" + ZoomLevel.BLOCK, false);
            this.node.classed("zoom-level-" + ZoomLevel.VENUE, false);
            this.node.classed("zoom-level-" + zoom_level.level, true);
        });
    }

    update() {
        this.stage = new Stage(this).addToParent();
        this.zoomOutBg = new ZoomOutBg(this).addToParent();
        if(this.global.config.legend){
            this.legend = new Legend(this).addToParent();
        }

        this.tooltip = new Tooltip(this).addToParent();


        this.updateChilds();

        this.stage.node.raise();
        if(this.global.config.legend){
            this.legend.node.raise();
        }

        this.tooltip.node.raise();

        this.node.on("mousemove", () => {
            let cor = d3Mouse(this.stage.node.node());
            this.parent.eventManager.dispatch(EventType.MOUSE_MOVE, cor);
        })

        // TODO Selection zone
        this.selectionBox = null;
        this.node.on("mousedown", () => {
            if (d3Event.shiftKey) {

                this.parent.zoomManager.zoomGlobalDisable();

                // Start selection
                this.startPointZone = d3Mouse(this.node.node());
                console.log(this.startPointZone )
                this.isSelectingZone = true;

                if (!this.selectionBox) {
                    this.selectionBox = this.node.append("rect")
                        .attr("class", "selection");
                }
                this.selectionBox
                    .attr("x", this.startPointZone[0])
                    .attr("y", this.startPointZone[1])
                    .attr("width", 0)
                    .attr("height", 0);
                    
}
        })
        

        this.node.on("mousemove", () => {
            if (this.isSelectingZone) {
                const currentPoint = d3Mouse(this.node.node());

                const x = Math.min(this.startPointZone[0], currentPoint[0]);
                const y = Math.min(this.startPointZone[1], currentPoint[1]);
                const width = Math.abs(this.startPointZone[0] - currentPoint[0]);
                const height = Math.abs(this.startPointZone[1] - currentPoint[1]);

                this.selectionBox
                    .attr("x", x)
                    .attr("y", y)
                    .attr("width", width)
                    .attr("height", height);
            }
        });

        this.node.on("mouseup", () => {
            console.log('up')
            if ( this.isSelectingZone) {
                // const [x, y, width, height] = [
                //     parseFloat( this.selectionBox.attr("x")),
                //     parseFloat( this.selectionBox.attr("y")),
                //     parseFloat( this.selectionBox.attr("width")),
                //     parseFloat( this.selectionBox.attr("height"))
                // ];
                const {x, y, width, height} = this.selectionBox.node().getBoundingClientRect();
                const selectionBounds = {
                    x0: x,
                    y0: y,
                    x1: x + width,
                    y1: y + height
                };
                var _self = this;

                this.node.selectAll('g.seat').each(function(d) {
                    const gElement = d3Select(this);
                    const circle = gElement.select('circle');

                    const bounds = circle.node().getBoundingClientRect();

                    // const bounds = d3Mouse(circle.node());
                    // console.log(x_overlap, y_overlap)
                    const cx = bounds.x;
                    const cy = bounds.y;

                    // const cx = +bounds[0];
                    // const cy = +bounds[1];

                    const isSelected = cx >= selectionBounds.x0 &&
                                       cx <= selectionBounds.x1 &&
                                       cy >= selectionBounds.y0 &&
                                       cy <= selectionBounds.y1;
                    gElement.classed("seat-selected-zone", isSelected);
                });
                this.selectionBox.remove();
                this.selectionBox = null;
                this.isSelectingZone = false;
                
                this.parent.zoomManager.zoomGlobalEnable();

                this.global.zoom_enable = true;
            }
        });

        //this.stage.updateEvents(true);
    }


}