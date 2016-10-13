import {getAllComponents,getComponent,addComponent,addComponentVersion} from "./component.data";

export let allComponents;

export let componentData;
let componentName, componentVersion;

export function initComponentPage(){
    // handle promise

    // to be removed
    allComponents = getAllComponents();
    if(allComponents.length>0){
        showComponentList();
    }else{
        showNoComponent();
    }
}

function showComponentList(){
    $.ajax({
        url: "../../templates/component/componentList.html",
        type: "GET",
        cache: false,
        success: function (data) {
            $("#main").html($(data));    
            $("#componentlist").show("slow");

            $(".newcomponent").on('click',function(){
                showNewComponent();
            }) 

            $(".componentlist_body").empty();
            _.each(allComponents,function(item){
                var pprow = '<tr style="height:50px"><td class="pptd">'
                        +'<span class="glyphicon glyphicon-menu-down treeclose" data-name="'+item.name+'"></span>&nbsp;'
                        +'<span class="glyphicon glyphicon-menu-right treeopen" data-name="'+item.name+'"></span>&nbsp;' 
                        + item.name + '</td><td></td><td></td></tr>';
                $(".componentlist_body").append(pprow);
                _.each(item.versions,function(version){
                    var vrow = '<tr data-pname="' + item.name + '" data-version="' + version.version + '" style="height:50px">'
                            +'<td></td><td class="pptd">' + version.version + '</td>'
                            +'<td><button type="button" class="btn btn-primary ppview">View</button></td></tr>';
                    $(".componentlist_body").append(vrow);
                })
            }) ;

            $(".treeclose").on("click",function(event){
                var target = $(event.currentTarget);
                target.hide();
                target.next().show();
                var name = target.data("name");
                $('*[data-pname='+name+']').hide();
            });

            $(".treeopen").on("click",function(event){
                var target = $(event.currentTarget);
                target.hide();
                target.prev().show();
                var name = target.data("name");
                $('*[data-pname='+name+']').show();
            });

            $(".ppview").on("click",function(event){
                var target = $(event.currentTarget);
                componentName = target.parent().parent().data("pname");
                componentVersion = target.parent().parent().data("version");
                showComponentDesigner();
            })
        }
    });
}

function showNoComponent(){
    $.ajax({
        url: "../../templates/component/noComponent.html",
        type: "GET",
        cache: false,
        success: function (data) {
            $("#main").html($(data));    
            $("#nocomponent").show("slow");
            $(".newcomponent").on('click',function(){
                showNewComponent();
            })  
        }
    });
}

function showNewComponent(){
    $.ajax({
        url: "../../templates/component/newComponent.html",
        type: "GET",
        cache: false,
        success: function (data) {
            $("#main").children().hide();
            $("#main").append($(data));    
            $("#newcomponent").show("slow");
            $("#newComponentBtn").on('click',function(){
                // addPipeline();

                // to be removed below
                if(addComponent()){
                    initComponentPage();
                }  
            })
            $("#cancelNewComponentBtn").on('click',function(){
                cancelNewComponentPage();
            })
        }
    });
}

function showComponentDesigner(){ 
    $.ajax({
        url: "../../templates/component/componentDesign.html",
        type: "GET",
        cache: false,
        success: function (data) {
            $("#main").html($(data));    
            $("#componentdesign").show("slow"); 

            var selectedcomponent = _.find(allComponents,function(c){
                return c.name == componentName;
            });
            var selectedversion = _.find(selectedcomponent.versions,function(version){
                return version.version == componentVersion;
            });
            componentData = selectedversion.data;

            $("#selected_component").text(componentName + " / " + componentVersion); 

            // initDesigner();

            $(".backtolist").on('click',function(){
                initComponentPage();
            });

            $(".newcomponentversion").on('click',function(){
                showNewComponentVersion();
            })

            $(".newcomponent").on('click',function(){
                showNewComponent();
            })
        }
    }); 
}

function showNewComponentVersion(){
    $.ajax({
        url: "../../templates/component/newComponentVersion.html",
        type: "GET",
        cache: false,
        success: function (data) {
            $("#main").children().hide();
            $("#main").append($(data));    
            $("#newcomponentversion").show("slow"); 

            $("#c-name-newversion").val(componentName);

            $("#newComponentVersionBtn").on('click',function(){
                // addPipelineVersion(pipelineVersion);

                // to be removed below
                if(addComponentVersion(componentVersion)){
                    initComponentPage();
                } 
            })
            $("#cancelNewComponentVersionBtn").on('click',function(){
                cancelNewComponentVersionPage();
            })      
        }
    }); 
    
    $("#content").hide();
    $("#nocomponent").hide();
    $("#newcomponent").hide();
    $("#newcomponentversion").show("slow");
}

function cancelNewComponentPage(){
    $("#newcomponent").remove();
    $("#main").children().show("slow");
}

function cancelNewComponentVersionPage(){
    $("#newcomponentversion").remove();
    $("#main").children().show("slow");
}

// $("#pipeline-select").on('change',function(){
//     showVersionList();
// })
// $("#version-select").on('change',function(){
//     showPipeline();
// })

// function showPipelineList(){
//     $("#pipeline-select").empty();
//     d3.select("#pipeline-select")
//         .selectAll("option")
//         .data(allPipelines)
//         .enter()
//         .append("option")
//         .attr("value",function(d,i){
//             return d.name;
//         })
//         .text(function(d,i){
//             return d.name;
//         }); 
//      $("#pipeline-select").select2({
//        minimumResultsForSearch: Infinity
//      });   
//     showVersionList();
// }

// function showVersionList(){
//     var pipeline = $("#pipeline-select").val();
//     var versions = _.find(allPipelines,function(item){
//         return item.name == pipeline;
//     }).versions;

//     $("#version-select").empty();
//     d3.select("#version-select")
//         .selectAll("option")
//         .data(versions)
//         .enter()
//         .append("option")
//         .attr("value",function(d,i){
//             return d.version;
//         })
//         .text(function(d,i){
//             return d.version;
//         }); 
//     $("#version-select").select2({
//        minimumResultsForSearch: Infinity
//      });
    
//     versions_shown = versions;

//     showPipeline(); 
// }
