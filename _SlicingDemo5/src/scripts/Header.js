
export default class Header
{
    constructor()
    {
        this.options            = {};
        this.options.SEL_MAIN   = '.header__main';
        this.options.CLS_COAT   = 'header__main--background';
        this.options.INT_OFFSET = 300;

        this.OnScrollDel = this._OnScroll.call( this );

    } // constructor

    Init()
    {
        this.cont_main = document.querySelector( this.options.SEL_MAIN );

        window.addEventListener( 'scroll', this.OnScrollDel );

        this._UpdateBack();

    } // Init

    _OnScroll()
    {
        return ()=>
        {
            this._UpdateBack();
        }

    } // _OnScroll

    _UpdateBack()
    {
        if( window.scrollY > this.options.INT_OFFSET )
        {
            this.cont_main.classList.add( this.options.CLS_COAT );
        }
        else
        {
            this.cont_main.classList.remove( this.options.CLS_COAT );
        }

    } // _ToggleBack

} // class Header
