/* Add your Application JavaScript */

Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-secondary fixed-top">
      <a class="navbar-brand" href="#">Photogram</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
        </ul>
      </div>
    </nav>
    `
});

Vue.component('app-footer', {
    template: `
    <footer>
    <div class="serv_bottom py-5">
      <div class="container py-sm-3">
        <hr>
        <h5 class="text-center text-uppercase text-gray pt-4"><p>&copy; Photogram 2019. All Rights Reserved </p></h5>
      </div>
    </div>
    </footer>
    `
});


const Home = Vue.component('home', {
   template: `
        <div class="home">
            <div class="form-inline d-flex justify-content-center">
                
                
                <div class="has_border">
                    <h5>Welcome to Photogram</h5>
                    <hr>
                    <img src="/static/images/logo.png" alt="Photogram Logo" height="44%" width="64%">
                    <p class="spaced">{{ welcome }}</p>
                    <br/>
                    <div class="form-inline d-flex justify-content-center">
                      <div>
                          <router-link to="/register"><button >Register</button></router-link>
                      </div>
                      <div class="spaced">or</div>
                        <div>
                          <router-link to="/login"><button>Login</button></router-link>
                        </div>
                    </div>
                </div><div class="space2"> </div>
                <div class="has_border"><img src="/static/images/left.jpg" alt="Left Image" height="498" width="100%"></div>
            </div>
              
        </div>
        
    `,
    
    data: function() {
        return {
            welcome: 'Share photos of your favourite moments with friends and family and the world!'
        }
    }
}); 




const Register = Vue.component('registration',{
    
    template:`
  <div class="agile_ihj">
      <form id="registerform" @submit.prevent="registerform" method="POST" enctype="multipart/form-data" novalidate="true">
      <h2>Join Photogram today</h2>
      <p class="alert alert-danger" role="alert" v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
  </p>
      
        <div class="agileinfo">
          <input type="text" name="first_name" v-model="first_name" id="fname" placeholder="First Name" >
        </div>
        <div class="agileinfo">
          <input type="text" name="last_name" v-model="last_name" id="lname" placeholder="Last Name">
        </div>
        <div class="agileinfo">
          <input type="text" name="username" v-model="username" id="username" placeholder="Username" >
        </div>
        <div class="agileinfo">
          <input type="email" name="email" v-model="email" id="email" placeholder="Email" >
        </div>
        <div class="agileinfo">
          <input type="Password" name="password" v-model="password" id="password" placeholder="Password" >
        </div>
        <div class="agileinfo">
          <input type="password" name="check_password" v-model="check_password" id="check_password" placeholder="Confirm Password" >
        </div>
        <div class="agileinfo">
          <input type="text" name="location" v-model="location" id="location" placeholder="Location" >
        </div>
        <div class="agileinfo">
          <input type="text" name="biography" v-model="biography" id="biography" placeholder="Biography" >
        </div>
        <div class="agileinfo">
          <label class="agileinfo" for="photo">Profile photo</label>
          <div class=agileinfo>
            <input class="border2" type="file" name="profilePhoto" v-model="profilePhoto" id="profilePhoto" placeholder="Profile Photo" >
          </div>
        </div>
        
        <div class="w3l_but"><br><br>
          <button type="submit">REGISTER</button>
        </div>
        <div class="agile_par">
          <p>Already have an account? <router-link to="/login">Sign in</router-link></p>
        </div>
      </form>
      
      <div class="clear"></div>
    </div>
