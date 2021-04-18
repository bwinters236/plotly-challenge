// function to divide up the json into usable bits and control printing the charts
function charts(id) {
    


    // grabbing the data from the json, logging it to console
    d3.json("samples.json").then((data)=> {
        console.log(data)



        // filtering samples by their id, casting the sample to a string for comparison 
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        console.log(samples);



        // slice the top ten values, reversed for plotly preference? 
        var sampleValues = samples.sample_values.slice(0, 10).reverse();



        // slice the top ten ids for the top ten values, again reversed because plotly 
        var ids = (samples.otu_ids.slice(0, 10)).reverse();
        


        // maps otu ids to have proper prefix, also pulling lables for each id
        var otu_ids = ids.map(i => "OTU " + i)
        var otu_labels = samples.otu_labels.slice(0, 10);


        
        // tarce for bar plot
        var trace = {
            x: sampleValues,
            y: otu_ids,
            text: otu_labels,
            type:"bar",
            orientation: "h",
        };



        // trace saved as array for plotly
        var data = [trace];



        // margin and lables for plot
        var layout = {
            title: "Subject's Ten Most Frequent Bacteria",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 120,
                b: 40
            }
        };

        // feeds the bar plot the data and layout
        Plotly.newPlot("bar", data, layout);
        


        // trace for bubble chart
        var trace_bub = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels

        };



        // bubble plot layout
        var layout_bub = {
            xaxis:{title: "OTU ID"},
            height: 700,
            width: 1200
        };



        // trace saved as array for plotly
        var data_bub = [trace_bub];



        // feeds the bubble plot the data and layout
        Plotly.newPlot("bubble", data_bub, layout_bub); 



        // trace for pie chart
        var trace_pie = {
            labels: otu_ids,
            values: sampleValues,
            type:"pie",
        }



        // trace saved as array for plotly
        var data_pie = [trace_pie]
        
        
        Plotly.newPlot("pie", data_pie)

    });    
}                                








// create the function for the initial data rendering
function init() {



    // use d3 to grab drop down menu
    var dropdown = d3.select("#selDataset");



    // grabbing the data from the json 
    d3.json("samples.json").then((data)=> {



        // appends the drop down with an option for each value in data.names
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });



        // call the functions to display the data and the plots to the page
        charts(data.names[0]);

        info(data.names[0]);

    });
}







// info function to grab metadata from json
function info(id) {


    // grabbing the data from the json 
    d3.json("samples.json").then((data)=> {
        


        // assigning the meta data to metadata
        var metadata = data.metadata;



        // metadata, comparing the id (cast as a string) to the id
        var info = metadata.filter(m => m.id.toString() === id)[0];


        // selecting the info panel
        var infoPanel = d3.select("#sample-metadata");
        


        // the panel should empty between selections
        infoPanel.html("");



        // appending the info panel with the metadata information in the json
        Object.entries(info).forEach((key) => {   
            infoPanel.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}







// function to handle the change event
function change(id) {
    charts(id);
    info(id);
}


// calls the init function, gets everything started and handles the orginal call 
init();
