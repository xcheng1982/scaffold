// var uuid = require('node-uuid');

$(function () {

});

var PIPELINE_START = "pipeline-start";
var PIPELINE_END = "pipeline-end";
var PIPELINE_ADD_STAGE = "pipeline-add-stage";
var PIPELINE_ADD_ACTION = "pipeline-add-action";

var PIPELINE_STAGE = "pipeline-stage";
var PIPELINE_ACTION = "pipeline-action";

var pipelineView = null;
var actionsView = null;
var actionView = [];
var buttonView = null;


var PipelineNodeSpaceSize = 150;
var pipelineNodeStartX = 0;
var pipelineNodeStartY = 0;
var svgWidth = 0;
var svgHeight = 0;
var svgMainRect = null;


var svgStageWidth = 80;
var svgStageHeight = 60;

var svgActionWidth = 60;
var svgActionHeight = 40;

var svgButtonWidth = 30;
var svgButtonHeight = 30;


var svg = null;
var g = null;

var pipelineData = [
    {
        id: "pipeline-start" + "-" + uuid.v1(),
        type: PIPELINE_START,
        drawX: 0,
        drawY: 0,
        width: 0,
        height: 0,
        translateX: 0,
        translateY: 0
    }, {
        id: PIPELINE_STAGE + "-" + uuid.v1(),
        type: PIPELINE_STAGE,
        class: PIPELINE_STAGE,
        drawX: 0,
        drawY: 0,
        width: 0,
        height: 0,
        translateX: 0,
        translateY: 0,
        actions:[]
    }, {
        id: PIPELINE_STAGE + "-" + uuid.v1(),
        type: PIPELINE_STAGE,
        class: PIPELINE_STAGE,
        drawX: 0,
        drawY: 0,
        width: 0,
        height: 0,
        translateX: 0,
        translateY: 0,
        actions: []
    },
    {
        id: "pipeline-add-stage" + "-" + uuid.v1(),
        type: PIPELINE_ADD_STAGE,
        drawX: 0,
        drawY: 0,
        width: 0,
        height: 0,
        translateX: 0,
        translateY: 0
    },
    {
        id: "pipeline-end" + "-" + uuid.v1(),
        type: PIPELINE_END,
        drawX: 0,
        drawY: 0,
        width: 0,
        height: 0,
        translateX: 0,
        translateY: 0
    }
]


$(document).ready(function () {

    $("#div-d3-main-svg").height($("main").height() - 50);
    svgWidth = $("#div-d3-main-svg").width();
    svgHeight = $("#div-d3-main-svg").height();

    var zoom = d3.behavior.zoom()
        .on("zoom", zoomed);

    svg = d3.select("#div-d3-main-svg")
        .on("touchstart", nozoom)
        .on("touchmove", nozoom)
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .style("fill", "white");

    g = svg.append("g")
        .call(zoom);

    svgMainRect = g.append("rect")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .on("click", clicked);

    pipelineView = g.append("g")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("id", "pipelineView");

    actionsView = g.append("g")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("id", "actionsView");

    buttonView = g.append("g")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("id", "buttonView");


    initNodeXY();
    initPipeline();

    initAction();
});

function initNodeXY() {
    pipelineNodeStartX = 50;
    pipelineNodeStartY = svgHeight / 2;
}