`,
  data: function(){
    return{
      errors:[],
      username:null,
      first_name:null,
      last_name:null,
      email:null,
      password:null,
      check_password:null,
      location:null
    }
  },
  methods: {
    checkForm:function(e) {
      if(this.first_name && this.last_name && this.location && this.email && this.plain_password && this.conf_password){return true;} 
      this.errors = [];
      if(!this.first_name){this.errors.push("First name required.");}
      if(!this.last_name){this.errors.push("Last name required.");}
      if(!this.email){this.errors.push("Email required.");}
      if(!this.plain_password){this.errors.push("Password required.");}
      if(!this.conf_password){this.errors.push("Confirm your password");}
      if(!this.location){this.errors.push("Location required.");}
      e.preventDefault();
    },
    registerform:function(e) {
      e.preventDefault();
      this.errors = [];
      let self=this;
      
      let uploadForm = document.getElementById('registerform');
      let form_data = new FormData(uploadForm);
      fetch('/api/users/register', {
        method: 'POST',
        body: form_data,
        headers: {
            'X-CSRFToken': token
          },
          credentials: 'same-origin'
      })
        .then(function (response) {
          if (!response.ok) {
    throw Error(response.statusText);
  }
     return response.json();
        })
        .then(function (jsonResponse) {
          if(jsonResponse.errors) {
            console.log(jsonResponse.errors);
            self.errors.push(jsonResponse.errors);
          }else{

          console.log(jsonResponse.data);
           console.log(jsonResponse.message); 
          self.$router.push('/login');
          };
          
      })
        .catch(function (error) {
          console.log(error);
        });
      }
    }
});


const Login = Vue.component('login',{

  template:`
  <div class="agile_ihj">
      <form id="loginform" @submit.prevent="loginform" method="POST" enctype="multipart/form-data" >
      <h2>Log in to Photogram</h2>
      <p v-if="errors.length">
    <p class="alert alert-danger" role="alert" v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
  </p>
  <p class="alert alert-success" role="alert" v-if="messages.length">
    <ul>
      <li v-for="message in messages">{{ message }}</li>
    </ul>
  </p>
      
       <div class="agileinfo">
          <input type="text" name="username" v-model="username" id="username" placeholder="Username" >
        </div>
       <div class="agileinfo">
          <input type="Password" name="plain_password" v-model="plain_password" id="plain_password" placeholder="Password" >
        </div>
        <div class="agile_par">
          <p>Dont have an Account? <router-link class="nav-link" to="/register">Register Now</router-link></p>
        </div>
        <div class="w3l_but">
          <button type="submit">LOGIN</button>
        </div>
      </form>
      
      <div class="clear"></div>
      </div>
