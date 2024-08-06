
'use strict';

import "core-js";
//import "regenerator-runtime/runtime";
import MHeader  from './MHeader';
import MenuMain from './MenuMain';
import HSlider  from './HSlider';

function Main(e)
{
    window.mheader  = new MHeader();
    window.menumain = new MenuMain();
    window.hslider = new HSlider();

} // Main


function OnLoaded(e)
{
    window.mheader .Init();
    window.menumain.Init();
    window.hslider .Init();

} // OnLoaded


function OnResize(e)
{
    //

} // OnResize


window.addEventListener( "DOMContentLoaded", Main );
window.addEventListener( "load",             OnLoaded );
window.addEventListener( "resize",           ()=>{ OnResize(); } );
