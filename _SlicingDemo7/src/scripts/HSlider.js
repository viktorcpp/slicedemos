export default class HSlider
{
    constructor()
    {
        this.options              = Object.create(null);
        this.options.SEL_MAIN     = '.hslider';
        this.options.SEL_VIEWPORT = '.hslider__viewport';
        this.options.SEL_ITEM     = '.hslider__item';
        this.options.SEL_BTN_PREV = '.hslider__prev';
        this.options.SEL_BTN_NEXT = '.hslider__next';
        this.options.SEL_NAVBAR   = '.hslider__navbar';
        this.options.CLS_BTN_DIS  = 'hslider__directions_disabled';
        this.options.CLS_ACTIVE   = 'active';

    } // constructor

    Init( options = null )
    {
        let _options = Object.assign( this.options, options || this.options );
        let _sliders = Array.from( document.querySelectorAll( _options.SEL_MAIN ) );

        _sliders.forEach( (_el)=>{

            let loop              = Object.create(null);
                loop.options      = _options;
                loop.slider       = _el;
                loop.viewport     = loop.slider.querySelector( _options.SEL_VIEWPORT );
                loop.viewport_el  = loop.viewport.querySelector( 'ul' );
                loop.items        = Array.from( loop.slider.querySelectorAll( _options.SEL_ITEM ) );
                loop.btn_prev     = loop.slider.querySelector( _options.SEL_BTN_PREV );
                loop.btn_next     = loop.slider.querySelector( _options.SEL_BTN_NEXT );
                loop.navbar       = loop.slider.querySelector( _options.SEL_NAVBAR );
                loop.navbar_items = Array.from( loop.navbar.querySelectorAll( 'li' ) );

            loop.slider.loop                      = loop;
            loop.current_index                    = 0;
            loop.viewport_el.style['margin-left'] = '0';
            loop.is_animated                      = false;

            loop.btn_prev.OnBtnPrevDel = this._OnBtnPrev.call( this, loop );
            loop.btn_prev.addEventListener( 'click', loop.btn_prev.OnBtnPrevDel );

            loop.btn_next.OnBtnNextDel = this._OnBtnNext.call( this, loop );
            loop.btn_next.addEventListener( 'click', loop.btn_next.OnBtnNextDel );

            loop.viewport_el.OnSlideTransitionEndDel = this._OnSlideTransitionEnd.call( this, loop );
            loop.viewport_el.addEventListener( 'transitionend', loop.viewport_el.OnSlideTransitionEndDel );

            window.OnResizeDel = this._OnResize.call( this, loop );
            window.addEventListener( 'resize', window.OnResizeDel );

            this.GeneNavbar( loop );
            this.UpdateNavbar( loop );
            this.UpdateDirControls( loop );

        } );

    } // Init

    _OnBtnNavbar( loop )
    {
        return (e)=>
        {
            if( e.currentTarget.classList.contains( loop.options.CLS_ACTIVE ) )
            {
                return;
            }

            let _index = parseInt( e.currentTarget.attributes['index'].value );

            let _margin  = -loop.viewport.offsetWidth * _index;

            loop.viewport_el.style['margin-left'] = `${_margin}px`;

            loop.current_index = _index;

            loop.is_animated = true;
        }

    } // _OnBtnNavbar

    _OnBtnNext( loop )
    {
        return (e)=>
        {
            if( e.currentTarget.classList.contains( loop.options.CLS_BTN_DIS ) || loop.is_animated )
            {
                return;
            }

            let _margin  = parseInt( loop.viewport_el.style['margin-left'] );
                _margin -= loop.viewport.offsetWidth;

            loop.viewport_el.style['margin-left'] = `${_margin}px`;

            loop.current_index++;

            loop.is_animated = true;
        }

    } // _OnBtnNext

    _OnBtnPrev( loop )
    {
        return (e)=>
        {
            if( e.currentTarget.classList.contains( loop.options.CLS_BTN_DIS ) || loop.is_animated )
            {
                return;
            }

            let _margin  = parseInt( loop.viewport_el.style['margin-left'] );
                _margin += loop.viewport.offsetWidth;

            loop.viewport_el.style['margin-left'] = `${_margin}px`;

            loop.current_index--;

            loop.is_animated = true;
        }

    } // _OnBtnPrev

    _OnSlideTransitionEnd( loop )
    {
        return (e)=>
        {
            this.UpdateNavbar( loop );
            this.UpdateDirControls( loop );

            loop.is_animated = false;
        }

    } // _OnSlideTransitionEnd

    GeneNavbar( loop )
    {
        let _html = '';

        for( let x = 0; x < loop.items.length; x++ )
        {
            _html += `<li index="${x}"></li>`;
        }

        loop.navbar.insertAdjacentHTML( 'afterbegin', _html );
        loop.navbar_items = Array.from( loop.navbar.querySelectorAll( 'li' ) );

        loop.navbar_items.forEach((_el)=>{
            _el.OnBtnNavbarDel = this._OnBtnNavbar.call( this, loop );
            _el.addEventListener( 'click', _el.OnBtnNavbarDel );
        });

    } // GeneNavbar

    _OnResize( loop )
    {
        var timeout = null;

        return (e)=>
        {
            clearTimeout( timeout );

            timeout = setTimeout(()=>{

                if( loop.current_index == 0 )
                {
                    loop.viewport_el.style['margin-left'] = '0';
                }
                else
                {
                    loop.viewport_el.style['margin-left'] = `-${loop.current_index * loop.viewport.offsetWidth}px`;
                }

            }, 60);
        }

    } // _OnResize

    UpdateDirControls( loop )
    {
        if( loop.items.length == 1 )
        {
            loop.btn_prev.classList.add( loop.options.CLS_BTN_DIS );
            loop.btn_next.classList.add( loop.options.CLS_BTN_DIS );

            return;
        }

        let _MARGIN_MAX = 0;
        let _MARGIN_MIN = -(loop.items.length * loop.viewport.offsetWidth - loop.viewport.offsetWidth);

        let _current_margin = parseInt( loop.viewport_el.style['margin-left'] );

        if( _current_margin >= _MARGIN_MAX )
        {
            loop.btn_prev.classList.add( loop.options.CLS_BTN_DIS );
            loop.btn_next.classList.remove( loop.options.CLS_BTN_DIS );
        }

        if( _current_margin <= _MARGIN_MIN )
        {
            loop.btn_next.classList.add( loop.options.CLS_BTN_DIS );
            loop.btn_prev.classList.remove( loop.options.CLS_BTN_DIS );
        }

        if( loop.current_index > 0 && loop.current_index < loop.items.length-1 )
        {
            loop.btn_next.classList.remove( loop.options.CLS_BTN_DIS );
            loop.btn_prev.classList.remove( loop.options.CLS_BTN_DIS );
        }

    } // UpdateDirControls

    UpdateNavbar( loop )
    {
        loop.navbar_items.forEach((_el)=>{
            _el.classList.remove( loop.options.CLS_ACTIVE );
        });

        loop.navbar_items[loop.current_index].classList.add( loop.options.CLS_ACTIVE );

    } // UpdateNavbar

} // class HSlider