`,
 data:function(){
  return {
    errors:[],
    messages:[],
    username:'',
    plain_password:''
  }
 },
  methods: {
    loginform:function(e) {
      e.preventDefault();
      this.errors = [];
      if(!this.username){this.errors.push("Name required.");}
      if(!this.plain_password){this.errors.push("Password required.");}
      let self=this;
      let loginForm = document.getElementById('loginform');
      let form_data = new FormData(loginForm);
      fetch('/api/auth/login', {
        method: 'POST',
        body: form_data,
        headers: {
            'X-CSRFToken': token
          },
          credentials: 'same-origin'
      })
        .then(function (response) {
          if (!response.ok) {
    throw Error(response.statusText);

  }
     return response.json();
        })
        .then(function (jsonResponse) {
          if(jsonResponse.errors) {
            self.errors.push(jsonResponse.errors);
          }else{
          console.log(jsonResponse.messages);
          let token = jsonResponse.user_credentials[8];
          let username=jsonResponse.user_credentials[3];
          let location=jsonResponse.user_credentials[6];
          let firstname=jsonResponse.user_credentials[4];
          let lastname=jsonResponse.user_credentials[5];
          let joined_on=jsonResponse.user_credentials[7];
          let id=jsonResponse.user_credentials[9];
          let posts=jsonResponse.user_credentials[0];
          let following=jsonResponse.user_credentials[1];
          let followers=jsonResponse.user_credentials[2];
          localStorage.setItem('jwt_token', token);
          localStorage.setItem('username',username);
          localStorage.setItem('location',location);
          localStorage.setItem('firstname',firstname);
          localStorage.setItem('lastname',lastname);
          localStorage.setItem('date_joined',joined_on);
          localStorage.setItem('id',id);
          localStorage.setItem('post',posts);
          localStorage.setItem('following',following);
          localStorage.setItem('followers',followers);
          window.location = "/dashboard";
          }
          
      })
        .catch(function (error) {
          console.log(error);
        });
      }
    }
});

    


/*const Logout = Vue.component('logout',{ 
    
    
    
});*/




const Explore = Vue.component('explore',{
    
    template: `
    <section class="wthree-row py-sm-5 py-3">
      <div class="container py-md-5">
      <h2>Search profile and/or posts</h2>
        <div class="row py-lg-5 pt-md-5 pt-3 d-flex justify-content-center">
         <p class="alert alert-success" role="alert" v-if="messages.length">
    <ul>
      <li v-for="message in messages">{{ message }}</li>
    </ul>
  </p>
        
            <div id="custom-search-input">
                <div class="input-group col-md-12">
                    <input type="text" class="form-control input-lg" placeholder="search.." />
                    <span class="input-group-btn">
                        <button class="btn btn-info btn-lg" type="button">
                            <i class="fas fa-search"></i>
                        </button>
                    </span>
                </div>
           
  </div>
      </div>
      </div>
    </section>
   `,
    data: function() {
       return {
        errors:[],
        messages:[]
       }
    }
    
});


const UserProfile = Vue.component('profile',{
    
    template: `
    <section class="wthree-row py-sm-5 py-3">
      <div class="container py-md-5">
        <div class="justify-content-center">
          <card  v-for="post in posts"
            v-bind:key="post.id"
            v-bind:title="post.title" 
            v-bind:caption="post.caption"
            v-bind:likes="post.likes"
            v-bind:date_post="post.date_post"
            v-bind:photo="post.photo"
            v-bind:username="post.username">
          </card>
        </div>
      </div>
    </section>
   `,
    data: function() {
       return {
         posts: [
      { id: 1, title: 'My journey with Vue',caption:'It is so easy',likes:58,date_post:'Feb 2018',photo:'https://vuejs.org/images/logo.png' ,username:'__me__'},
      { id: 3, title: 'Why Vue is so fun',caption:'You just plug and go',likes:79,date_post:'Mar 2018',photo:'https://react-etc.net/files/2015-11/danguu.jpg' ,username:'__me__'} 
    ]
       }
    }
    
});


const Post = Vue.component('post',{
    
    template: `
    <section class="wthree-row py-sm-5 py-3">
      <div class="container py-md-5">
      <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
    </p>
     <p class="alert alert-success" role="alert" v-if="messages.length">
    <ul>
      <li v-for="message in messages">{{ message }}</li>
    </ul>
  </p>
        <div class="row py-lg-5 pt-md-5 pt-3 d-flex justify-content-center">
        <form id="uploadForm"  @submit.prevent="uploadPost" method="POST" enctype="multipart/form-data">
                <label class="input-group lead" for="photo">Upload photo</label>
                <input ref="fileInput" style="display:none" v-on:change="onSelectedFile" class="form-control" id="file"  type="file" accept="image/*" :name="photo"/>
                <br>
                <a class="btn btn-secondary" @click="$refs.fileInput.click()">Select file</a>
                <br>
                <label class="input-group lead" for="caption">Caption</label>
                <textarea class="form-control" rows="3"  v-model="caption" placeholder="Write a caption..." id="caption" name="caption"></textarea>
                <br><br>
                <button class="btn btn-primary" type="submit">Submit</button>
            </form>
      </div>
      </div>
    </section>
   `,
    data: function() {
       return {
        errors:[],
        messages:[],
        caption:'',
        photo:null
       }
    },methods: {
      onSelectedFile: function(event){
        let self=this;
        self.photo=event.target.files[0]
      },
      
        uploadPost: function () {
            let self = this;
            self.errors = [];
            let form_data = new FormData();

          if(self.photo){form_data.append('photo',self.photo);}
        
        
        form_data.append('caption',self.caption);
            fetch("/api/posts/new", { 
            method: 'POST',
            body: form_data,
            headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt_token'),
                    'X-CSRFToken': token
                },
            credentials: 'same-origin'
            
            })
            .then(function (response) {
              if (!response.ok) {
    throw Error(response.statusText);
  }
                return response.json();
            })
            .then(function (jsonResponse) {
                 if(jsonResponse.errors) {
            self.errors.push(jsonResponse.errors);
          }else{
            if(jsonResponse.messages) {
            self.messages.push(jsonResponse.messages);
          }
            console.log(jsonResponse);
          }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }
});




const NotFound = Vue.component('not-found', {
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data: function () {
        return {}
    }
})


Vue.component('dashboard-header', {
    template: `
    <div id="profile">
    
        <div id="pArea">
            
            <div id="pInfo">
                <img src="{{ url_for('static', filename='images/'+ uid +'.png') }}" id="pimg">
                <p>
                    <h3>{{ name }}</h3>
                    <p><a href="#">@{{ uid }}</a></p>
                    <p>{{ loca }}</p>
                    <p>{{ date}}</p>
                </p>
            </div>
            
            <p class="occupation">{{ email }}</p>
            <div class="center">
                
                <p> {{ bio }}</p>
                <!--- Walt Disney Mascot
                    Mickey loves adventure and trying new things, though his best intentions often leave him in silly situations in different settings. He is optimistic and a friend to everyone.
                --->
            </div>
            
            <div id="pBio">
                <div class="grid">
                      <div class="count"><h4>245</h4></div>
                      <div class="count"><h4>100</h4></div>
                      <div class="count"><h4>13.7m</h4></div>  
                      <div class="item"><p>Posts</p></div>
                      <div class="item"><p>Following</p></div>
                      <div class="item"><p>Followers</p></div>   
                </div>
                
                <div class="">
                    <div class="grid">
                        <div class="item"> </div>
                        <div class="item"> <button id='message'>Message</button> <button id='follow'>Follow</button></div>
                    </div>
                </div>
                
            <div>
        
        </div>
    </div>
    `,
    data:function(){
      return{
        errors:[],
        messages:[],
        user_name:'',
        first_name:'',
        last_name:'',
        location:'',
        photo:'',
        joined_on:'',
        posts:'',
        followers:'',
        following:'',
        bio:''
        
      }
    },
    created: function() {
        let self = this;
        if (localStorage.getItem('photo')){
            self.photo=localStorage.getItem('photo');
        }else{
          self.photo="https://img00.deviantart.net/6093/i/2013/104/8/6/the_legend_of_aang__aang_portrait_by_dejakob-d61o0wy.png"
        };
          self.user_name=localStorage.getItem('username');
          self.location=localStorage.getItem('location');
          self.first_name=localStorage.getItem('firsname');
          self.last_name=localStorage.getItem('lastname');
          self.joined_on=localStorage.getItem('date_joined');
    },
    methods:{
      logout: function(){
        if (localStorage.getItem('jwt_token')!==null){
            let self = this;
            self.token=localStorage.getItem('jwt_token');
            fetch("/api/auth/logout", { 
                method: 'GET',
                headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt_token')
                    },
                credentials: 'same-origin'
                
                })
                .then(function (response) {

              if (!response.ok) {
          throw Error(response.statusText);

               }
              return response.json();
        })
        .then(function (jsonResponse) {
          if(jsonResponse.errors) {
            self.errors.push(jsonResponse.errors);
          }else{
                       localStorage.clear();
                         window.location = "/";
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
        }    
    }
});


Vue.component('dashboard-nav', {
    template: `
    <div class="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
  <div class="btn-group" role="group" aria-label="First group">
  <router-link class="btn btn-secondary" to="/upload">Upload</router-link>
  <router-link class="btn btn-secondary" to="/">Explore(ALL)</router-link>
  <router-link class="btn btn-secondary" to="/profile">My Posts</router-link>
  <router-link class="btn btn-secondary" to="/following">Following</router-link>
  <router-link class="btn btn-secondary" to="/likes">Liked</router-link>
  </div>
  <div class="input-group">
  <router-link class="btn btn-secondary" to="/search">Search</router-link>
  </div>
