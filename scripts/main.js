main = {
    settings : null,
    canvasWindow : null,
    music : null,
    backgroundImage : null,
    counter : 0,

    characters : [],
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

        // characters
        main.player.image = new Image();
        main.player.image.src = "assets/hero.png";
    },

    update : function() {
        if ( main.gamePaused == true ) { return; }
        if ( main.gameOver == true ) { return; }

        main.counter += 5;
        if ( main.counter >= 100 ) { main.counter = 0; }

        main.player.move( main.settings );
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
