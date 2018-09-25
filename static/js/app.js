/* 
Copyright 2018 - University of Liverpool

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

var world_width = 5000;
var world_height = 5000;

// Aliases
let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;  
    Graphics = PIXI.Graphics;
    Point = PIXI.Point;  
    Viewport = PIXI.extras.Viewport;
    

// global variables for interface
var menu_displayed = false;         // true if a context menu is currently dsplayed
var menu_selected;                  // circle object that has been clicked
var menu = {};                      // { id: {
                                    //      txt: PIXI.Text,
                                    //      bg: PIXI.Graphics,
                                    //      sprite: PIXI.Sprite,
                                    //      width: int,
                                    //      height: int
                                    //   } 
                                    // }
var app;
var renderer;
var map;
var viewport;

// Main scale for the map
var scale_org_x, scale_org_y,
    cur_scale;
var height, width, c;
var zoom;
var drag;
var but_size;
var db,
    buttons;
    

function init_db() {
    // Get the data from the json file where the database is stored (served by
    // nodejs)
    let db_url = 'http://localhost:8081/db';
    let req = new XMLHttpRequest();
    req.open('GET', db_url, false);
    req.send(null);
    
    if (req.status === 200) {
        return JSON.parse(req.response);
    } else {
        console.log("Problem loading db");
        return [];
    }
}


function zoom_to(x, y, scale) {    
    console.log("zoom to :(" + x + ", " + y +  ")");
    // position of the center of the window in the map sprite coords    
   /* let p_center = map.worldTransform.applyInverse(c);*/
    //viewport.snap(x, y);
    viewport.scale.x = scale;
    viewport.scale.y = scale;
    viewport.moveCenter(x, y);
   // viewport.zoom(200);
}

function zoom_out(x, y) {
    console.log("zoom out :(" + x + ", " + y +  ")");
   //viewport.fitHeight(center=true);
   viewport.fitHeight();
   viewport.moveCenter(x, y);
}
    

function viewport(width, height) {
    let type = "WebGL";
    if(!PIXI.utils.isWebGLSupported()){
      type = "canvas"
    }
    PIXI.utils.sayHello(type);

    viewport = app.stage.addChild(new Viewport({
        interaction: app.renderer.plugins.interaction
    }));
    viewport
        .drag({ clampWheel: true })
        .wheel({ smooth: 3 })
        .pinch()
        .decelerate()
        //.bounce()
        .on('clicked', on_click_map);
    resize();
}


function animate() {
    app.renderer.render(viewport);
    requestAnimationFrame(animate);
}


function load_progress_handler(loader, resource) {
    console.log("loading: " + resource.url); 
    console.log("progress: " + loader.progress + "%"); 
}



function hide_menu() {
    menu[menu_selected].txt.visible = false;
    menu[menu_selected].bg.visible = false;
    menu[menu_selected].sprite.visible = false;
    menu_displayed = false;
    menu_selected = null;
}

function show_menu(num) {
    menu[num].txt.visible = true;
    menu[num].bg.visible = true;
    menu[num].sprite.visible = true;
    menu_displayed = true;
    menu_selected = num;
}



function on_click_button(event) {
    if (this.num == menu_selected) {
        // Close menu of the same button
        hide_menu();
        zoom_out(this.x, this.y);
    } else {
        if (menu_displayed) {
            hide_menu();
        }
        show_menu(this.num);
        zoom_to(this.x, this.y, height / menu[this.num].height);
    }

}


function on_click_map(event) {
    //alert("Map position (" + Math.floor(event.world.x) + ", " + Math.floor(event.world.y) + ")");
}


function on_mouse_over_button(event) {
    this.alpha = 1;
}


function on_mouse_out_button(event) {
    this.alpha = 0.2;
}




