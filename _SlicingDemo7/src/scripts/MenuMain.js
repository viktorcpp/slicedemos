export default class MenuMain
{
    constructor()
    {
        this.options            = {};
        this.options.SEL_BTN    = '.mobile-navbar-btn';
        this.options.SEL_CONT   = '.page';
        this.options.CLS_OPENED = 'mobile-opened';
        this.options.INT_MAXW   = 1024;
        this.options.F_ANI_DUR  = 0.25;

    } // constructor

    Init( options = null )
    {
        let loop         = Object.create(null);
            loop.options = Object.assign( this.options, options || this.options );
            loop.btn     = document.querySelector( loop.options.SEL_BTN );
            loop.cont    = document.querySelector( loop.options.SEL_CONT );

            loop.btn.OnBtnDel = this._OnBtn.call( this, loop );
            loop.btn.addEventListener( 'click', loop.btn.OnBtnDel );

            loop.cont.OnTransEndDel = this._OnTransEnd.call( this, loop );
            loop.cont.addEventListener( 'transitionend', loop.cont.OnTransEndDel );

            window.OnResizeDel = this._OnResize.call( this, loop );
            window.addEventListener( 'resize', window.OnResizeDel );

    } // Init

    _OnBtn( loop )
    {
        return (e)=>
        {
            loop.cont.style['transition-duration'] = `${this.options.F_ANI_DUR}s`;
            loop.cont.classList.toggle( loop.options.CLS_OPENED );
        }

    } // _OnBtn

    _OnTransEnd( loop )
    {
        return (e)=>
        {
            loop.cont.style['transition-duration'] = '0s';
        }

    } // _OnTransEnd

    _OnResize( loop )
    {
        let timeout = null;

        return (e)=>
        {
            clearTimeout( timeout );
            timeout = setTimeout( ()=>{

                if( window.innerWidth > loop.options.INT_MAXW )
                {
                    loop.cont.style['transition-duration'] = '0s';
                    loop.cont.classList.remove( loop.options.CLS_OPENED );
                }

            }, 50 );
        }

    } // _OnResize

} // class MenuMain
