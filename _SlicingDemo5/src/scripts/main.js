
'use strict';

import "core-js";
//import "regenerator-runtime/runtime";

import Header from './Header';

function Main(e)
{
    window.mheader = new Header();

} // Main


function OnLoaded(e)
{
    window.mheader.Init();

} // OnLoaded


function OnResize(e)
{
    //

} // OnResize


window.addEventListener( "DOMContentLoaded", Main );
window.addEventListener( "load",             OnLoaded );
window.addEventListener( "resize",           ()=>{ OnResize(); } );
