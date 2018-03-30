/* jshint node: true */
/* global phantom */
"use strict";

const phantomjs = require('phantomjs-prebuilt');
const path = require('path');

/**
 * Get PhantomJs Page Preview image data
 */
const crawl = function(imps, ctr, delay){
    const script = path.resolve(__dirname + '/scripts/phantomjs/browse_and_click_test_ad.js');
    const url = 'http://staging-pub.cliquesads.com/test_ad';
    let i = 0;
    function loopWithDelay() {
        setTimeout(function () {
            console.log(`Browse # ${i}...`);
            let rand = Math.random();
            let click = rand <= ctr;
            let scraper = phantomjs.exec(script, url, click);
            let stdout = '';
            let stderr = '';

            scraper.stdout.on('data', function (data) {
                stdout += data.toString();
            });
            scraper.stderr.on('data', function (data) {
                stderr = data.toString();
            });

            scraper.stdout.pipe(process.stdout);
            scraper.stderr.pipe(process.stderr);

            scraper.on('exit', function () {
                if (stderr !== '') {
                    console.warn(`Scraper exited with errors: ` + stderr.toString());
                } else {
                    console.log(`Scraping exited successfully.` + stdout.toString());
                }
            });

            // Iterate here, need to handle it in recursive function
            // so that new timeout created {delay} after previous
            // delay
            i++;
            if (i < imps){
                loopWithDelay();
            } else {
                console.log("Test finished!");
                process.exit(0);
            }
        }, delay);
    }
    loopWithDelay();
};
crawl(100000,0.05,2592);

