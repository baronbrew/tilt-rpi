# tilt-send-data                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                               
Nodejs Command Line Utility to read Tilt Hydrometers and Post data to a Cloud Service (**[ubidots.com](https://ubidots.com/)**)                                                                                                                                                                                          
                                                                                                                                                                                                                                                                               
**NOTE:** The source code of this repository is available at [Github](https://github.com/baronbrew/tilt-scan).                                                                                                                                                                  
                                                                                                                                                                                                                                                                               
## Requirements                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                               
* [NodeJs and npm](https://gist.github.com/isaacs/579814#file-node-and-npm-in-30-seconds-sh)                                                                                                                                                                                   
* Bluetooth 4.0                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                               
## Installations Required                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                               
1.- Using **npm**, install the utility:                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                               
```                                                                                                                                                                                                                                                                            
$ npm install -g tilt-send-data                                                                                                                                                                                                                                                
```                                                                                                                                                                                                                                                                            
2.- The libraries required are [**node-bleacon**](https://github.com/sandeepmistry/node-bleacon) and [**request**](https://github.com/request/request). If you don't already have them, please install them using the following commands:                                       

* Bleacon Library: 

```
$ npm install bleacon
```

* Request Library:

```
$ npm install request
```

## Command Line

The command **requires** the following arguments to be able to handle data data with Ubidots:

```
-T --token [token] -> Ubidots TOKEN
-t --timeout [timeout] -> Interval timeout to send the request (in minutes)
```

Reference to the following guide to know where is located the [TOKEN](http://help.ubidots.com/user-guides/find-your-token-from-your-ubidots-account) of your [Ubidots Account](https://industrial.ubidots.com/accounts/signin/).

To run the command reference to the structure below: 

```
$ node tilt-send-data.js -T "{Ubidots_TOKEN}" -t {timeout_in_minutes} 
```

**Command example**:

```
$ node tilt-send-data.js -T "BBFF-KvcUDRGARBkUDR5bogMVuKVcKigvsYAMvVVr9H278H2u2M34KvSne8R" -t 1
```

The command above will handle a request with **temperature**, **gravity**, and **rssi** values every one minute.

**Server Response**:

```
{ 
  rssi: [ { status_code: 201 } ],
  temperature: [ { status_code: 201 } ],
  gravity: [ { status_code: 201 } ] 
}

```

### Optional Arguments

* **Data values optional arguments**:
 
As optional arguments you can handle **measured power**, **accuracy**, and **proximity** values:

```
-m, --measuredPower [measuredPower] -> add measured power reading to the request
-a, --accuracy [accuracy] -> add accuracy reading to the request
-p, --proximity [proximity] -> add reading to the request

```

To run the command with the optional arguments reference to the structure below:

```
$ node tilt-send-data.js -T "{Ubidots_TOKEN}" -t {timeout_in_minutes} -m "{device_label_mesuredPower}" -a "{device_label_accuracy}" -p "{device_label_proximity}"
```

**Command example**:

```
$ node tilt-send-data.js -T "BBFF-NJwpJlGARBkUDRpC7hC05KVcKigvsYT9MboVUw9H278H2uNQC1nne8R" -t 1 -m "mesuredPower" -a "accuracy" -p "proximity"
```

The command above will handle a request with the default data (**temperature**, **gravity**, and **rssi**), plus the **measured power**, **accuracy**, and **proximity** values every one minute.

**Server Response**:

```
{ 
  temperature: [ { status_code: 201 } ],                                                                                                                                                                                                                                       
  proximity: [ { status_code: 201 } ],                                                                                                                                                                                                                                         
  gravity: [ { status_code: 201 } ],                                                                                                                                                                                                                                           
  rssi: [ { status_code: 201 } ],                                                                                                                                                                                                                                              
  mesuredpower: [ { status_code: 201 } ],                                                                                                                                                                                                                                      
  accuracy: [ { status_code: 201 } ] 
} 
```

* **Ubidots Server optional argument**:

The host assigned by default is `industrial.api.ubidots.com` which is the one assigned for the **Ubidots Business License**. If you are under the **Ubidots Education License**, you should use the host `things.ubidots.com`. To replace it, you ought to assign it as argument:

```
-u, --url [url] -> post to specified url 
```
 
## Addtionals Resources

For more information about the Ubidots Cloud visualization with the incoming data, reference to the following [guide](http://help.ubidots.com/iot-projects-tutorials/connect-the-tilt-hydrometer-raspberry-pi-to-ubidots)
