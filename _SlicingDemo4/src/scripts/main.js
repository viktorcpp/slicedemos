
'use strict';

import "core-js";
//import "regenerator-runtime/runtime";

import MSlider from "./MSlider";

function Main(e)
{
    {
        window.mslider = new MSlider();
    }

} // Main


function OnLoaded(e)
{
    {
        let mslider_params =
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

        window.mslider.Init( mslider_params );
    }

} // OnLoaded


function OnResize(e)
{
    //

} // OnResize


window.addEventListener( "DOMContentLoaded", Main );
window.addEventListener( "load",             OnLoaded );
window.addEventListener( "resize",           ()=>{ OnResize(); } );