</div>
    `
});


Vue.component('card', {
    template: `
   
                <div class="col-sm-6 col-md-4 col-lg-3 mt-4">
                <div class="card card-inverse card-info">
                    <a href=""><img class="card-img-top" src="http://2018.cedesc.com.br/assets/uploads/thumb-default.png"></a>
                    <div class="card-block">
                        <figure class="profile profile-inline">
                            <img src="http://success-at-work.com/wp-content/uploads/2015/04/free-stock-photos.gif" class="profile-avatar" alt="">
                        </figure>
                        <h4 class="card-title">@{{username}}</h4>
                        <p><i class="fa fa-tags"></i> Tags: <a href=""><span class="badge badge-info">#waves</span></a> <a href=""><span class="badge badge-info">#CSS</span></a> <a href=""><span class="badge badge-info">#Vue.js</span></a></p>
        
                        <div class="card-text">
                            {{caption}}
                        </div>
                    </div>
                    <div class="card-footer">
                        <small>Posted: {{date_post}}</small>
                        <p v-if="isLiked">
    <button @click="unlike" class="float-right far fa-thumbs-down">{{likes}}</button>
    </p>
     <p v-else>
    <a @click=like" class="float-right far fa-thumbs-up"> {{likes}}</a>
    </p>
    <p v-if="this.username===this.user">
    <button @click="delete_post" class="fas fa-trash-alt float-right"></button>
    </p>
                    </div>
                </div>
            </div>
    `,props:['id','username','likes','date_post','tags','caption',"photo","liked"],
    data:function(){
      return {
        isLiked:this.liked,
        user:localStorage.getItem('username'),
        post_id:this.id
      }
    }
    ,methods:{
      delete_post:function(){
        let self= this;
                var payload = {
                post_id: self.id,
              username:self.username
              };

              var data = new FormData();
            data.append( "json", JSON.stringify( payload ) );
            console.log(payload,data);
                fetch("/api/posts/delete", { 
                    method: 'POST',
                    body:payload,
                    headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('jwt_token'),
                            'X-CSRFToken': token
                        },
                    credentials: 'same-origin'
                    
                    })
                    .then(function (response) {
                     if (!response.ok) {
                throw Error(response.statusText);
                }
                return response.json();
                  })
                .then(function (jsonResponse) {
                 if(jsonResponse.errors) {
            self.errors.push(jsonResponse.errors);
                  }else{
                      console.log(jsonResponse);
                      console.log("Deleted");
                    }
                 })
               .catch(function (error) {
                        console.log(error);
                    });
      },
            like:function(){
                let self= this;
                var payload = {
                post_id: this.id,
              username:this.username
              };

              var data = new FormData();
            data.append( "json", JSON.stringify( payload ) );
            console.log(payload,data);
                fetch("/api/posts/like", { 
                    method: 'POST',
                    body:payload,
                    headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('jwt_token'),
                            'X-CSRFToken': token
                        },
                    credentials: 'same-origin'
                    
                    })
                    .then(function (response) {
                     if (!response.ok) {
                throw Error(response.statusText);
                }
                return response.json();
                  })
                .then(function (jsonResponse) {
                 if(jsonResponse.errors) {
            self.errors.push(jsonResponse.errors);
                  }else{
                      
                     
                      self.likes+=1;
                      console.log("Posts Liked");
                    }
                 })
               .catch(function (error) {
                        console.log(error);
                    });
            },unlike:function(){
                let self= this;
                var payload = {
                post_id: this.id,
              username:this.username
              };

              var data = new FormData();
            data.append( "json", JSON.stringify( payload ) );
            console.log(payload,data);
                fetch("/api/posts/unlike", { 
                    method: 'POST',
                    body:payload,
                    headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('jwt_token'),
                            'X-CSRFToken': token
                        },
                    credentials: 'same-origin'
                    
                    })
                    .then(function (response) {
                        if (!response.ok) {
    throw Error(response.statusText);
  }
                return response.json();
            })
            .then(function (jsonResponse) {
                 if(jsonResponse.errors) {
            self.errors.push(jsonResponse.errors);
          }else{
                self.likes-=1;
                console.log("Unliked");
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
    }
});

const Timeline = Vue.component('timeline',{
  template:`
    <section class="wthree-row py-sm-5 py-3">
      <div class="container py-md-5">
      <div class="row">
        <card  v-for="post in posts"
  v-bind:key="post.id"
  v-bind:title="post.title" 
  v-bind:caption="post.caption"
  v-bind:liked="post.liked"
  v-bind:likes="post.likes"
  v-bind:date_post="post.date_post"
  v-bind:photo="post.photo"
  v-bind:username="post.username"></card>
</div>
        
      </div>
    </section>
`,
 data:function(){
  return {
     posts: []
  }
 },
 created: function () {
            let self = this;
            if(localStorage.getItem('jwt_token')!==null){
                fetch("/api/posts/all", { 
                method: 'GET',
                headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt_token'),
                        'X-CSRFToken': token
                    },
                credentials: 'same-origin'
                
                })
                .then(function (response) {
                if (!response.ok) {
          throw Error(response.statusText);

               };
              return response.json();
        })
        .then(function (jsonResponse) {
          if(jsonResponse.errors) {
            self.errors.push(jsonResponse.errors);
          }else{
                    self.posts=jsonResponse.posts;
                    console.log(self.posts);
                  }
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
        }
                
        
});


// Define Routes
const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: "/", component: Home},
        // Put other routes here
        { path: "/dashboard", component: Timeline},
        { path: "/register", component: Register },
        { path: "/login", component : Login},
        { path: "/logout", component : Login},
        { path: "/explore", component : Explore},
        { path: "/users/<username>", component : UserProfile},
        { path: "/posts/new", component : Post},
        // This is a catch all route in case none of the above matches
        { path: "*", component: NotFound}
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    //delimiters: ['{[',']}'],
    router
});


