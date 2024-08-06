
export default class MenuMobile
{
    constructor()
    {
        this.options =
        {
            SEL_BTN:    '.header__nav-mobile',
            SEL_PAGE:   '.page',
            CLS_OPENED: 'page--menu-mobile-opened',
            MAX_WIDTH:  1024
        };

        this.btn           = null;
        this.page          = null;
        this.OnBtnDel      = this.OnBtn     .call(this, this);
        this.OnTransEndDel = this.OnTransEnd.call(this, this);
        this.OnResizeDel   = this.OnResize  .call(this, this);

    } // constructor

    Init()
    {
        this.btn  = document.querySelector( this.options.SEL_BTN );
        this.page = document.querySelector( this.options.SEL_PAGE );

        if( !this.btn || !this.page ) return;

        this.btn .addEventListener( 'click',         this.OnBtnDel );
        this.page.addEventListener( 'transitionend', this.OnTransEndDel );
        window   .addEventListener( 'resize',        this.OnResizeDel );

    } // Init

    OnBtn( _self )
    {
        return function(e)
        {
            _self.page.style['transition-duration'] = '0.5s';
            _self.page.classList.toggle( _self.options.CLS_OPENED );
        }

    } // OnBtn

    OnTransEnd( _self )
    {
        return function(e)
        {
            _self.page.style['transition-duration'] = '0s';
        }

    } // OnTransEnd

    OnResize( _self )
    {
        let timeout = null;
        return function(e)
        {
            clearTimeout(timeout);
            timeout = setTimeout(()=>{

                if( window.innerWidth >= _self.options.MAX_WIDTH )
                {
                    if( _self.page.classList.contains( _self.options.CLS_OPENED ) )
                    {
                        _self.page.style['transition-duration'] = '0s';
                        _self.page.classList.remove( _self.options.CLS_OPENED );
                    }
                }

            }, 25 );
        }

    } // OnResize

} // class MenuMobile
