/*
 * $project.fileName
 * https://github.com/alisaitteke/seatmap-canvas Copyright 2023 Ali Sait TEKE
 */

import {mouse as d3Mouse, event as d3Event, select as d3Select} from 'd3-selection'



import {SeatMapCanvas} from "../canvas.index";

export default class SelectionManager {


    public selectionBox: any;
    public isSelectingZone: boolean;
    public startPointZone: number[];
    public seatsSelected: any[] = [];

    constructor(private _self: SeatMapCanvas) {
    }

    public init() {

        if (!this._self.global.config.selection_zone) return;

        this.selectionBox = null;
        this._self.svg.node.on("mousedown", () => {
            if (d3Event.shiftKey) {

                this._self.zoomManager.zoomGlobalDisable();

                // Start selection
                this.startPointZone = d3Mouse(this._self.svg.node.node());
                this.isSelectingZone = true;

                if (!this.selectionBox) {
                    this.selectionBox = this._self.svg.node.append("rect")
                        .attr("class", "selection");
                }
                this.selectionBox
                    .attr("x", this.startPointZone[0])
                    .attr("y", this.startPointZone[1])
                    .attr("width", 0)
                    .attr("height", 0);
                    
            }
        })
        

        this._self.svg.node.on("mousemove", () => {
            if (this.isSelectingZone) {
                const currentPoint = d3Mouse(this._self.svg.node.node());

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

        this._self.svg.node.on("mouseup", () => {
            if ( this.isSelectingZone) {
                const {x, y, width, height} = this.selectionBox.node().getBoundingClientRect();
                const selectionBounds = {
                    x0: x,
                    y0: y,
                    x1: x + width,
                    y1: y + height
                };
                var _selectionManager = this;

                this._self.svg.node.selectAll('g.seat').each(function(d) {
                    const gElement = d3Select(this);
                    const circle = gElement.select('circle');

                    const bounds = circle.node().getBoundingClientRect();

                    const cx = bounds.x+ (bounds.width/2);
                    const cy = bounds.y+ (bounds.height/2);


                    const isSelected = cx >= selectionBounds.x0 &&
                                        cx <= selectionBounds.x1 &&
                                        cy >= selectionBounds.y0 &&
                                        cy <= selectionBounds.y1;
                            
                    if (_selectionManager.seatsSelected.includes(gElement.attr("id")) && isSelected) {
                        _selectionManager.seatsSelected = _selectionManager.seatsSelected.filter((item) => item != gElement.attr("id"));
                    } else if (isSelected) {
                        _selectionManager.seatsSelected.push(gElement.attr("id"));
                    }
                    
                });
                this.updateSelection();
                this.selectionBox.remove();
                this.selectionBox = null;
                this.isSelectingZone = false;
                
                this._self.zoomManager.zoomGlobalEnable();

                this._self.global.zoom_enable = true;
            }
        });

        //this.stage.updateEvents(true);
    }

    updateSelection () {
        var _selectionManager = this;
        this._self.svg.node.selectAll('g.seat').each(function(d) {
            const gElement = d3Select(this);
            gElement.classed("seat-selected-zone", _selectionManager.seatsSelected.map((seat) => (seat.toString())).includes(gElement.attr("id")));
        });
    }

    getSeatsSelected() {
        return this.seatsSelected;
    }

    setSeatsSelected(seats: any[]) {
        this.seatsSelected = seats;
        this.updateSelection();
    }

}