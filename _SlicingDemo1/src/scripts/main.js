
'use strict';

import "core-js";
//import "regenerator-runtime/runtime";

import MenuMobile from "./MenuMobile";

window.PRJNAME = {};

function Main(e)
{
    PRJNAME.menumobile = new MenuMobile();

} // Main


function OnLoaded(e)
{
    PRJNAME.menumobile.Init();

} // OnLoaded


function OnResize(e)
{
    //

} // OnResize


window.addEventListener( "DOMContentLoaded", Main );
window.addEventListener( "load",             OnLoaded );
window.addEventListener( "resize",           ()=>{ OnResize(); } );
