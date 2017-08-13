main = {
    settings : null,
    canvasWindow : null,
    music : null,
    backgroundImage : null,
    counter : 0,

    naziList : [],

    nazis : null,
    
    player : {
            x : 640/2-16,
            y : 480-64,
            w : 32,
            h : 32,
            speed : 10,
            xVel : 0,
            score : 0,
            image : null,

            move : function( settings ) {
                this.x += ( this.xVel * this.speed );

                if ( this.x < 0 )
                {
                    this.x = 0;
                }
                else if ( this.x + this.w > settings.w )
                {
                    this.x = settings.w - this.w;
                }
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

        // player
        main.player.image = new Image();
        main.player.image.src = "assets/hero.png";

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
                xVel : 0,
                yVel : 0,
                active : false,
                gravity : 1,
                speed : 10,
                punchWeight : 10,

                update : function()
                {
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

                    
                    if ( this.x < 0 )
                    {
                        this.x = 0;
                        this.xVel = 0;
                    }
                    else if ( this.x + this.w > 480 )
                    {
                        this.x = 480 - 32;
                        this.xVel = 0;
                    }

                    this.y += ( this.yVel * this.gravity );

                    this.x += ( this.xVel * this.speed );
                },

                getPunched : function( fromX, fromY )
                {
                    console.log( "Punch", this, fromX, fromY );
                    if ( fromX < this.x )
                    {
                        this.xVel += this.punchWeight;
                    }
                    else
                    {
                        this.xVal -= this.punchWeight;
                    }

                    if ( fromY < this.y )
                    {
                        this.yVel += this.punchWeight;
                    }
                    else
                    {
                        this.yVel -= this.punchWeight;
                    }
                }
            }

            nazi.image = new Image();
            nazi.image.src = "assets/nazi.png";

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
            main.canvasWindow.drawImage( main.player.image, main.player.x, main.player.y );

            // Draw score
            main.canvasWindow.fillText( "Score: " + main.player.score, 10, 25 );

            // Draw nazi
            for ( i = 0; i < main.nazis.length; i++ )
            {
                if ( main.nazis[i].active == true )
                {
                    main.canvasWindow.drawImage( main.nazis[i].image, main.nazis[i].x, main.nazis[i].y );
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
                        main.nazis[i].getPunched( main.player.x, main.player.y );
                    }
                }
            }            
        }
        else if ( event.key == " " )
        {
          main.gamePaused=!main.gamePaused;
          if(main.gamePaused == true)
          {
            main.music.pause();
          }else{
            main.music.play();
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
