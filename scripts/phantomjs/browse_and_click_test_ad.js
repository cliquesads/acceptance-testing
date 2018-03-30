/* jshint node: true */
/* global phantom */
"use strict";

/**
 * PhantomJS script for scraping page & generating clickable
 */
var webPage = require('webpage');
var system = require('system');
var page = webPage.create();

// parse command line args
var URL             = system.args[1], // url to load
    click           = JSON.parse(system.args[2]); // boolean for whether or not to click on ad

/**
 * Called to render page when finally ready.
 */
var doClick = function(){
    var href = page.evaluate(function(click){
        if (click && document.querySelector('a')){
            document.querySelector('a').click();
            return document.querySelector('a').href;
        } else {
            return false;
        }
    }, click);
    if (href){
        console.log("Clicked on link: " + href);
        setTimeout(function(){
            phantom.exit()
        }, 2000);
    } else {
        phantom.exit();
    }
};

phantom.onError = function(msg, trace) {
    var msgStack = ['PHANTOM ERROR: ' + msg];
    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
        });
    }
    console.log(msgStack.join('\n'));
    phantom.exit(1);
};

/**
 * Execute the scrape & render
 */
page.open(URL, function(status) {
    if (status === "success") {
        // set a simple timeout on render step to led most resources load
        setTimeout(doClick, 2000);
    } else {
        phantom.exit();
    }
});