function initPipeline() {
    pipelineView.selectAll("image").remove();
    pipelineView.selectAll("image")
        .data(pipelineData)
        .enter()
        .append("image")
        .attr("xlink:href", function (d, i) {
            // console.log(d.type);
            if (d.type == PIPELINE_START) {
                // console.log(PIPELINE_START);
                return "./svg/start.svg";
            } else if (d.type == PIPELINE_ADD_STAGE) {
                // console.log(PIPELINE_ADD_STAGE);
                return "./svg/addStage.svg";
            } else if (d.type == PIPELINE_END) {
                // console.log(PIPELINE_END);
                return "./svg/end.svg";
            } else if (d.type == PIPELINE_STAGE) {
                // console.log(PIPELINE_STAGE);
                return "./svg/stage.svg";
            }
        })
        .attr("id", function (d, i) {
            return d.id;
        })
        .attr("width", function (d, i) {
            return svgStageWidth;
        })
        .attr("height", function (d, i) {
            return svgStageHeight;
        })
        .attr("transform", function (d, i) {
            d.width = svgStageWidth;
            d.height = svgStageHeight;
            d.translateX = i * PipelineNodeSpaceSize + pipelineNodeStartX;
            d.translateY = pipelineNodeStartY;
            return "translate(" + d.translateX + "," + d.translateY + ")";
        })
        .attr("class", function (d, i) {
            // console.log(d);
            if (d.type == PIPELINE_START) {
                // console.log(PIPELINE_START);
                return PIPELINE_START;
            } else if (d.type == PIPELINE_ADD_STAGE) {
                // console.log(PIPELINE_ADD_STAGE);
                return PIPELINE_ADD_STAGE;
            } else if (d.type == PIPELINE_END) {
                // console.log(PIPELINE_END);
                return PIPELINE_END;
            } else if (d.type == PIPELINE_STAGE) {
                // console.log(PIPELINE_STAGE);
                return PIPELINE_STAGE;
            }
        })
        .on("mouseover", function (d, i) {
            d3.select("#" + d.id)
                .attr("transform",
                    "translate(" + (d.translateX - (d.width / 2)) + "," + (d.translateY - (d.height / 2)) + ") scale(2)");
        })
        .on("mouseout", function (d, i) {
            d3.select("#" + d.id)
                .attr("transform",
                    "translate(" + (d.translateX) + "," + (d.translateY ) + ") scale(1)");
        })
        .on("click", function (d, i) {
            if (d.type == PIPELINE_START) {
                // console.log(PIPELINE_START);
            } else if (d.type == PIPELINE_ADD_STAGE) {
                // console.log(PIPELINE_ADD_STAGE);
                clickAddStage(this, d, i);
            } else if (d.type == PIPELINE_END) {
                // console.log(PIPELINE_END);
            } else if (d.type == PIPELINE_STAGE) {
                clickStage(this, d, i);
                // initAction();
            }
        });
}

function clickAddStage(d, i) {
    //add stage data
    pipelineData.splice(
        pipelineData.length - 2,
        0,
        {
            id: PIPELINE_ACTION + "-" + uuid.v1(),
            type: PIPELINE_STAGE,
            class: PIPELINE_STAGE,
            drawX: 0,
            drawY: 0,
            width: 0,
            height: 0,
            translateX: 0,
            translateY: 0,
            actions:[]
        });

    initPipeline();
    initAction();
}

function initAction() {
    //Action
    pipelineView.selectAll("image").each(function (d, i) {
        if (d.type == PIPELINE_STAGE && d.actions != null && d.actions.length > 0) {
            var actionViewId = "action" + "-" + d.id;
            if (actionView[actionViewId] == null) {
                actionView[actionViewId] = actionsView.append("g")
                    .attr("width", svgWidth)
                    .attr("height", svgHeight)
                    .attr("id", actionViewId);
            } else {
                actionView[actionViewId].selectAll("image").remove();
                actionView[actionViewId].attr("width", svgWidth)
                    .attr("height", svgHeight)
                    .attr("id", actionViewId);
            }

            var actionStartX = d.translateX;
            var actionStartY = d.translateY;

            actionView[actionViewId].selectAll("image")
                .data(d.actions).enter()
                .append("image")
                .attr("xlink:href", function (ad, ai) {
                    if (ai % 2 == 0) {
                        return "./svg/action-bottom.svg";
                    } else {
                        return "./svg/action-top.svg";
                    }
                })
                .attr("id", function (ad, ai) {
                    return ad.id;
                })
                .attr("width", function (ad, ai) {
                    return svgActionWidth;
                })
                .attr("height", function (ad, ai) {
                    return svgActionHeight;
                })
                .attr("transform", function (ad, ai) {
                    ad.width = svgActionWidth;
                    ad.height = svgActionHeight;
                    if (ai % 2 == 0) {
                        ad.translateX = actionStartX;
                        ad.translateY = actionStartY + PipelineNodeSpaceSize * (ai / 2 + 1);
                    } else {
                        ad.translateX = actionStartX;
                        ad.translateY = actionStartY - PipelineNodeSpaceSize * (ai / 2) - 50;
                    }

                    console.log("translate(" + ad.translateX + "," + ad.translateY + ")");
                    return "translate(" + ad.translateX + "," + ad.translateY + ")";
                })
                .on("mouseover", function (ad, ai) {
                    d3.select("#" + ad.id)
                        .attr("transform",
                            "translate("
                            + (ad.translateX - (ad.width / 2)) + ","
                            + (ad.translateY - (ad.height / 2)) + ") scale(2)");
                })
                .on("mouseout", function (ad, i) {
                    d3.select("#" + ad.id)
                        .attr("transform",
                            "translate("
                            + (ad.translateX) + ","
                            + (ad.translateY ) + ") scale(1)");
                })
                .on("click", function (ad, i) {
                    console.log(ad);
                });

            d3.select(actionView[actionViewId]).transition()
                .transition()

        }

    });
}

