// console.log("script is linked");
// this file is where all of our Vue code will exist!!

// (function () {
//     new Vue({
//         el: "#main",

//         data: {
//             name: "Adobo",
//             seen: true,
//             cities: [],
//         },

//         // mounted is a lifecycle method that runs when the Vue instance renders
//         mounted: function () {
//             // console.log("my vue instance has mounted");
//             // console.log("this outside axios: ", this);
//             var self = this;

//             axios
//                 .get("/cities")
//                 .then(function (response) {
//                     // console.log("this inside axios: ", self);
//                     // axios will ALWAYS store the info coming from the server inside a 'data' property
//                     // console.log("response from /cities: ", response.data);

//                     self.cities = response.data;
//                 })
//                 .catch(function (err) {
//                     console.log("err in /cities: ", err);
//                 });
//         },

//         // methods will store ALL the functions we create!!!
//         methods: {
//             myFunction: function () {
//                 console.log("myFunction is running!!!!");
//             },
//         },
//     });
// })();

(function () {
    new Vue({
        // el - element in our html that has access to our Vue code!
        el: "#main",
        // data - an object that we add any info to that is dynamic / we want to render onscreen
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
        },
        // mounted is a lifecycle method that runs when the Vue instance renders
        mounted: function () {
            // console.log("my vue instance has mounted");
            // console.log("this outside axios: ", this);
            axios
                .get("/images")
                .then(
                    ({ data }) => (this.images = data)
                    // console.log("this inside axios: ", self);
                    // axios will ALWAYS store the info coming from the server inside a 'data' property
                    // console.log("response from /images: ", response.data);
                )
                .catch((err) => console.log("error! : ", err));
        },

        //methods will store ALL the functions we create!!!
        methods: {
            clickHandler: function () {
                console.log("this: ", this);
            },
        },
        fileSelectHandler: function (e) {
            this.file = e.target.files[0];
        },
    });
});
