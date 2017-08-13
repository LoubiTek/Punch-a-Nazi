main = {
    settings : null,
    canvasWindow : null,
    music : null,
    backgroundImage : null,
    counter : 0,

    hitSounds : [],
    explodeSound : null,
    jumpSound : null,

    naziList : [],

    nazis : null,
    
    player : {
            x : 640/2-16,
            y : 480-64,
            w : 32,
            h : 32,
            speed : 10,
            xVel : 0,
            yVel : 0,
            score : 0,
            image : null,

            imgWalk1 : null,
            imgWalk2 : null,
            imgPunch : null,
            countdown : 0,

            frame : 0,
            maxFrame : 2,

            move : function( settings ) {
                this.x += ( this.xVel * this.speed );
                this.y += ( this.yVel * this.speed );

                if ( this.x < 0 )
                {
                    this.x = 0;
                }
                else if ( this.x + this.w > settings.w )
                {
                    this.x = settings.w - this.w;
                }
            
                if ( this.y < 480-64 )
                {
                    // fall
                    this.yVel += 0.5;
                    if ( this.yVel > 5 )
                    {
                        this.yVel = 5;
                    }
                }
                else
                {
                    this.y = 480-64;
                    this.yVel = 0;
                }

                if ( this.xVel <= -1 || this.xVel >= 1 )
                {
                    // animate
                    this.frame = this.frame + 0.1;
                    if ( this.frame >= this.maxFrame )
                    {
                        this.frame = 0;
                    }
                }

                if ( this.countdown == 0 )
                {
                    if ( Math.floor( this.frame ) == 0 )
                    {
                        this.image = this.imgWalk1;
                    }
                    else
                    {
                        this.image = this.imgWalk2;
                    }
                }
                else
                {
                    this.countdown -= 1;
                }
            },

            draw : function( window ) {
                window.drawImage( main.player.image, main.player.x, main.player.y );
            },

            punch : function() {
                this.image = this.imgPunch;
                this.score += 10;
                this.countdown = 20;
            },

            jump : function() {
                this.yVel = -3;
            }
        },

    init : function( pSettings, pCanvasWindow ) {
        main.settings = pSettings;
        main.canvasWindow = pCanvasWindow;
        main.gameOver = false;
        main.gamePaused = false;

        window.addEventListener( "mousedown",   main.click, false );
        window.addEventListener( "keydown",     main.keydown, false );
        window.addEventListener( "keyup",       main.keyup, false );

        // assets
        main.backgroundImage = new Image();
        main.backgroundImage.src = "assets/background.png";

        var hit1 = new Audio( "assets/hit1.wav" );
        var hit2 = new Audio( "assets/hit2.wav" );
        var hit3 = new Audio( "assets/hit3.wav" );
        main.hitSounds.push( hit1 );
        main.hitSounds.push( hit2 );
        main.hitSounds.push( hit3 );

        main.explodeSound = new Audio( "assets/explode.wav" );
        main.jumpSound = new Audio( "assets/jump.wav" );

        // player
        //main.player.image = new Image();
        main.player.imgWalk1 = new Image();
        main.player.imgWalk2 = new Image();
        main.player.imgPunch = new Image();
        
        //main.player.image.src = "assets/hero.png";
        main.player.imgWalk1.src = "assets/hero_idle.png";
        main.player.imgWalk2.src = "assets/hero_walk.png";
        main.player.imgPunch.src = "assets/hero_punch.png";

        // nazi list
        main.nazis = new Array();
        main.naziList = findNazis();
        for ( i = 0; i < main.naziList.length; i++ )
        {
            var nazi = {
                name : main.naziList[i],
                x : Math.random() * (640-32),
                y : 300,
                w : 32,
                h : 32,
                hp : 100,
                
                image : null,
                imgIdle : null,
                imgHit : null,
                imgDed : null,
                
                xVel : 1,
                yVel : 0,
                active : false,
                gravity : 2,
                speed : 2,
                punchWeight : 10,
                deaccY : 0.1,
                deaccX : 0.5,
                ded : false,
                countdown : 0,

                update : function()
                {
                    if ( this.ded )
                    {
                        this.image = this.imgDed;
                    }
                    else if ( this.countdown <= 0 )
                    {
                        this.image = this.imgIdle;
                    }
                    else
                    {
                        this.countdown -= 1;
                    }
                    
                    // Hit the ground
                    if ( this.y < 480-64 )
                    {
                        // fall
                        this.yVel += 0.5;
                        if ( this.yVel > 5 )
                        {
                            this.yVel = 5;
                        }
                    }
                    else
                    {
                        this.y = 480-64;
                        this.yVel = 0;
                    }

                    // Don't go off screen
                    if ( this.x < 0 )
                    {
                        this.x = 0;
                        this.xVel = 0;
                    }
                    else if ( this.x + this.w > 640 )
                    {
                        this.x = 640 - 32;
                        this.xVel = 0;
                    }

                    // Move according to velocity
                    this.y += ( this.yVel * this.gravity );
                    this.x += ( this.xVel * this.speed );

                    // Deaccelerate
                    if ( this.xVel < 0 ) {
                        this.xVel += this.deaccX;
                    }
                    else if ( this.xVel > 0 ) {
                        this.xVel -= this.deaccX;
                    }
                    if ( this.yVel < 0 ) {
                        this.yVel += this.deaccY;
                    }
                    else if ( this.yVel > 0 ) {
                        this.yVel -= this.deaccY;
                    }
                },

                getPunched : function( fromX, fromY )
                {
                    this.image = nazi.imgHit;
                    this.countdown = 30;

                    var xVal = Math.floor( Math.random() * 3 ) - 1; // -1, 0, 1
                    console.log( "Random:", xVal );
                                       
                    this.yVel -= this.punchWeight;
                    if ( fromX -+ 16 < this.x )
                    {
                        this.xVel += -xVal * this.punchWeight;
                    }
                    else if ( fromX + 16 > this.x )
                    {
                        this.xVel += xVal * this.punchWeight;
                    }
                    
                    this.y += ( this.yVel * this.gravity ); 
                    
                    console.log( "xVel:", this.xVel, "yVel:", this.yVel );

                    this.hp -= Math.floor( Math.random() * 20 ) + 10;
                    if ( this.hp <= 0 )
                    {
                        this.ded = true;
                    }

                    return this.ded;
                }
            }

            //nazi.image = new Image();
            //nazi.image.src = "assets/nazi.png";

            nazi.imgIdle = new Image();
            nazi.imgHit = new Image();
            nazi.imgDed = new Image();

            nazi.imgIdle.src = "assets/nazi.png";
            nazi.imgHit.src = "assets/nazi_hit.png";
            nazi.imgDed.src = "assets/nazi_ded.png";

            nazi.image = nazi.imgIdle;

            if ( i == 0 )
            {
                nazi.active = true;
            }

            console.log( nazi );
            main.nazis.push( nazi );
        }
    },

    update : function() {
        if ( main.gamePaused == true ) { return; }
        if ( main.gameOver == true ) { return; }

        main.counter += 5;
        if ( main.counter >= 100 ) { main.counter = 0; }

        // update player
        main.player.move( main.settings );

        // update nazi
        for ( i = 0; i < main.nazis.length; i++ )
        {
            if ( main.nazis[i].active == true )
            {
                main.nazis[i].update();
            }
        }
    },

    draw : function() {
        if ( main.canvasWindow == null ) { return; }

        // Draw background
        main.canvasWindow.drawImage( main.backgroundImage, 0, 0 );

        if ( main.gameOver == false )
        {
            // gameplay

            if ( main.counter % 100 < 50 )
            {
                main.canvasWindow.fillStyle = "#ffffff";
                main.canvasWindow.font = "20px monospace";
                main.canvasWindow.fillText( "SUPER PUNCH-A-NAZI", 200, 25 );
            }

            // Draw player
            main.player.draw( main.canvasWindow );

            // Draw score
            main.canvasWindow.fillStyle = "#ffffff";
            main.canvasWindow.font = "20px monospace";
            main.canvasWindow.fillText( "Score: " + main.player.score, 10, 25 );

            // Draw nazi
            for ( i = 0; i < main.nazis.length; i++ )
            {
                if ( main.nazis[i].active == true )
                {
                    // image
                    if ( main.nazis[i].isded )
                    {
                        main.canvasWindow.drawImage( main.nazis[i].image, main.nazis[i].x, main.nazis[i].y );
                    }
                    else
                    {
                        main.canvasWindow.drawImage( main.nazis[i].image, main.nazis[i].x, main.nazis[i].y );
                    }
                    // name
                    main.canvasWindow.fillStyle = "#ff0000";
                    main.canvasWindow.font = "12px monospace";
                    var letterCount = main.nazis[i].name.length * 5;
                    main.canvasWindow.fillText( main.nazis[i].name, main.nazis[i].x - letterCount/2, main.nazis[i].y - 5 );
                }
            }
        }
        else
        {
            // game over
        }

        if ( main.gamePaused )
        {
            main.canvasWindow.fillStyle = "#ffffff";
            main.canvasWindow.font = "20px monospace";
            main.canvasWindow.fillText( "PRESS SPACE TO UNPAUSE", 200, 200 );
        }

    },

    distance : function( objA, objB )
    {
        var delX = objA.x - objB.x;
        var delY = objA.y - objB.y;
        return Math.sqrt( delX * delX + delY * delY );
    },

    isCollision : function( objA, objB )
    {
        return ( main.distance( objA, objB ) < 15 );
    },

    // Events
    click : function( event ) {
    },

    keydown : function( event ) {
        if ( event.key == "a" )
        {
            main.player.xVel = -1;
        }
        else if ( event.key == "d" )
        {
            main.player.xVel = 1;
        }
        else if ( event.key == "k" )
        {
            main.player.jump();
            main.jumpSound.play();
        }
        else if ( event.key == "j" )
        {
            // punch
            for ( i = 0; i < main.nazis.length; i++ )
            {
                if ( main.nazis[i].active == true )
                {
                    if ( main.isCollision( main.player, main.nazis[i] ) )
                    {
                        // punched!
                        var isded = main.nazis[i].getPunched( main.player.x, main.player.y );
                        main.player.punch();

                        var rand = Math.floor( Math.random() * 3 );
                        main.hitSounds[ rand ].play();

                        if ( isded )
                        {
                            // activate next nazi
                            if ( i + 1 < main.nazis.length )
                            {
                                main.nazis[i+1].active = true;
                            }
                            main.explodeSound.play();
                        }
                    }
                }
            }            
        }
        else if ( event.key == " " )
        {
          main.gamePaused=!main.gamePaused;
          if(main.gamePaused == true)
          {
            //main.music.pause();
          }else{
            //main.music.play();
          }
        }
    },

    keyup : function( event ) {
        if ( event.key == "a" || event.key == "d" )
        {
            main.player.xVel = 0;
        }
    }
};
