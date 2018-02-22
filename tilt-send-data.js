#!/usr/bin/env node

var path = require('path');
var pkg = require(path.join(__dirname, 'package.json'));
var Bleacon = require('bleacon');
var request = require('request');

const pickObject = (obj, keys) => Object.keys(obj)
    .filter(key => keys.indexOf(key) >= 0)
    .reduce((newObj, key) => Object.assign(newObj, { [key]: obj[key] }), {});

// Parse command line options
var program = require('commander');
program
    .version(pkg.version)
    .option('-u, --url [url]', 'post to specified url [https://things.com]', '')
    .option('-T --token [token]', 'ubidots token')
    .option('-t --timeout [timeout]', 'interval timeout to send the request (in minutes)')
    .option('-m, --measuredPower [measuredPower]', 'add measured power reading to the request')
    .option('-a, --accuracy [accuracy]', 'add accuracy reading to the request')
    .option('-p, --proximity [proximity]','add reading to the request')

program.parse(process.argv);

let readyToSendData = true;

function buildPayload(bleacon){

    bleacon.timeStamp = Date.now(); // Set the actual timestamp

    // Build the payload by default
    var payload = {
        "temperature":{ "value": bleacon.major, "timestamp": bleacon.timeStamp },
        "gravity": { "value": bleacon.minor/1000, "timestamp": bleacon.timeStamp },
        "rssi": { "value": bleacon.rssi, "timestamp": bleacon.timeStamp }
    };

    // Add to the payload the optional parameters
    const addToPayload = (key, bleacon) => ({ value: bleacon[key], timestamp: bleacon.timeStamp });
    const keys = ['measuredPower', 'accuracy', 'proximity'];
    const filteredObject = pickObject(program, keys);

    for (key in filteredObject) {
        const keyName = filteredObject[key];
        payload[keyName] = addToPayload(key, bleacon);
    }

    if (payload[program.proximity]) {
        var payloadParseData = payload[program.proximity];
        payload[program.proximity] = { value: 1, context: { prox : payloadParseData.value }, timestamp: bleacon.timeStamp };
    }
    return payload;
}

function sendData(payload, deviceLabel) {
    // Host to  handle the request
    var url = 'https://industrial.api.ubidots.com/api/v1.6/devices/' + deviceLabel;

    // Re-assigns the URL if is received as optional parameters
    if (program.url != '') {
        url = program.url;
    }

    //Configure and handle the HTTP request
    request({
        url: url,
        method: 'POST',
        body: payload,
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': program.token
        }
    }, function (error, response, body) {
        if (error) {
            console.log(error);
        } else {
            console.log(body);
        }
    });
}

Bleacon.on('discover', function (bleacon) {
    // Identifies the TILT Hydrometer available
    tilt = {
        "a495bb10c5b14b44b5121370f02d74de": "Red",
        "a495bb20c5b14b44b5121370f02d74de": "Green",
        "a495bb30c5b14b44b5121370f02d74de": "Black",
        "a495bb40c5b14b44b5121370f02d74de": "Purple",
        "a495bb50c5b14b44b5121370f02d74de": "Orange",
        "a495bb60c5b14b44b5121370f02d74de": "Blue",
        "a495bb70c5b14b44b5121370f02d74de": "Pink"
    };

    if (tilt[bleacon.uuid] != null) {
        var deviceLabel = tilt[bleacon.uuid] + '-' + bleacon.uuid; // Assigns the device label based on the TILT identified
        var payload = buildPayload(bleacon); // Handles the data received to build the JSON payload
        var timeout = program.timeout * 60 * 1000; // Sets the interval timeout to send the request (minutes)

        if (readyToSendData) {
            setTimeout(function () {
                readyToSendData = true;
            }, timeout);
            readyToSendData = false;
            sendData(payload, deviceLabel);
        }
    }
});

Bleacon.startScanning();

if (!program.token || !program.timeout) {
    throw new Error('--token --timeout required. Please type --help for more information');
}

console.log('Initializing...');