function clickStage(sView, sd, si) {

    buttonView.selectAll("image").remove();

    //show add action button
    buttonView.append("image")
        .attr("xlink:href", function (d, i) {
            return "./svg/actionAdd.svg";
        })
        .attr("id", function (d, i) {
            return "button" + "-" + uuid.v1();
        })
        .attr("width", function (d, i) {
            return svgButtonWidth;
        })
        .attr("height", function (d, i) {
            return svgButtonHeight;
        })
        .attr("translateX", function (d, i) {
            return sd.translateX - (svgButtonWidth*2);
        })
        .attr("translateY", function (d, i) {
            return sd.translateY ;
        })
        .attr("transform", function (d, i) {
            return "translate(" + this.attributes["translateX"].value + "," + this.attributes["translateY"].value + ")";
        })
        .on("mouseover", function (d, i) {
            d3.select(this)
                .attr("transform",
                    "translate("
                    + this.attributes["translateX"].value  + ","
                    + this.attributes["translateY"].value + ") scale(2)");
        })
        .on("mouseout", function (d, i) {
            d3.select(this)
                .attr("transform",
                    "translate("
                    + this.attributes["translateX"].value + ","
                    + this.attributes["translateY"].value + ") scale(1)");
        })
        .on("click", function (d, i) {
            sd.actions.splice(
                sd.actions.length,
                0,
                {
                    id: PIPELINE_ACTION + "-" + uuid.v1(),
                    type: PIPELINE_ACTION,
                    class: PIPELINE_ACTION,
                    drawX: 0,
                    drawY: 0,
                    width: 0,
                    height: 0,
                    translateX: 0,
                    translateY: 0
                });
            buttonView.selectAll("image").remove();
            initAction();
        });

    //show del stage button
    buttonView.append("image")
        .attr("xlink:href", function (d, i) {
            return "./svg/stageDel.svg";
        })
        .attr("id", function (d, i) {
            return "button" + "-" + uuid.v1();
        })
        .attr("width", function (d, i) {
            return svgButtonWidth;
        })
        .attr("height", function (d, i) {
            return svgButtonHeight;
        })
        .attr("translateX", function (d, i) {
            return sd.translateX + (svgButtonWidth/2);
        })
        .attr("translateY", function (d, i) {
            return sd.translateY - (svgButtonHeight*2);
        })
        .attr("transform", function (d, i) {
            return "translate("
                + this.attributes["translateX"].value + ","
                + this.attributes["translateY"].value + ")";
        })
        .on("mouseover", function (d, i) {
            d3.select(this)
                .attr("transform",
                    "translate("
                    + (this.attributes["translateX"].value - svgButtonWidth/2) + ","
                    + (this.attributes["translateY"].value ) + ") scale(2)");
        })
        .on("mouseout", function (d, i) {
            d3.select(this)
                .attr("transform",
                    "translate("
                    + this.attributes["translateX"].value + ","
                    + this.attributes["translateY"].value + ") scale(1)");
        })
        .on("click", function (d, i) {
            buttonView.selectAll("image").remove();
            alert("del stage");
        });


    //show close stage pop button
    buttonView.append("image")
        .attr("xlink:href", function (d, i) {
            return "./svg/stageClosePop.svg";
        })
        .attr("id", function (d, i) {
            return "button" + "-" + uuid.v1();
        })
        .attr("width", function (d, i) {
            return svgButtonWidth;
        })
        .attr("height", function (d, i) {
            return svgButtonHeight;
        })
        .attr("translateX", function (d, i) {
            return sd.translateX + (svgButtonWidth*3);
        })
        .attr("translateY", function (d, i) {
            return sd.translateY;
        })
        .attr("transform", function (d, i) {
            return "translate("
                + this.attributes["translateX"].value + ","
                + this.attributes["translateY"].value + ")";
        })
        .on("mouseover", function (d, i) {
            d3.select(this)
                .attr("transform",
                    "translate("
                    + (this.attributes["translateX"].value ) + ","
                    + (this.attributes["translateY"].value ) + ") scale(2)");
        })
        .on("mouseout", function (d, i) {
            d3.select(this)
                .attr("transform",
                    "translate("
                    + this.attributes["translateX"].value + ","
                    + this.attributes["translateY"].value + ") scale(1)");
        })
        .on("click", function (d, i) {
            buttonView.selectAll("image").remove();
        });
}

function zoomed() {
    pipelineView.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
    actionsView.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
    buttonView.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
}

function clicked(d, i) {
    if (d3.event.defaultPrevented) return; // zoomed
    d3.select(this).transition()
        .transition()
}
function nozoom() {
    d3.event.preventDefault();
}