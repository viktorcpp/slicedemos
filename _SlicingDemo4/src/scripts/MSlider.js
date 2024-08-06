
export default class MSlider
{
    constructor()
    {
        // default options
        this.params =
        {
            SEL_MAIN:         ".mslider",
            SEL_VIEWPORT:     ".mslider__viewport",
            SEL_MAIN_SLIDE:   "ul",
            SEL_ITEM:         "li",
            SEL_BTN_PREV:     ".mslider__controls-prev",
            SEL_BTN_NEXT:     ".mslider__controls-next",
            CLS_BTN_DISABLED: "disabled",

            FLOAT_SLIDE_SPEED: "0.25s"
        };

        this.sliders = [];

        this.OnBtnDirPrev = this._OnBtnDir.call( this, 1 );
        this.OnBtnDirNext = this._OnBtnDir.call( this, -1 );
        this.OnResizeDel  = this.OnResize(this);

    } // constructor

    Init( params = null )
    {
        if( params != null )
        {
            this.OverrideParams( this.params, params );
        }

        this.sliders = Array.from( document.querySelectorAll( this.params.SEL_MAIN ) );

        this.sliders.forEach((_el)=>{

            let _loop          = Object.create(null);
                _loop.main     = _el;
                _loop.viewport = _loop.main.querySelector( this.params.SEL_VIEWPORT );
                _loop.slide    = _loop.viewport.querySelector( this.params.SEL_MAIN_SLIDE );
                _loop.btn_prev = _loop.main.querySelector( this.params.SEL_BTN_PREV );
                _loop.btn_next = _loop.main.querySelector( this.params.SEL_BTN_NEXT );
                _loop.items    = Array.from( _loop.slide.querySelectorAll( this.params.SEL_ITEM ) );

                _loop.slide.style["margin"] = '0';

                _loop.main    .mslider_loop = _loop;
                _loop.viewport.mslider_loop = _loop;
                _loop.slide   .mslider_loop = _loop;
                _loop.btn_prev.mslider_loop = _loop;
                _loop.btn_next.mslider_loop = _loop;

                _loop.items.forEach((_item)=>{ _item.mslider_loop = _loop; });

                this.UpdateDirButtons( _loop );

                _loop.btn_prev.addEventListener( 'click', this.OnBtnDirPrev );
                _loop.btn_next.addEventListener( 'click', this.OnBtnDirNext );

        });

        window.addEventListener( "resize", this.OnResizeDel );

    } // Init

    OnResize()
    {
        let timeout = null;
        return (e)=>
        {
            clearTimeout(timeout);
            timeout = setTimeout( ()=>{

                this.sliders.forEach((_el)=>{
                    _el.mslider_loop.slide.style["margin-left"] = '0';
                    this.UpdateDirButtons( _el.mslider_loop );
                });

            }, 50 );

        }

    } // OnResize

    UpdateDirButtons( loop )
    {
        let margin_current = parseInt( loop.slide.style["margin-left"] );
        let margin_max     = ( -loop.items.length * loop.items[0].offsetWidth ) + loop.viewport.offsetWidth;

        loop.btn_prev.classList.remove( this.params.CLS_BTN_DISABLED );
        loop.btn_next.classList.remove( this.params.CLS_BTN_DISABLED );

        if( margin_current == 0 )
        {
            loop.btn_prev.classList.add( this.params.CLS_BTN_DISABLED );
            loop.btn_next.classList.remove( this.params.CLS_BTN_DISABLED );
        }

        if( margin_current == margin_max )
        {
            loop.btn_prev.classList.remove( this.params.CLS_BTN_DISABLED );
            loop.btn_next.classList.add( this.params.CLS_BTN_DISABLED );
        }

    } // UpdateDirButtons

    _OnBtnDir( dir = -1 )
    {
        return (e)=>
        {
            if( e.currentTarget.classList.contains( this.params.CLS_BTN_DISABLED ) )
            {
                return false;
            }

            let mslider_loop   = e.currentTarget.mslider_loop;
            let margin_left    = parseInt( mslider_loop.slide.style["margin-left"] );
            let viewport_width = mslider_loop.viewport.offsetWidth;
            let item_width     = mslider_loop.items[0].offsetWidth;
            let margin_max     = ( -mslider_loop.items.length * item_width ) + viewport_width;console.log(margin_max);

            margin_left += item_width * dir;

            margin_left = Math.min( margin_left, 0 );
            margin_left = Math.max( margin_left, margin_max );

            mslider_loop.slide.style["margin-left"] = `${margin_left}px`;

            this.UpdateDirButtons( mslider_loop );

            //console.log( this );
            //console.log( dir );
            //console.log( e.currentTarget );

            return false;

        }

    } // _OnBtnDir

    OverrideParams( dest, src )
    {
        for( let field in src )
        {
            dest[field] = src[field];
        }

    } // OverrideParams

} // class MSlider
