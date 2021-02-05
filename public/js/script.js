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

// (function () {
//     new Vue({
//         // el - element in our html that has access to our Vue code!
//         el: "#main",
//         // data - an object that we add any info to that is dynamic / we want to render onscreen
//         data: {
//             images: [],
//             title: "",
//             description: "",
//             username: "",
//             file: null,
//         },
//         // mounted is a lifecycle method that runs when the Vue instance renders
//         mounted: function () {
//             // console.log("my vue instance has mounted");
//             // console.log("this outside axios: ", this);
//             axios
//                 .get("/images")
//                 .then(
//                     ({ data }) => (this.images = data)
//                     // console.log("this inside axios: ", self);
//                     // axios will ALWAYS store the info coming from the server inside a 'data' property
//                     // console.log("response from /images: ", response.data);
//                 )
//                 .catch((err) => console.log("error! : ", err));
//         },

//         //methods will store ALL the functions we create!!!
//         methods: {
//             clickHandler: function () {
//                 console.log("this: ", this);
//             },
//         },
//         fileSelectHandler: function (e) {
//             this.file = e.target.files[0];
//         },
//     });
// });
(function () {
    new Vue({
        el: "#main",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            selectedImage: null,
            moreBtn: true,
            lowestId: 0,
        },

        mounted: function () {
            console.log("my vue instance has mounted");
            console.log("this outside axios: ", this);
            var self = this;

            axios
                .get("/images")
                .then(function (response) {
                    console.log("this inside axios: ", self);
                    // axios will ALWAYS store the info coming from the server inside a 'data' property
                    console.log("response from /images: ", response.data);
                    self.images = response.data;

                    if (response.data.length < 6) {
                        self.moreBtn = false;
                    }
                })
                .catch(function (err) {
                    console.log("err in /images: ", err);
                });
        },

        methods: {
            //WHERE I STORE ALL MY FUNCTIONS
            clickHandler: function () {
                const fd = new FormData();
                var self = this;
                fd.append("title", this.title);
                fd.append("description", this.description);
                fd.append("username", this.username);
                fd.append("file", this.file);

                axios
                    .post("/upload", fd)
                    .then((response) => self.images.unshift(response.data)) //console.log("response: ", response)
                    .catch((err) => console.log("err: ", err));
            },
            fileSelectHandler: function (e) {
                this.file = e.target.files[0];
            },
            // closeModal: function (e) {
            //     this.selectedImage = null; //now the if in html is falsy, so close the modal
            // }, // instead of creating a fn for it i just declare @close="selectedImage=null" in my html component
            getMoreImages: function () {
                var self = this;
                console.log("this: ", this);
                const lastPicIndex = this.images.length - 1;
                const lastPicID = this.images[lastPicIndex].id; // ultimo oggetto nell'array // la mia ultima img
                console.log("lastPicID: ", lastPicID);
                this.lowestId = lastPicID;

                axios
                    .get(`/load-more/${lastPicID}`)
                    .then((response) => {
                        console.log("response.data: ", response.data);
                        for (let i = 0; i < response.data.length; i++) {
                            if (
                                response.data[i].id === response.data[i].lastId
                                //o se array.lenght < 6 ???
                            ) {
                                this.moreBtn = false;
                            }
                        }
                        self.images.push(...response.data);
                    })
                    .catch((err) => console.log("err: ", err));
            },
        },
    });

    Vue.component("modal-component", {
        template: "#modal-template",
        data: function () {
            return {
                data: [],
            };
        },
        props: ["pictureid"],
        mounted: function () {
            console.log("pictureid: ", this.pictureid);
            var self = this;

            axios
                .get(`/picture/${this.pictureid}`)
                .then((response) => {
                    console.log("response: ", response);
                    console.log("response.data: ", response.data);
                    self.data = response.data;
                })
                .catch((err) => console.log("err: ", err));
        },
        methods: {
            closeModal: function () {
                console.log("please close the modal!");
                this.$emit("close");
            },
        },
    });

    Vue.component("comments-component", {
        template: "#comments-template",
        data: function () {
            return {
                comments: [],
                username: "",
                comment: "",
            };
        },
        props: ["image_id"],
        mounted: function () {
            console.log("image_id from comments-component: ", this.image_id);
            var self = this;
            axios
                .get(`/comments/${this.image_id}`)
                .then((response) => {
                    console.log("response: ", response);
                    console.log("self: ", self);
                    //not done
                    self.comments = response.data;
                })
                .catch((err) => console.log("err: ", err));
        },
        methods: {
            //not done
            postComment: function () {
                console.log("please submit the comment!");
                console.log("this: ", this);
                let obj = {
                    comment: this.comment,
                    username: this.username,
                    created_at: this.created_at,
                    image_id: this.image_id,
                };

                axios
                    .post(`/comments`, obj) //forse non dynamic qua
                    .then((response) => {
                        console.log("response.data: ", response.data);
                        this.comments.push(response.data);
                    })
                    .catch((err) => console.log("err: ", err));
            },
        },
    });
})();
