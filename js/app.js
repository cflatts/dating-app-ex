// 01 - Configure Router
//---------------------------------

// (0) Make sure jQuery, _, and BB are wired UP!  CHECK

// (1) extend Backbone.Router CHECK

// (2) create router instance with `new` keyword CHECK

// (3) set routes + route-callback functions CHECK

// (4) create route-callback functions for our 2 routes CHECK

// (5) tell the router to take over browser-history/hash-routes with Backbone.history.start()
//      in the Router's `initialize` function

// In the view is where we will render data, it will take a model as input.
var MultiDaterView = Backbone.View.extend({
    //el is special to backbone, it refers to our earlier mentioned document.querySelector("#container") wrapped into a nice little key called 'el'
    el: "#container",

    //Using a custome function called _buildTemplate will let us render all of our results in a similar style. For this one, we want all our daters to show on the same page.
    _buildTemplate: function(modelsArr){
        console.log(modelsArr)
        //Since we are passing in a array, we want to start with an empty string.
        var htmlString = ""

        //Iterate through our array of models ( daters ), and render some data from them.
        for (var i = 0; i < modelsArr.length; i++){
            console.log(modelsArr[i])

            var m = modelsArr[i]

            htmlString += '<div class="profile-card" id='+m.get('bioguide_id')+'>'
            htmlString +=   '<a href="#profile/' + m.get('bioguide_id') + '">'
            htmlString +=       '<img src="http://flathash.com/'+ m.get('bioguide_id') +'">'
            htmlString +=       "<h5>"+ m.get('first_name') + '</br>'
            htmlString +=       '<small>' + m.get('state_name')+ '</small>'
            htmlString +=       '</h5>'
            htmlString +=   '</a>'
            htmlString += '</div>'
        }

        //Returning one finished model , then start at the beginning of the loop again.
        return htmlString
    },

    _render: function(){
        this.el.innerHTML = this._buildTemplate(this.coll.models)
    },

    initialize: function(theCollection){
        console.log(theCollection)
        this.coll = theCollection
    }


})

var DaterModel = Backbone.Model.extend({})

var DaterCollection = Backbone.Collection.extend({
    //We can state which model type this collection will contain.
    model: DaterModel,

    //Step 2 of the lifecycle methods is reading our url key.  Fetch specifically LOOKS for a key called 'url'.
    url: "https://congress.api.sunlightfoundation.com/legislators?apikey=7ba96d266cc84b168fab4d878d9aa141",

    //Step 3, is parse, parse runs immediately after url once fetch is fired.  Fetch -> url -> parse. Remember parse is singling out just the data we want from our collection and not all the extra crap we don't need.
    parse: function(respObj){
        console.log('Parsing data from...', respObj)
        //Step 4,  Choose the right data to return, we can look through the respObj to see which part of it we want to parse.  Here we want respObj's results object.
        return respObj.results
    },

    // Here we will give our url functionality to add more parameters. Which can help us narrow down our search.
    initialize: function(addParams){
        if (addParams) {
        this.url += "&" + addParams
        }
    }

})

var AppRouter = Backbone.Router.extend({
    routes: {
        'profile/:bioId':'showSingleView',
        '*default':'showMultiView'
    },

    showSingleView: function(bioId){
        var appContainerEl = document.querySelector('#container')

        var singleDaterColl = new DaterCollection("bioguide_id=" + bioId)
        singleDaterColl.fetch().then(function(){

            var daterModel = singleDaterColl.models[0]
            appContainerEl.innerHTML = '<h2>SINGLE DATER!!' + daterModel.get('first_name') + '</h2>'

            console.log(singleDaterColl)
        })
    },

    showMultiView: function(){
        var daterColl = new DaterCollection()
        //Remember, using fetch is a built in function that will look at it's parent's url key first.  This begins our life cycle methods.  this is Step 1.
        daterColl.fetch().then(function(respObj){

            var multiView = new MultiDaterView(daterColl)
            multiView._render()
            })

            var appContainerEl = document.querySelector('#container')
        },

    showDefaultView: function(){
        // $.getJSON("https://congress.api.sunlightfoundation.com/legislators?=apikey=7ba96d266cc84b168fab4d878d9aa141")
        // .then(function(respObj){
        //     console.log(respObj)
        // })

        var daterColl = new DaterCollection()
        //Remember, using fetch is a built in function that will look at it's parent's url key first.  This begins our life cycle methods.  this is Step 1.
        daterColl.fetch().then(function(respObj){
            // console.log(respObj)

            //Let's iterate over all the objects from our array.
            for(var i = 0; i < daterColl.length; i++){
                //We want to single out each model.  Btw, models are just objects that are similar in key structure but just have their own data values.
                var singleModel = daterColl.models[i]
                                                     //We want to access each object's data properties. It's slightly different in backbone...
                                                     //Using .get is cool.  .get is smart!  It will search under attributes, and find the key we specify it.
                appContainerEl.innerHTML += "<h1>" + singleModel.get('first_name') + "</h1>"
            }

            // We can console log the entire collection, which at this point only contains our one DaterModel.  Right now, it's deeply nested and really ugly, We want to parse it so that we can single out only the info we need.
            console.log(daterColl)
        })

        var appContainerEl = document.querySelector("#container")
        appContainerEl.innerHTML = "<h1>So So So Many Dates Home!</h1>"
    },

    initialize: function(){
        Backbone.history.start();
    }

})

var myApp = new AppRouter()