function on_images_loaded() {
    // this function will run when the images have loaded
    console.log("All files loaded");

    // Create the map sprite
    map = new Sprite(resources["img/map.jpg"].texture);
    
    world_width = map.width;
    world_height = map.height;
    
    scale_org_x = width / map.width;
    scale_org_y = height / map.height;
    cur_scale = scale_org_y;
    
    viewport.addChild(map); 
    
        
    let but;
    for (var i = 0; i < buttons.length; i++) {
        but = buttons[i];
        
        let circle_out = new Graphics();
        //circle_out.beginFill(0xFFFFFF);
        circle_out.lineStyle(2, 0xFFFFFF);
        circle_out.drawCircle(0, 0, but_size + 3);
        circle_out.endFill();
        circle_out.x = but.x;
        circle_out.y = but.y;
        circle_out.alpha = 1;
        viewport.addChild(circle_out);
          
        let circle = new Graphics();
        circle.beginFill(0xCCCCCC);
        circle.drawCircle(0, 0, but_size);
        circle.endFill();
        circle.x = but.x;
        circle.y = but.y;
        circle.num = i;
        circle.alpha = 0.2;
        viewport.addChild(circle);
        circle.interactive = true;
        // setup events
        
        circle
          .on('pointerdown', on_click_button)
          .on('mouseover', on_mouse_over_button)
          .on('mouseout', on_mouse_out_button)
          
        message = new PIXI.Text(
            but.txt, 
            { fontFamily: 'Calibri', 
              fontSize: '16px',
              fill: 0x000033, 
              align: 'left', 
              wordWrap: true, 
              wordWrapWidth: 350
            }
        );
        var padding = {x: 10, y: 5};
        var radius = 10;
        message.x = but.x + but_size + 3 + 2 * padding.x;
        message.y = but.y - padding.y / 2 - padding.y - message.height;
        
        msg_bg = new PIXI.Graphics();
        msg_bg.beginFill(0xFFFFFF, 1);
        msg_bg.drawRoundedRect(
            message.x - padding.x, 
            message.y - padding.y,
            message.width + 2 * padding.x, 
            message.height + 2 * padding.y, 
            radius
        );
        msg_bg.endFill();
        
        let sprite = new Sprite(resources["db_img/" + but.img].texture);
        
        sprite.position.x = but.x + but_size + 3 + padding.x;;
        sprite.position.y = but.y + padding.y / 2;
                
        viewport.addChild(msg_bg);
        viewport.addChild(message);
        viewport.addChild(sprite);
        msg_bg.visible = false;
        message.visible = false;
        sprite.visible = false;
        
        menu[i] = {
            "txt" : message,
            "bg" : msg_bg,
            "sprite" : sprite,
            "width" : Math.max(msg_bg.width, sprite.width) + padding.x + 2 * (but_size + 3),
            "height" : msg_bg.height + padding.y + sprite.height
        }
     
    }
    resize();
    zoom_out(world_width / 2, world_height / 2);
}

function load_images() {
    // load images and run the setup function when it's done
    loader.add("img/map.jpg")

    var but;
    var loaded = [];
    for (var i = 0; i < buttons.length; i++) {
        but = buttons[i];
        console.log(i + " " + but.img);
        if (!loaded.includes(but.img)) {
            loader.add("db_img/" + but.img);
            loaded.push(but.img);
        }
    }

    loader.on("progress", load_progress_handler)
    loader.load(on_images_loaded);
}


function resize() {
    app.renderer.resize(window.innerWidth, window.innerHeight)
    viewport.resize(window.innerWidth, window.innerHeight, world_width, world_height)
}


function draw_interface() {
    animate();
    load_images();
}


window.onload = function() {
    but_size = 10,
    width = window.innerWidth,
    height = window.innerHeight;
    c = {x:width/2, y:height/2};
    
    
    db = init_db();
    buttons = db["buttons"];

    app = new Application({transparent: true,
                           width: width,
                           height: height,
                           resolution: window.devicePixelRatio});
    document.body.appendChild(app.view);
    app.view.style.position = 'fixed';
    app.view.style.width = '100vw';
    app.view.style.height = '100vh';
    
    viewport();
    
    window.addEventListener('resize', resize)

    draw_interface();
}


