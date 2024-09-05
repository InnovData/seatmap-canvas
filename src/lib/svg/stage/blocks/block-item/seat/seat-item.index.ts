/*
 * $project.fileName
 * https://github.com/alisaitteke/seatmap-canvas Copyright 2018 Ali Sait TEKE
 */


import SvgBase from "../../../../svg.base";
import {dom} from "../../../../../decorators/dom";
import SeatModel from "../../../../../models/seat.model";
import Seats from "../block-item.seats.index";
import {SeatItemCircle} from "./seat-item.circle";
import {CoordinateModel} from "../../../../../models/coordinate.model";
import {SeatItemTitle} from "./seat-item.title";
import {SeatAction} from "../../../../../enums/global";
import {SeatItemCheck} from "./seat-item.check";


@dom({
    tag: "g",
    class: "seat",
    autoGenerate: false
})
export class SeatItem extends SvgBase {

    public circle: SeatItemCircle;
    public title: SeatItemTitle;
    public coordinates: CoordinateModel;
    public check: SeatItemCheck;

    constructor(public parent: Seats, public item: SeatModel) {
        super(parent);
        this.coordinates = new CoordinateModel(item);
        this.attr("transform", "translate(" + this.coordinates.toArray() + ")");
        this.item.svg = this;
        return this;
    }

    public setClass(classe: string): this {
        this.circle.node.attr("class", classe);
        return this;
    }

    public select(): this {
        if (this.global.config.selection_zone) {
            const currentSeats = this.global.selectionManager.getSeatsSelected().map((item) => item.toString());

            if (currentSeats.includes(this.item.id.toString())) {
                this.global.selectionManager.setSeatsSelected(currentSeats.filter((item) => item != this.item.id.toString()));
            } else {
                currentSeats.push(this.item.id);
                this.global.selectionManager.setSeatsSelected(currentSeats);
            }
        } else {
            this.item.selected = true;
            this.node.classed("selected", true);
            this.check.show();
        }
        return this;
    }

    public unSelect(): this {
        if (this.global.config.selection_zone) {

            const currentSeats = this.global.selectionManager.getSeatsSelected();
            if (currentSeats.includes(this.item.id.toString())) {
                this.global.selectionManager.setSeatsSelected(currentSeats.filter((item) => item.toString() != this.item.id.toString()));
            } else {
                currentSeats.push(this.item.id);
                this.global.selectionManager.setSeatsSelected(currentSeats);
            }

        } else {
            this.item.selected = false;
            this.node.classed("selected", false);
            this.check.hide();
        }
        return this;
    }

    public isSelected(): Boolean {
        return this.item.selected;
    }

    public salable(): this {
        this.item.salable = true;
        this.node.classed("salable", false);
        return this;
    }

    public unSalable(): this {
        this.item.salable = false;
        this.node.classed("salable", true);
        return this;
    }

    public isSalable(): Boolean {
        return this.item.salable;
    }

    public hoverOn () {
        // this.node.classed("hover", true);
        this.circle.node.style("fill", this.global.config.style.seat.hover);
        this.circle.node.style("transform", 'scale(1.2)');

    }

    public hoverOut () {
        // this.node.classed("hover", false);
        this.circle.node.style("fill", '');
        this.circle.node.style("transform", '');
    }

    public setCustomData(data: any = {}): this {
        this.item.custom_data = {
            ...this.item.custom_data ? this.item.custom_data : {},
            ...data
        };
        return this;
    }

    update(): this {
        this.circle = new SeatItemCircle(this);
        this.addChild(this.circle);


        this.check = new SeatItemCheck(this).addTo(this);
        if (!this.isSalable()) {
            this.unSalable();
        }
        if (this.isSelected()) {
            this.node.classed("selected", true);
        }
        if (this.item.custom_data && this.item.custom_data.categorieIds && Array.isArray(this.item.custom_data.categorieIds)) {
            this.item.custom_data.categorieIds.forEach((cat: any) => {
                this.node.classed(`seat-category-${cat.id}`, true);
            });
        }
        // this.title = new SeatItemTitle(this);
        // this.addChild(this.title);


        this.updateChilds();

        //this.title.node.text(this.item.title);

        return this;
    }
    afterGenerate(){
        // this.setColor(this.getColor());
        if(this.item.selected){
            this.check.show()
        }else{
            this.check.hide()
        }

    }

}
